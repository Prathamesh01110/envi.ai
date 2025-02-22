"use client"; // Ensures this component runs on the client side

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, db, storage, googleProvider } from "../../firebase"; // Ensure correct Firebase config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Link from "next/link";
// import AddAvatar from "../img/addAvatar.png"; // Ensure correct image path

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          language: 'en'
        });

        await setDoc(doc(db, "userChats", user.uid), {});
      }

      router.push("/");
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(false); // Reset error state

    const file = e.target[3].files[0];

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Ensure the user is authenticated
      if (!res.user) {
        throw new Error("User is not authenticated");
      }

      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress, if needed
        },
        (error) => {
          console.error("Upload error:", error);
          setErr(true);
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Update profile
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });

          try {
            // Create user on Firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            // Create empty user chats on Firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});

            router.push("/");
          } catch (firestoreErr) {
            console.error("Firestore error:", firestoreErr);
            setErr(true);
            setLoading(false);
          }

          setLoading(false);
        }
      );
    } catch (authErr) {
      console.error("Error creating user:", authErr);
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center">Elite Chat</h1>
        <h2 className="text-lg text-center text-gray-600 mt-2">Register</h2>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
          />
          <input
            required
            type="email"
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            required
            type="password"
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file" className="flex items-center gap-2 cursor-pointer">
            <Image src={AddAvatar} alt="Add Avatar" width={30} height={30} />
            <span className="text-gray-500">Add an avatar</span>
          </label>
          <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition" disabled={loading}>
            {loading ? "Uploading..." : "Sign Up"}
          </button>
          {err && <span className="text-red-500 text-sm">Something went wrong</span>}
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link className="text-blue-500" href="/login">Login</Link>
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 bg-white border p-2 rounded-lg mt-4 w-full hover:bg-gray-100 transition"
        >
          <img width="24" height="24" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Register;





//Styles
const formContainer = {
  backgroundImage: `url(${ReactImage})`,
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const formWrapper = {
  backgroundColor: 'white',
  padding: '20px 60px',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'center',
};

const logo = {
  color: '#5d5b8d',
  fontWeight: 'bold',
  fontSize: '24px',
};

const title = {
  color: '#5d5b8d',
  fontSize: '12px',
};

const form = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const input = {
  padding: '15px',
  border: 'none',
  width: '250px',
  borderBottom: '1px solid #a7bcff',
};

const button = {
  backgroundColor: '#7b96ec',
  color: 'white',
  padding: '10px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
};

const label = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#8da4f1',
  fontSize: '12px',
  cursor: 'pointer',
};

const labelImg = {
  width: '32px',
};

const paragraph = {
  color: '#5d5b8d',
  fontSize: '12px',
  marginTop: '10px',
};
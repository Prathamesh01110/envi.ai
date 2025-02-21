"use client"; // Ensures the component runs only on the client side

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase"; // Ensure correct Firebase config
import Link from "next/link";

const Login = () => {
    const [err, setErr] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handlegoogle = async () => {
      try {
        await signInWithPopup(auth, googleProvider);
        router.push("/chat");
      } catch (err) {
        console.error("Google sign-in error:", err);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
      } catch (err) {
        setErr(true);
      }
    };
  
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold text-center">Elite Chat</h1>
          <h2 className="text-lg text-center text-gray-600 mt-2">Login</h2>
          <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">
              Sign in
            </button>
            {err && <span className="text-red-500 text-sm">Something went wrong</span>}
          </form>
          <p className="text-sm text-center mt-4">
            Don't have an account? <Link className="text-blue-500" href="/register">Register</Link>
          </p>
          <button
            onClick={handlegoogle}
            className="flex items-center justify-center gap-2 bg-white border p-2 rounded-lg mt-4 w-full hover:bg-gray-100 transition"
          >
            <img width="24" height="24" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  };
  
  export default Login;





//Styles
const formContainer = {
  backgroundColor: '#f0f0f0',
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


const paragraph = {
  color: '#5d5b8d',
  fontSize: '12px',
  marginTop: '10px',
};
"use client";

import React, { useContext } from "react";
import Sidebar from "../../components/chat/Sidebar";
import Chat from "../../components/chat/Chat";
import "../style.scss";
import New from "@components/New";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation"; // Import Next.js router

const ChatS = () => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  // Redirect to login if user is not authenticated
  if (!currentUser) {
    router.push("/login");
    return (
      <div>
        login if not developed
      </div>
    )
  }

  return (
    <div>
      <New />
      <div className="home h-screen w-full flex items-center justify-center bg-gray-200">
        <div className="container flex h-[90vh] w-[90%] bg-white rounded-xl shadow-lg overflow-hidden">
          <Sidebar />
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default ChatS;

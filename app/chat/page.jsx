"use client";

import React from 'react'
import Sidebar from '../../components/chat/Sidebar'
import Chat from '../../components/chat/Chat'
import "../style.scss"
import New from '@components/New';
// import Navbar from '../../components/navbar';

const ChatS = () => {
  return (
    <div>
      <New/>
    <div className="home h-screen w-full flex items-center justify-center bg-gray-200">
        
      <div className="container flex h-[90vh] w-[90%] bg-white rounded-xl shadow-lg overflow-hidden">
        <Sidebar />
        <Chat />
      </div>
    </div> 
  </div>
  )
}

export default ChatS;

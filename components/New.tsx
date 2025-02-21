"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LanguageContext } from "@/context/LanguageContext";
import languagesData from "@components/data.json";

export default function New() {
  const [isOpen, setIsOpen] = useState(false);
  const languageContext = useContext(LanguageContext);

  if (!languageContext) {
    throw new Error("LanguageContext must be used within a LanguageProvider");
  }
  
  const { targetLang, updateUserLanguage } = languageContext;
  

  const handleLanguageChange = (e:any) => {
    updateUserLanguage(e.target.value);
  };

  return (
    <nav className="sticky top-0 bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Envi.Ai</div>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/chat" className="hover:text-gray-300">Chat</Link>
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/v2a" className="hover:text-gray-300">v2A</Link>
          <select
            value={targetLang}
            onChange={handleLanguageChange}
            className="bg-gray-800 text-white p-2 rounded"
          >
            {Object.entries(languagesData.languages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-2 bg-gray-800 p-4 rounded-lg">
          <Link href="/chat" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Chat</Link>
          <Link href="/dashboard" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link href="/v2a" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>v2A</Link>
          <select
            value={targetLang}
            onChange={handleLanguageChange}
            className="bg-gray-800 text-white p-2 rounded"
          >
            {Object.entries(languagesData.languages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}

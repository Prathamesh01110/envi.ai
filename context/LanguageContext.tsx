"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  targetLang: string;
  updateUserLanguage: (language: string) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [targetLang, setTargetLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("targetLang");
    if (savedLang) {
      setTargetLang(savedLang);
    }
  }, []);

  const updateUserLanguage = (language: string) => {
    setTargetLang(language);
    localStorage.setItem("targetLang", language);
  };

  return (
    <LanguageContext.Provider value={{ targetLang, updateUserLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

import "@/styles/globals.css";
export const metadata = {
  title: "Envi.Ai",
  description: "Envi.ai is a Enchanment Tool for the Workflow Development",
};
import { AuthContextProvider } from "../context/AuthContext";
import { ChatContextProvider } from "../context/ChatContext";
import { LanguageProvider } from "@/context/LanguageContext";


const RootLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <html lang="en">
      <LanguageProvider>
        <AuthContextProvider>
        <ChatContextProvider>
      <body>
        {children}
      </body>
      </ChatContextProvider>
      </AuthContextProvider>
      </LanguageProvider>
    </html>
    
  );
};

export default RootLayout;

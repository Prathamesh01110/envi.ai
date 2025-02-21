import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { LanguageContext } from "../../context/LanguageContext"; // Import LanguageContext
import axios from "axios";

const Message = ({ message, allMessages }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { targetLang } = useContext(LanguageContext); // Get selected language
  
  const ref = useRef();
  
  // State management
  const [translatedText, setTranslatedText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [isTranslated, setIsTranslated] = useState(false);
  const [isSummarized, setIsSummarized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showSummaryPopup, setShowSummaryPopup] = useState(false);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Function to translate text
  const translateMessage = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
  
    setIsLoading(true);
    setShowOptions(false);

    try {
      const fallbackResponse = await axios.post(
        "https://multilingual-text-and-speech-translator.onrender.com/translate-text",
        {
          text: message.text,
          sourceLang: "auto", // Auto-detect source language
          targetLang: targetLang, // Use selected target language
        }
      );
      
      const translated = fallbackResponse.data.translatedText || fallbackResponse.data.translation;
      
      if (translated) {
        setTranslatedText(translated);
        setIsTranslated(true);
      }
    } catch (fallbackError) {
      console.error("Translation failed:", fallbackError);
      alert("Translation service cannot be reached. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to summarize the entire conversation of the sender
  const summarizeConversation = async () => {
    if (isSummarized) {
      setIsSummarized(false);
      setShowSummaryPopup(false);
      return;
    }

    setIsLoading(true);
    setShowOptions(false);

    const senderMessages = (allMessages || []) 
    .filter((msg) => msg.senderId === message.senderId)
    .map((msg) => msg.text)
    .join(" ");
  
  console.log("this is the system message:", senderMessages);
  

    

    try {
      const GROQ_API_KEY = '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'
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "As you get the message just give the summerie of the context of the message till now don't mention the other use less things"
            },
            {
              role: "user",
              content: `Please summarize this entire conversation in detail: "${senderMessages}"`
            }
          ],
          temperature: 0.3,
          max_tokens: 200
        },
        {
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      const summary = response.data.choices[0]?.message?.content;
      
      if (summary) {
        setSummarizedText(summary);
        setIsSummarized(true);
        setShowSummaryPopup(true);
      }
    } catch (error) {
      console.error("Summarization failed:", error);
      alert("Summarization service cannot be reached. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid ? "owner" : ""}`}>
      <div className="messageInfo">
        <img
          src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <div className="message-body">
          <p>
            {isTranslated ? translatedText : message.text}
            
            {/* Message actions container */}
            <span className="message-actions">
              {isLoading ? (
                <span className="loading-indicator">Processing...</span>
              ) : (
                <div className="options-container" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="three-dots-btn"
                    onClick={() => setShowOptions(!showOptions)}
                    aria-label="Message options"
                  >
                    ⋮
                  </button>
                  
                  {showOptions && (
                    <div className="options-menu">
                      <button onClick={translateMessage}>
                        {isTranslated ? "Show Original" : `Translate to ${targetLang.toUpperCase()}`}
                      </button>
                      <button onClick={summarizeConversation}>
                        {isSummarized ? "Hide Summary" : "Summarize Conversation"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </span>
          </p>
        </div>
      </div>

      {/* Summary Popup */}
      {showSummaryPopup && (
        <div className="summary-popup">
          <div className="popup-content">
            <h3>Conversation Summary</h3>
            <p>{summarizedText}</p>
            <button onClick={() => setShowSummaryPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Popup Styles */}
      <style jsx>{`
        .summary-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          padding: 20px;
          color: white;
          border-radius: 8px;
          z-index: 1000;
        }

        .popup-content {
          text-align: center;
        }

        .popup-content h3 {
          margin-bottom: 10px;
        }

        .popup-content p {
          font-size: 14px;
          line-height: 1.5;
        }

        .popup-content button {
          margin-top: 10px;
          padding: 5px 10px;
          border: none;
          cursor: pointer;
          background: red;
          color: white;
          border-radius: 4px;
        }

        .popup-content button:hover {
          background: darkred;
        }
      `}</style>
    </div>
  );
};

export default Message;

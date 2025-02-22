import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { LanguageContext } from "../../context/LanguageContext";
import axios from "axios";

const Message = ({ message, allMessages }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { targetLang } = useContext(LanguageContext);
  
  const ref = useRef();
  const popoverRef = useRef(); // Reference for closing popover when clicking outside

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

    // Close the popover when clicking outside
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to translate text
  const translateMessage = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    setIsLoading(true);
    setShowOptions(false);

    try {
      const response = await axios.post(
        "https://multilingual-text-and-speech-translator.onrender.com/translate-text",
        {
          text: message.text,
          sourceLang: "auto",
          targetLang: targetLang,
        }
      );

      const translated = response.data.translatedText || response.data.translation;

      if (translated) {
        setTranslatedText(translated);
        setIsTranslated(true);
      }
    } catch (error) {
      console.error("Translation failed:", error);
      alert("Translation service cannot be reached. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to summarize the entire conversation
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
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "Summarize the conversation concisely." },
            { role: "user", content: `Summarize this: "${senderMessages}"` },
          ],
          temperature: 0.3,
          max_tokens: 200,
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
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
          <p className="flex flex-row gap-4">
            {isTranslated ? translatedText : message.text}

            {/* Three dots button for options */}
            <div className="options-container" ref={popoverRef}>
              <button
                className="three-dots-btn"
                onClick={() => setShowOptions(!showOptions)}
                aria-label="Message options"
              >
                ⋮
              </button>

              {/* Options popover */}
              {showOptions && (
                <div className="popover-menu">
                  <button onClick={translateMessage}>
                    {isTranslated ? "Show Original" : "Translate"}
                  </button>
                  <button onClick={summarizeConversation}>
                    {isSummarized ? "Hide Summary" : "Summarize"}
                  </button>
                </div>
              )}
            </div>
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

      {/* Styles for Popover & Summary */}
      <style jsx>{`
        .message {
          position: relative;
          display: flex;
          align-items: flex-start;
          padding: 10px;
          // max-width: 70%;
          word-wrap: break-word;
          // background: #f1f1f1;
          border-radius: 10px;
          margin-bottom: 10px;
        }

        .three-dots-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 5px;
          margin-left: 10px;
        }

        .options-container {
          position: relative;
          display: inline-block;
        }

        .popover-menu {
          position: absolute;
          top: 30px;
          right: 0;
          background: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          color:black;
          padding: 8px;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .popover-menu button {
          border: none;
          background: none;
          padding: 8px 12px;
          cursor: pointer;
          text-align: left;
          width: 100%;
        }

        .popover-menu button:hover {
          background: lightgray;
          color:black;
        }

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

        .popup-content button {
          background: red;
          color: white;
          border: none;
          cursor: pointer;
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

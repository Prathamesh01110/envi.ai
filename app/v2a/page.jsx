'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play } from 'lucide-react';
import axios from 'axios';

export default function VoiceToText() {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += text;
          }
        }
        setTranscript((prev) => prev + finalTranscript);
      };

      recognitionRef.current.onstart = () => setIsRecording(true);
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        sendToGroqAPI(transcript); // Process text when recording stops
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const sendToGroqAPI = async (text) => {
    const GROQ_API_KEY = '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';
    if (!text.trim()) return;
    
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "Generate only the email body in proper HTML format inside a JSON object. Do not include the subject, title, or extra information. Ensure the email is brief, professional, and well-structured based on the given input."
            },
            { role: "user", content: `Generate an email body based on this: "${text}"` },
          ],
          temperature: 0.3,
          max_tokens: 200,
        },        
        {
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`, // ✅ Fixed formatting
            "Content-Type": "application/json",
          },
        }
      );

      const improvedText = response.data.choices[0].message.content;
      console.log('Groq Improved Text:', improvedText);
      sendEmail(improvedText);
    } catch (error) {
      console.error('❌ Error processing with Groq:', error);
    }
  };

  const sendEmail = async (improvedText) => {
    console.log('📧 Sending Email...');
    const emailData = {
      subject: 'Welcome to Our Platform!',
      title: 'Welcome Aboard!',
      body: improvedText,
      html: improvedText
    };
    
    console.log("📧 Email Data Payload:", emailData);

    try {
      const userId = 'shashi2005.rajput@gmail.com';
      const recipientId = '223shashikant6006@SVGForeignObjectElement.edu.in';
      
      // ✅ Fixed fetch URL formatting
      const response = await fetch(
        `https://895b-123-252-147-173.ngrok-free.app/send-mail/${userId}/${recipientId}/send`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData),
          mode: 'cors' // ✅ Ensure CORS support
        }
      );

      const responseData = await response.json();
      console.log("📩 Email API Response:", responseData);
      
      if (response.ok) {
        console.log('✅ Email Sent Successfully');
      } else {
        console.error('❌ Failed to send email');
      }
    } catch (error) {
      console.error('⚠ Error sending email:', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold mb-4">Voice to Text</h2>
      <Button onClick={toggleRecording} className="mb-4">
        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />} 
        {isRecording ? ' Stop' : ' Start'}
      </Button>
      <div className="p-3 border rounded bg-gray-100 text-left min-h-[100px]">
        {transcript || 'Start speaking...'}
      </div>
      <Button onClick={() => sendToGroqAPI(transcript)} className="mt-4">
        <Play className="w-5 h-5" /> Run
      </Button>
    </div>
  );
}
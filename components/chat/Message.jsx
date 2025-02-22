'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play } from 'lucide-react';

export default function VoiceToText() {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const GROQ_API_KEY = "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";

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
        summarizeWithGroq(transcript); // Summarize and send email after recording stops
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

  const summarizeWithGroq = async (text) => {
    if (!text.trim()) return;
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "Summarize the conversation concisely." },
            { role: "user", content: `Summarize this: "${text}"` },
          ],
          temperature: 0.3,
          max_tokens: 200,
        },
        {
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const summarizedText = response.data.choices[0].message.content;
      console.log('Groq Summary:', summarizedText);
      sendEmail(summarizedText);
    } catch (error) {
      console.error('Error summarizing with Groq:', error);
    }
  };

  const sendEmail = async (summarizedText) => {
    const emailData = {
      subject: 'Welcome to Our Platform!',
      title: 'Welcome Aboard!',
      body: summarizedText,
      html: `<h1>Welcome Aboard!</h1><p>${summarizedText}</p>`
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/send-mail/userId/recipientId/send',
        emailData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        console.log('Email Sent Successfully');
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
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
      <Button onClick={() => summarizeWithGroq(transcript)} className="mt-4">
        <Play className="w-5 h-5" /> Run
      </Button>
    </div>
  );
}

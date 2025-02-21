'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import New from '@components/New';

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
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            sendToGrokAPI(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        setTranscript((prev) => prev + finalTranscript + interimTranscript);
      };

      recognitionRef.current.onstart = () => setIsRecording(true);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const sendToGrokAPI = (transcript) => {
    console.log('Sending to Grok API:', transcript);
    // Implement API call here
  };

  return (
    <div className=''>
        <New/>
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold mb-4">Voice to Text</h2>
      <Button onClick={toggleRecording} className="mb-4">
        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />} 
        {isRecording ? ' Stop' : ' Start'}
      </Button>
      <div className="p-3 border rounded bg-gray-100 text-left min-h-[100px]">
        {transcript || 'Start speaking...'}
      </div>
    </div>
    </div>
  );
}

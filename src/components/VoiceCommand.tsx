"use client";

import { useState, useEffect } from 'react';
import { IconMicrophone } from '@tabler/icons-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type VoiceCommandProps = {
  onTextChange: (text: string) => void;
  language?: string;
};

export default function VoiceCommand({ onTextChange, language = 'en-US' }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTextChange(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.abort();
    };
  }, [isListening, language, onTextChange]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <button
      onClick={toggleListening}
      type="button"
      className={`p-1 rounded-full transition-colors ${
        isListening ? 'text-blue-500' : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      <IconMicrophone size={20} />
    </button>
  );
}
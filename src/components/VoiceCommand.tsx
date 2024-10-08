"use client";

import { useState, useEffect, useCallback } from 'react';
import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react';

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
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFinalResult, setHasFinalResult] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;

      recognitionInstance.onresult = (event: any) => {
        const result = event.results[0];
        if (result.isFinal) {
          onTextChange(result[0].transcript);
          setHasFinalResult(true);
          stopListening();
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, onTextChange]);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setError(null);
      setHasFinalResult(false);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!recognition) {
    return <p>Speech recognition is not supported in this browser.</p>;
  }

  return (
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full ${
          isListening ? 'bg-red-600' : 'bg-white/10'
        } hover:opacity-80 transition duration-200`}
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? (
          <IconMicrophoneOff className="h-6 w-6 text-white" />
        ) : (
          <IconMicrophone className="h-6 w-6 text-white" />
        )}
      </button>
      {isListening && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
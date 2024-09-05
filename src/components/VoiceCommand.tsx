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
  onTranscript: (transcript: string) => void;
  language?: string;
};

export default function VoiceCommand({ onTranscript, language = 'en-US' }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setError(null);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;

      recognitionInstance.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          onTranscript(result[0].transcript);
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
  }, [language, onTranscript]);

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
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full ${
          isListening ? 'bg-red-600' : 'bg-blue-600'
        } hover:opacity-80 transition duration-200`}
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? (
          <IconMicrophoneOff className="h-6 w-6" />
        ) : (
          <IconMicrophone className="h-6 w-6" />
        )}
      </button>
      {isListening && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
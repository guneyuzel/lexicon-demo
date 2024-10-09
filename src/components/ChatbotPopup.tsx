"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconMessageCircle } from "@tabler/icons-react";
import CommandCenter from "./CommandCenter";

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-gray-800 rounded-lg shadow-lg w-96 h-[500px] flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gray-800">
            <h3 className="text-xl font-semibold text-white">AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IconX size={24} />
            </button>
          </div>
          <div className="flex-grow overflow-hidden">
            <CommandCenter />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition duration-300"
        >
          <IconMessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
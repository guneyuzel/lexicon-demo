"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconMessageCircle } from "@tabler/icons-react";
import CommandCenter from "./CommandCenter";

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl h-[500px] flex flex-col"
            >
              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-t-lg">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white text-black p-4 rounded-lg shadow-lg hover:bg-purple-400 transition duration-300 flex items-center justify-center"
      >
        <IconMessageCircle size={24} className="mr-2" />
        <span>Open AI Assistant</span>
      </button>
    </div>
  );
}
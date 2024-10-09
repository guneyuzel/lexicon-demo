"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconMessageCircle } from "@tabler/icons-react";
import CommandCenter from "./CommandCenter";

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="w-full max-w-3xl h-[80vh] bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col">
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
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg z-10"
        >
          <IconMessageCircle size={32} />
        </motion.button>
      )}
    </>
  );
}
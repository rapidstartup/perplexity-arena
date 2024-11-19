import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot } from 'lucide-react';

interface RefereeWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  commentary?: string;
  hasResponses: boolean;
}

export function RefereeWidget({ isOpen, onClose, loading, commentary, hasResponses }: RefereeWidgetProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 w-[30%] h-screen bg-red-600 text-white p-6 shadow-xl z-50"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-red-500 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">LLM Referee 📢</h2>
              </div>
              <p className="text-sm opacity-80">(by Grok!)</p>
              
              <img 
                src="https://i.ibb.co/fvCW6DC/grok-removebg-preview.png" 
                alt="Grok"
                className="w-24 h-24 mx-auto"
              />

              <div className="mt-6 bg-red-500 rounded-lg p-4">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{commentary}</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            onClick={hasResponses ? onClose : undefined}
            initial={false}
            animate={{
              scale: hasResponses ? [1, 1.1, 1] : 1,
              backgroundColor: hasResponses ? 'rgb(220, 38, 38)' : 'rgb(75, 85, 99)'
            }}
            transition={{
              scale: {
                repeat: hasResponses ? Infinity : 0,
                repeatType: "reverse",
                duration: 1
              }
            }}
            className={`fixed right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-3 text-white rounded-l-lg shadow-lg z-50 ${
              hasResponses ? 'hover:bg-red-500' : 'cursor-not-allowed opacity-75'
            }`}
            whileHover={hasResponses ? { x: -5 } : undefined}
          >
            <Bot className={`w-5 h-5 ${hasResponses ? 'animate-bounce' : ''}`} />
            <span className="text-sm font-medium">
              {hasResponses ? 'View Referee' : 'Start your battle first!'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
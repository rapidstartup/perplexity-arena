import React, { useState } from 'react';
import { Send, Image, Mic, Search } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  tools: string; // Pass tools from the selected model
  disabled: boolean; // New disabled prop
  hoverText?: string; // New optional hover text for when the input is disabled
}

export function ChatInput({ onSend, tools, disabled, hoverText }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) { // Prevent submission if disabled
      onSend(input);
      setInput('');
    }
  };

  const isSearchEnabled = tools.includes('Search');

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <div className="absolute left-4 flex items-center gap-3">
        <Image className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-gray-400 dark:text-gray-500'}`} />
        <Mic className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-gray-400 dark:text-gray-500'}`} />
        <Search
          className={`w-5 h-5 ${
            isSearchEnabled && !disabled
              ? 'text-blue-400 dark:text-blue-500 animate-pulse'
              : 'text-gray-300'
          }`}
        />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled} // Disable input field when disabled is true
        title={disabled && hoverText ? hoverText : ''} // Show hover text when disabled
        className={`w-full pl-28 pr-12 py-3 ${
          disabled ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'
        } text-gray-900 dark:text-gray-100 border ${
          disabled ? 'border-gray-300 dark:border-gray-700' : 'border-gray-300 dark:border-gray-700'
        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
      />
      <button
        type="submit"
        disabled={disabled} // Disable button when disabled is true
        className={`absolute right-4 p-1 ${
          disabled ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:text-blue-400'
        }`}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}

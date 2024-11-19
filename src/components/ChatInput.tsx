import React, { useState } from 'react';
import { Send, Image, Mic, Search } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <div className="absolute left-4 flex items-center gap-3">
        <Image className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <Mic className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="w-full pl-24 pr-12 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="absolute right-4 p-1 text-blue-500 hover:text-blue-400"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
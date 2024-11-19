import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  title: string;
}

export function ChatWindow({ messages, title }: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200'
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {/* Render response time for assistant messages */}
              {message.role === 'assistant' && message.responseTime && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Response time: {message.responseTime} ms
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

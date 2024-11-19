import React, { useState } from 'react';
import { Check, ExternalLink, Pencil } from 'lucide-react';

interface ApiKeyInputProps {
  onSave: (key: string) => void;
}

export function ApiKeyInput({ onSave }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey);
      localStorage.setItem('perplexity_api_key', apiKey);
      setIsEditing(false);
      setIsSaved(true);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Perplexity API key"
          disabled={!isEditing}
          className={`flex-1 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            !isEditing ? 'opacity-75' : ''
          }`}
        />
        {isEditing ? (
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className={`p-2 rounded-lg transition-colors ${
              apiKey.trim()
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="p-2 bg-green-800 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Pencil className="w-5 h-5" />
          </button>
        )}
      </div>
      <a
        href="https://perplexity.ai/pro?referral_code=XA334T47"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400"
      >
        Get Perplexity API key <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
import React from 'react';
import { Twitter } from 'lucide-react';
import { PerplexityIcon } from './PerplexityIcon';

export function Footer() {
  return (
    <footer className="mt-8 pb-4">
      <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <a
          href="https://perplexity.ai/pro?referral_code=XA334T47"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <PerplexityIcon className="w-4 h-4" />
          <span>Get Perplexity Pro</span>
        </a>
        <a
          href="https://x.com/lifeonautosite"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <Twitter className="w-4 h-4" />
          <span>@lifeonautosite</span>
        </a>
      </div>
    </footer>
  );
}
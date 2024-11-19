import React, { useState, useEffect } from 'react';
import { Sun, Moon, Swords } from 'lucide-react';
import { ModelSelect } from './components/ModelSelect';
import { ChatInput } from './components/ChatInput';
import { ApiKeyInput } from './components/ApiKeyInput';
import { ChatWindow } from './components/ChatWindow';
import { Footer } from './components/Footer';
import { RefereeWidget } from './components/RefereeWidget';
import { Message, ChatResponse } from './types';
import { MODELS } from './data/models';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [model1, setModel1] = useState('');
  const [model2, setModel2] = useState('');
  const [messages1, setMessages1] = useState<Message[]>([]);
  const [messages2, setMessages2] = useState<Message[]>([]);
  const [isRefereeOpen, setIsRefereeOpen] = useState(false);
  const [refereeLoading, setRefereeLoading] = useState(false);
  const [refereeCommentary, setRefereeCommentary] = useState<string>();
  const [hasResponses, setHasResponses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('perplexity_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const makeRequest = async (model: string, messages: Message[]): Promise<ChatResponse> => {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get response from ${model}: ${error.message}`);
      }
      throw error;
    }
  };

  const getGrokCommentary = async (response1: ChatResponse, response2: ChatResponse) => {
    setRefereeLoading(true);
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer xai-qrbbhmGEal8VsaL62Si1KuH1tcwJf5MJZmNDPgOedZ8HT9kMIDgGPTsEf4zPUoDeJCTmjhYxuUejMC8q',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a trash talking sh*tposter that loves to make fun of llms responses. Take a look at the following 2 chats on the Perplexity Battleground arena that a user is trying to compare. Make a comment about them both and give a ruling on which gave the best response in the most humourous way possible.'
            },
            {
              role: 'user',
              content: JSON.stringify({
                response1: response1.choices[0].message.content,
                response2: response2.choices[0].message.content
              })
            }
          ],
          model: 'grok-beta',
          temperature: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get Grok commentary');
      }

      const data = await response.json();
      setRefereeCommentary(data.choices[0].message.content);
    } catch (error) {
      console.error('Grok API Error:', error);
      setRefereeCommentary('The referee is taking a coffee break... 🍵');
    } finally {
      setRefereeLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!apiKey || !model1 || !model2) {
      setError('Please set API key and select both models');
      return;
    }

    setError(null);
    const newMessage: Message = { role: 'user', content };
    
    try {
      const [response1, response2] = await Promise.all([
        makeRequest(model1, [...messages1, newMessage]),
        makeRequest(model2, [...messages2, newMessage]),
      ]);

      setMessages1([
        ...messages1,
        newMessage,
        { role: 'assistant', content: response1.choices[0].message.content },
      ]);
      setMessages2([
        ...messages2,
        newMessage,
        { role: 'assistant', content: response2.choices[0].message.content },
      ]);

      setHasResponses(true);
      await getGrokCommentary(response1, response2);
      setIsRefereeOpen(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      console.error('Error:', error);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Swords className="w-8 h-8" />
              Perplexity Battleground ⚔️
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </header>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-8">
            <ApiKeyInput onSave={setApiKey} />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <ModelSelect
              models={MODELS}
              selectedModel={model1}
              otherSelected={model2}
              onChange={setModel1}
              label="Model 1"
            />
            <ModelSelect
              models={MODELS}
              selectedModel={model2}
              otherSelected={model1}
              onChange={setModel2}
              label="Model 2"
            />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 h-[500px]">
            <ChatWindow messages={messages1} title={model1 || 'Model 1'} />
            <ChatWindow messages={messages2} title={model2 || 'Model 2'} />
          </div>

          <ChatInput onSend={handleSendMessage} />

          <Footer />
        </div>

        <RefereeWidget
          isOpen={isRefereeOpen}
          onClose={() => setIsRefereeOpen(!isRefereeOpen)}
          loading={refereeLoading}
          commentary={refereeCommentary}
          hasResponses={hasResponses}
        />
      </div>
    </div>
  );
}

export default App;
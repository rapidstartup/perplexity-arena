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
  const [hasUserSubmitted, setHasUserSubmitted] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingFreeUsage, setRemainingFreeUsage] = useState(1);

  const selectedModel = MODELS.find((model) => model.Model === model1);

  // Default API key from environment
  const builtInApiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;

  useEffect(() => {
    // Load API key and remaining free usage from localStorage
    const savedKey = localStorage.getItem('perplexity_api_key');
    const freeUsage = parseInt(localStorage.getItem('remaining_free_usage') || '1', 10);

    if (savedKey) {
      setApiKey(savedKey);
    } else if (freeUsage > 0) {
      setRemainingFreeUsage(freeUsage);
    }
  }, []);

  useEffect(() => {
    // Save remaining free usage to localStorage
    localStorage.setItem('remaining_free_usage', remainingFreeUsage.toString());
  }, [remainingFreeUsage]);

  const makeRequest = async (model: string, messages: Message[]): Promise<ChatResponse> => {
    if (!apiKey && remainingFreeUsage <= 0) {
      throw new Error('You have used the free trial. Please provide your own API key.');
    }

    const keyToUse = apiKey || builtInApiKey;
    if (!keyToUse) {
      throw new Error('Missing API key.');
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keyToUse}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
      }

      // Decrement remaining free usage if built-in API key is used
      if (!apiKey) {
        setRemainingFreeUsage((prev) => prev - 1);
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
      const grokApiKey = import.meta.env.VITE_GROK_API_KEY;

      if (!grokApiKey) {
        throw new Error('GROK_API_KEY is missing in environment variables');
      }

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${grokApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are a trash talking sh*tposter that loves to make fun of llms responses. Take a look at the following 2 chats on the Perplexity Battleground arena that a user is trying to compare. Make a comment about them both and give a ruling on which gave the best response in the most humorous way possible. You will also see the RESPONSE TIME given, so you can comment on that too. Keep your full response to about 10-20 lines if you can.',
            },
            {
              role: 'user',
              content: JSON.stringify({
                response1: response1.choices[0].message.content,
                response2: response2.choices[0].message.content,
              }),
            },
          ],
          model: 'grok-beta',
          temperature: 1,
        }),
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
    if ((!apiKey && remainingFreeUsage <= 0) || !model1 || !model2) {
      setError('You must provide an API key after your free usage is exhausted.');
      return;
    }

    setError(null);
    setHasUserSubmitted(true); // Trigger the wake-up animation on first submission

    const newMessage: Message = { role: 'user', content };

    // Show user's message instantly
    setMessages1((prevMessages) => [...prevMessages, newMessage]);
    setMessages2((prevMessages) => [...prevMessages, newMessage]);

    setInputDisabled(true); // Disable ChatInput while waiting for responses

    // Track the start time to calculate response times
    const startTime = Date.now();

    // Send requests independently
    const fetchModel1 = async () => {
      try {
        const response = await makeRequest(model1, [...messages1, newMessage]);
        const responseTime = Date.now() - startTime; // Calculate response time
        setMessages1((prevMessages) => [
          ...prevMessages,
          {
            role: 'assistant',
            content: response.choices[0].message.content,
            responseTime,
          },
        ]);
      } catch (error) {
        console.error('Error fetching response for Model 1:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    const fetchModel2 = async () => {
      try {
        const response = await makeRequest(model2, [...messages2, newMessage]);
        const responseTime = Date.now() - startTime; // Calculate response time
        setMessages2((prevMessages) => [
          ...prevMessages,
          {
            role: 'assistant',
            content: response.choices[0].message.content,
            responseTime,
          },
        ]);
      } catch (error) {
        console.error('Error fetching response for Model 2:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    await Promise.all([fetchModel1(), fetchModel2()]);
    setInputDisabled(false); // Re-enable ChatInput when responses are complete
    setHasResponses(true); // Responses are ready

    try {
      const [response1, response2] = await Promise.all([
        makeRequest(model1, [...messages1, newMessage]),
        makeRequest(model2, [...messages2, newMessage]),
      ]);
      await getGrokCommentary(response1, response2);
      setIsRefereeOpen(true);
    } catch (error) {
      console.error('Error fetching Grok commentary:', error);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
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

          {!apiKey && remainingFreeUsage <= 0 && (
            <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-100 rounded-lg">
              You have used your free trial. Please add your own Perplexity API key to continue.
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

          <ChatInput
            onSend={handleSendMessage}
            tools={selectedModel?.Tools || ''}
            disabled={inputDisabled || (!apiKey && remainingFreeUsage <= 0)} // Disable input if necessary
          />

          <Footer />
        </div>

        <RefereeWidget
          isOpen={isRefereeOpen}
          onClose={() => setIsRefereeOpen(!isRefereeOpen)}
          loading={refereeLoading}
          commentary={refereeCommentary}
          hasResponses={hasResponses}
          hasUserSubmitted={hasUserSubmitted}
        />
      </div>
    </div>
  );
}

export default App;

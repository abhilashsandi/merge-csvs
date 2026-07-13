import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';

type Message = {
  role: 'user' | 'model' | 'system';
  text: string;
};

const SYSTEM_PROMPT = `You are a Senior Technical Interviewer conducting a React Mock Interview. 
The candidate has learned about: JS fundamentals (Promises, closures), React core hooks (useEffect, useMemo, custom hooks), React 18 (useDeferredValue, Suspense), React Router, React Testing Library, Controlled vs Uncontrolled components, and React 19 (useActionState, useOptimistic, use hook). 
Instructions:
1. First, pick one random concept from the list above and ask a single, challenging interview question about it.
2. Wait for the candidate to answer.
3. When they answer, evaluate their response critically but constructively. Correct any misconceptions, give them a score out of 10, and then immediately ask the next question on a DIFFERENT random concept.
4. Keep your questions and evaluations concise and professional. Do NOT output markdown headers that are too large, just standard bold text.`;

export function MockInterviewModule() {
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const callGemini = async (chatHistory: Message[]) => {
    if (!apiKey) {
      setError('Please provide a Gemini API Key to start the interview.');
      return;
    }
    setError('');
    setIsTyping(true);

    try {
      const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to begin the mock interview.' }] },
        ...chatHistory.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      ];

      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents
      });

      const modelReply = response.text;

      if (modelReply) {
        setMessages(prev => [...prev, { role: 'model', text: modelReply }]);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleStart = () => {
    if (!apiKey.trim()) {
      setError('API Key is required.');
      return;
    }
    const startMsg: Message = { role: 'user', text: 'Hello! I am ready to start the interview. Please ask me your first question.' };
    setMessages([startMsg]);
    callGemini([startMsg]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { role: 'user', text: inputValue };
    const newHistory = [...messages, newMsg];
    setMessages(newHistory);
    setInputValue('');
    callGemini(newHistory);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          Mock Interviewer
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Powered by Gemini Flash. Practice your React interview skills with an AI interviewer trained on the concepts you just learned.
        </p>
      </div>

      {!messages.length && (
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Gemini API Key {process.env.NEXT_PUBLIC_GEMINI_API_KEY && '(Loaded from Env)'}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all mb-2"
          />
          <p className="text-xs text-slate-500 mb-6">
            You can use the default key from your environment variables, or enter a new one above.
          </p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95"
          >
            Start Interview
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <div className="max-w-4xl mx-auto flex flex-col h-[600px] bg-white/5 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-black/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h3 className="font-bold text-white">Senior React Interviewer</h3>
              <p className="text-xs text-emerald-400">Gemini 3.5 Flash</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((msg, idx) => {
                if (idx === 0) return null; // Skip the hidden start prompt in UI
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-lg ${
                        isUser
                          ? 'bg-violet-600 text-white rounded-br-sm'
                          : 'bg-slate-800 border border-white/10 text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4 flex gap-2 shadow-lg">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-black/40 border-t border-white/10">
            {error && <p className="text-red-400 text-sm mb-2 px-2">{error}</p>}
            <div className="flex gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your answer here..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none h-[52px]"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !inputValue.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Press Enter to send, Shift+Enter for new line.</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import api from '../api/axios';

function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! Ask me anything about your spending — like \"How much did I spend on food this month?\"" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/ask', { question: input });
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 shadow-md text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-[360px] h-[480px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-zinc-100 text-sm font-semibold tracking-tight">Finance Assistant</p>
                <p className="text-zinc-400 text-xs">Ask about your transactions</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-950">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-sm whitespace-pre-wrap leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-emerald-600 text-white font-medium'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-400 text-xs flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    Analyzing spending data...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-zinc-800 bg-zinc-900">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-9 h-9 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingChat;
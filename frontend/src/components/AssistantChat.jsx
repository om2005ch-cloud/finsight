import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import api from '../api/axios';

function AssistantChat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const res = await api.post('/assistant/ask', { question });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer('Sorry, something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.1)' }}
      className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-semibold">Ask your Finance Assistant</h3>
      </div>

      <form onSubmit={handleAsk} className="flex gap-3">
        <input
          type="text"
          placeholder="e.g. How much did I spend on food?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300"
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-emerald-500/20 transition-shadow duration-300 disabled:opacity-50"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? 'Thinking' : 'Ask'}
        </motion.button>
      </form>

      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4 p-4 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl text-gray-200 text-sm leading-relaxed whitespace-pre-wrap"
        >
          {answer}
        </motion.div>
      )}
    </motion.div>
  );
}

export default AssistantChat;
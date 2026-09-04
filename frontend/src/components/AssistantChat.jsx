import { useState } from 'react';
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <h3 className="text-zinc-100 font-semibold text-base tracking-tight">Ask your Finance Assistant</h3>
      </div>

      <form onSubmit={handleAsk} className="flex gap-3">
        <input
          type="text"
          placeholder="e.g. How much did I spend on food?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? 'Thinking' : 'Ask'}
        </button>
      </form>

      {answer && (
        <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}

export default AssistantChat;
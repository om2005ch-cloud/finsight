import { useState } from 'react';
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
    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
      <h3>Ask your Finance Assistant</h3>
      <form onSubmit={handleAsk}>
        <input
          type="text"
          placeholder="e.g. How much did I spend on food?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: '300px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      {answer && (
        <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default AssistantChat;
// submit.js

import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const { num_nodes, num_edges, is_dag } = await response.json();

      alert(
        `Pipeline Analysis\n\n` +
          `• Nodes: ${num_nodes}\n` +
          `• Edges: ${num_edges}\n` +
          `• Valid DAG: ${is_dag ? 'Yes ✅' : 'No ❌'}\n\n` +
          (is_dag
            ? 'Your pipeline is a valid directed acyclic graph.'
            : 'Your pipeline contains a cycle and is not a valid DAG.')
      );
    } catch (error) {
      alert(
        `Could not reach the backend.\n\n${error.message}\n\n` +
          `Make sure it is running:\n  cd backend && uvicorn main:app --reload`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vs-submit">
      <button type="button" className="vs-submit__button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Analyzing…' : 'Submit Pipeline'}
      </button>
    </div>
  );
};

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
  const [result, setResult] = useState(null);

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

      // Show the result in a styled, in-app dialog (see below).
      setResult(await response.json());
    } catch (error) {
      // Fall back to a native alert only if the backend is unreachable.
      alert(
        `Could not reach the backend.\n\n${error.message}\n\n` +
          `Make sure it is running:\n  cd backend && uvicorn main:app --reload`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="vs-submit">
        <button type="button" className="vs-submit__button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Analyzing…' : 'Submit Pipeline'}
        </button>
      </div>

      {result && (
        <div className="vs-modal" role="dialog" aria-modal="true" onClick={() => setResult(null)}>
          <div className="vs-modal__card" onClick={(e) => e.stopPropagation()}>
            <h2 className="vs-modal__title">Pipeline Analysis</h2>

            <div className="vs-modal__rows">
              <div className="vs-modal__row">
                <span>Nodes</span>
                <strong>{result.num_nodes}</strong>
              </div>
              <div className="vs-modal__row">
                <span>Edges</span>
                <strong>{result.num_edges}</strong>
              </div>
              <div className="vs-modal__row">
                <span>Valid DAG</span>
                <span className={`vs-badge ${result.is_dag ? 'vs-badge--ok' : 'vs-badge--bad'}`}>
                  {result.is_dag ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <p className="vs-modal__msg">
              {result.is_dag
                ? 'Your pipeline is a valid directed acyclic graph.'
                : 'Your pipeline contains a cycle, so it is not a valid DAG.'}
            </p>

            <button className="vs-modal__close" onClick={() => setResult(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

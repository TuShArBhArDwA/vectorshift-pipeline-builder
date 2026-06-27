// llmNode.js

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="LLM"
    icon="✨"
    accent="#8b5cf6"
    handles={[
      { type: 'target', position: 'left', id: 'system' },
      { type: 'target', position: 'left', id: 'prompt' },
      { type: 'source', position: 'right', id: 'response' },
    ]}
  >
    <p className="vs-node__text">This is a LLM.</p>
  </BaseNode>
);

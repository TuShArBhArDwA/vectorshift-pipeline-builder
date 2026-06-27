// toolbar.js

import { DraggableNode } from './draggableNode';

const NODE_TYPES = [
  { type: 'customInput', label: 'Input', icon: '⤵' },
  { type: 'llm', label: 'LLM', icon: '✨' },
  { type: 'customOutput', label: 'Output', icon: '⤴' },
  { type: 'text', label: 'Text', icon: '≡' },
  { type: 'filter', label: 'Filter', icon: '⛃' },
  { type: 'math', label: 'Math', icon: '∑' },
  { type: 'api', label: 'API', icon: '☁' },
  { type: 'note', label: 'Note', icon: '✎' },
  { type: 'delay', label: 'Delay', icon: '⏱' },
];

export const PipelineToolbar = () => {
  return (
    <header className="vs-toolbar">
      <div className="vs-toolbar__brand">
        <span className="vs-toolbar__logo">◆</span>
        <span>VectorShift</span>
      </div>
      <div className="vs-toolbar__nodes">
        {NODE_TYPES.map((node) => (
          <DraggableNode key={node.type} type={node.type} label={node.label} icon={node.icon} />
        ))}
      </div>
    </header>
  );
};

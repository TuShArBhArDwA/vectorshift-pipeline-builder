// textNode.js
// --------------------------------------------------
// Part 3: the text input
//   1. grows in width & height as the user types
//   2. parses {{ variableName }} tokens and exposes one left Handle per variable

import { useEffect, useMemo, useRef, useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

// Matches {{ name }} where `name` is a valid JS identifier (letters/_/$ then
// letters/digits/_/$). Whitespace inside the braces is allowed and ignored.
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const found = new Set();
  let match;
  VARIABLE_REGEX.lastIndex = 0;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    found.add(match[1]);
  }
  return [...found];
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text ?? '{{input}}');
  const textareaRef = useRef(null);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const onTextChange = (value) => {
    setText(value);
    updateNodeField(id, 'text', value);
  };

  // Re-derive handles only when the set of variables actually changes.
  const variables = useMemo(() => extractVariables(text), [text]);

  // Auto-grow the textarea height to fit its content.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Width grows with the longest line; height grows with line count.
  const width = useMemo(() => {
    const longestLine = text.split('\n').reduce((max, line) => Math.max(max, line.length), 0);
    return clamp(longestLine * 8 + 48, 220, 460);
  }, [text]);

  const handles = [
    // One target handle on the left per detected variable...
    ...variables.map((name) => ({ type: 'target', position: 'left', id: name })),
    // ...and the node's single output on the right.
    { type: 'source', position: 'right', id: 'output' },
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      icon="≡"
      accent="#0ea5e9"
      handles={handles}
      style={{ width }}
    >
      <label className="vs-node__field">
        <span className="vs-node__label">Text</span>
        <textarea
          ref={textareaRef}
          className="vs-node__input vs-node__textarea"
          value={text}
          rows={1}
          placeholder="Type text, use {{ variable }} to add inputs"
          onChange={(e) => onTextChange(e.target.value)}
        />
      </label>
      {variables.length > 0 && (
        <div className="vs-node__vars">
          {variables.map((name) => (
            <span key={name} className="vs-node__chip">
              {name}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

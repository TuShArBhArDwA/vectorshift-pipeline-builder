// noteNode.js — a handle-less sticky note, showing the abstraction also
// supports nodes with no connections at all.

import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Note"
    icon="✎"
    accent="#eab308"
    fields={[{ name: 'note', label: '', type: 'textarea', default: 'Write a note…' }]}
  />
);

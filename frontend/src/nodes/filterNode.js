// filterNode.js — keeps/drops values that match a condition.

import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Filter"
    icon="⛃"
    accent="#f59e0b"
    fields={[
      {
        name: 'condition',
        label: 'Keep when',
        type: 'select',
        options: ['Contains', 'Equals', 'Not empty', 'Matches regex'],
        default: 'Contains',
      },
      { name: 'value', label: 'Value', type: 'text', default: '' },
    ]}
    handles={[
      { type: 'target', position: 'left', id: 'input' },
      { type: 'source', position: 'right', id: 'output' },
    ]}
  />
);

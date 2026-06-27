// mathNode.js — combines two numeric inputs.

import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Math"
    icon="∑"
    accent="#06b6d4"
    fields={[
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        options: ['Add', 'Subtract', 'Multiply', 'Divide'],
        default: 'Add',
      },
    ]}
    handles={[
      { type: 'target', position: 'left', id: 'a' },
      { type: 'target', position: 'left', id: 'b' },
      { type: 'source', position: 'right', id: 'result' },
    ]}
  />
);

// inputNode.js

import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Input"
    icon="⤵"
    accent="#10b981"
    fields={[
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customInput-', 'input_'),
      },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'], default: 'Text' },
    ]}
    handles={[{ type: 'source', position: 'right', id: 'value' }]}
  />
);

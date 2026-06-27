// outputNode.js

import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Output"
    icon="⤴"
    accent="#ef4444"
    fields={[
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customOutput-', 'output_'),
      },
      { name: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Image'], default: 'Text' },
    ]}
    handles={[{ type: 'target', position: 'left', id: 'value' }]}
  />
);

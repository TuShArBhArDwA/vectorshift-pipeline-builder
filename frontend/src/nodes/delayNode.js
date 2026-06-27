// delayNode.js — pauses the pipeline for a number of seconds.

import { BaseNode } from './BaseNode';

export const DelayNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Delay"
    icon="⏱"
    accent="#ec4899"
    fields={[{ name: 'seconds', label: 'Seconds', type: 'number', default: '1' }]}
    handles={[
      { type: 'target', position: 'left', id: 'input' },
      { type: 'source', position: 'right', id: 'output' },
    ]}
  />
);

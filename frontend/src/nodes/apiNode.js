// apiNode.js — makes an outbound HTTP request.

import { BaseNode } from './BaseNode';

export const ApiNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="API Request"
    icon="☁"
    accent="#3b82f6"
    fields={[
      { name: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
      { name: 'url', label: 'URL', type: 'text', default: 'https://' },
    ]}
    handles={[
      { type: 'target', position: 'left', id: 'body' },
      { type: 'source', position: 'right', id: 'response' },
    ]}
  />
);

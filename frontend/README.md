# Frontend - Pipeline Builder

A React single-page application that renders a drag-and-drop pipeline editor on
top of [ReactFlow](https://reactflow.dev/), with global state managed by
[Zustand](https://github.com/pmndrs/zustand).

## Run

```bash
npm install
npm start
```

The development server runs on `http://localhost:3000` and expects the backend
on `http://localhost:8000` (see `../backend`).

## Project structure

| File | Responsibility |
|------|----------------|
| `src/index.js` | React entry point. |
| `src/App.js` | Top-level layout: toolbar, canvas, submit button. |
| `src/store.js` | Zustand store: nodes, edges, ID generation, and change handlers. |
| `src/ui.js` | The ReactFlow canvas, drop handling, and the node-type registry. |
| `src/toolbar.js` | The palette of draggable node types. |
| `src/draggableNode.js` | A single draggable item in the toolbar. |
| `src/submit.js` | Sends the pipeline to the backend and shows the result. |
| `src/index.css` | The complete design system. |
| `src/nodes/BaseNode.js` | The config-driven abstraction every node is built on. |
| `src/nodes/*.js` | The nine concrete node types. |

## The node abstraction

Every node is a thin configuration passed to `BaseNode`. `BaseNode` owns the
shared concerns so individual nodes stay declarative:

- Header with icon, title, and accent color.
- Form fields (`text`, `number`, `select`, `textarea`) whose values sync to the
  store automatically.
- Connection handles, auto-spaced along each side so they never overlap.
- Re-measuring handles via `useUpdateNodeInternals` when the handle set changes
  (required for the Text node's dynamic variable handles).

A complete node is typically about fifteen lines. For example, the Math node:

```jsx
export const MathNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Math"
    icon="∑"
    accent="#06b6d4"
    fields={[{ name: 'operation', label: 'Operation', type: 'select',
               options: ['Add', 'Subtract', 'Multiply', 'Divide'], default: 'Add' }]}
    handles={[
      { type: 'target', position: 'left', id: 'a' },
      { type: 'target', position: 'left', id: 'b' },
      { type: 'source', position: 'right', id: 'result' },
    ]}
  />
);
```

## Node catalog

| Type key | Component | Inputs (left) | Outputs (right) | Fields |
|----------|-----------|---------------|-----------------|--------|
| `customInput` | InputNode | - | value | name, type |
| `customOutput` | OutputNode | value | - | name, type |
| `llm` | LLMNode | system, prompt | response | - |
| `text` | TextNode | one per `{{ variable }}` | output | text |
| `filter` | FilterNode | input | output | condition, value |
| `math` | MathNode | a, b | result | operation |
| `api` | ApiNode | body | response | method, url |
| `note` | NoteNode | - | - | note |
| `delay` | DelayNode | input | output | seconds |

The last five (`filter`, `math`, `api`, `note`, `delay`) are the new nodes added
to demonstrate the abstraction. They intentionally vary in shape: multiple
inputs, no handles at all, and mixed field types.

## Adding a new node

1. Create `src/nodes/myNode.js` exporting a component that returns a configured
   `BaseNode`.
2. Register it in the `nodeTypes` map in `src/ui.js`.
3. Add a `DraggableNode` entry to the list in `src/toolbar.js`.

No styling or handle-positioning code is required; `BaseNode` and the design
system handle both.

## Further reading

See `../docs/lld.md` for the field and handle config schemas, the handle-spacing
formula, and the variable-parsing logic.

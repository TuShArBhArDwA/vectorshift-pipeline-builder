# VectorShift - Frontend Technical Assessment

A visual pipeline builder: a drag-and-drop node editor (React + ReactFlow) backed
by a FastAPI service that analyzes the pipeline graph.

## Live demo

| Service | URL |
|---------|-----|
| Frontend (app) | https://pipeline.minianon.in |
| Backend (API) | https://pipeline-api.minianon.in |
| Video walkthrough | https://drive.google.com/file/d/1FnM-XQU8IU8_XzcvndvEs2QrBMuPSkoM/view?usp=sharing |

Open the app, drag nodes from the toolbar onto the canvas, connect them, and
click `Submit Pipeline` to see the live node/edge counts and DAG result. The
backend health check at the API root returns `{"Ping": "Pong"}`.

This repository is my submission for the VectorShift frontend technical
assessment. It covers all four required parts:

1. A reusable, config-driven node abstraction plus five new node types.
2. A unified visual design across the toolbar, canvas, nodes, and controls.
3. Text-node logic: auto-resizing input and dynamic `{{ variable }}` handles.
4. Backend integration: submit the pipeline, compute node/edge counts, and
   detect whether the graph is a DAG.

## Repository layout

| Path | Description |
|------|-------------|
| `frontend/` | React application (ReactFlow canvas, Zustand store, nodes). See [frontend/README.md](frontend/README.md). |
| `backend/` | FastAPI service exposing `/pipelines/parse`. See [backend/README.md](backend/README.md). |
| `docs/` | Architecture documentation: [High-Level Design](docs/hld.md) and [Low-Level Design](docs/lld.md). |
| `LICENSE` | MIT license. |

## Quick start

Run the two services in separate terminals.

Backend:

```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

The API starts on `http://localhost:8000`. Visit it directly to confirm it is
up; it returns `{"Ping": "Pong"}`.

Frontend:

```bash
cd frontend
npm install
npm start
```

The app starts on `http://localhost:3000`.

## Using the app

1. Drag a node from the top toolbar onto the canvas.
2. Connect nodes by dragging from a node's right-side handle (output) to another
   node's left-side handle (input).
3. In a Text node, type `{{ name }}` to create a matching input handle on the
   left for the variable `name`.
4. To delete, select a node or edge and press `Backspace` or `Delete`.
5. Click `Submit Pipeline`. An alert reports the number of nodes, the number of
   edges, and whether the pipeline is a valid DAG.

## How the four parts are addressed

| Part | Summary | Key files |
|------|---------|-----------|
| 1. Node abstraction | `BaseNode` renders any node from a declarative config (title, fields, handles). Nine node types are built on it, five of them new. | `frontend/src/nodes/BaseNode.js`, `frontend/src/nodes/*` |
| 2. Styling | A single design system (CSS variables, accent-themed headers, styled handles and controls). | `frontend/src/index.css` |
| 3. Text node logic | Width/height grow with content; `{{ variable }}` tokens are parsed into left handles. | `frontend/src/nodes/textNode.js` |
| 4. Backend integration | Frontend POSTs `{nodes, edges}`; backend returns `{num_nodes, num_edges, is_dag}`; the result is shown in an alert. | `frontend/src/submit.js`, `backend/main.py` |

## Documentation

- [docs/hld.md](docs/hld.md) - high-level architecture, data flow, and technology choices.
- [docs/lld.md](docs/lld.md) - component internals, the node-config schema, the variable-parsing logic, and the DAG algorithm.

## Author

Tushar Bhardwaj

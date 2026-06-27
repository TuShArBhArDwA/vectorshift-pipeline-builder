# Backend - Pipeline Parser

A small [FastAPI](https://fastapi.tiangolo.com/) service that receives a pipeline
(its nodes and edges) and returns summary statistics, including whether the graph
is a directed acyclic graph (DAG).

## Run

```bash
pip install fastapi uvicorn
uvicorn main:app --reload
```

The service listens on `http://localhost:8000`.

CORS is enabled for all origins so the React development server on
`http://localhost:3000` can call it directly from the browser.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check. Returns `{"Ping": "Pong"}`. |
| POST | `/pipelines/parse` | Analyzes a pipeline and returns counts plus the DAG result. |

### POST /pipelines/parse

Request body:

```json
{
  "nodes": [{ "id": "customInput-1" }, { "id": "llm-1" }],
  "edges": [{ "source": "customInput-1", "target": "llm-1" }]
}
```

Nodes and edges may contain additional fields (ReactFlow includes `type`,
`position`, `data`, and so on); the extra fields are accepted and ignored.

Response body:

```json
{ "num_nodes": 2, "num_edges": 1, "is_dag": true }
```

| Field | Type | Meaning |
|-------|------|---------|
| `num_nodes` | int | Number of nodes in the pipeline. |
| `num_edges` | int | Number of edges in the pipeline. |
| `is_dag` | bool | `true` if the directed graph has no cycles. |

### Example

```bash
curl -X POST http://localhost:8000/pipelines/parse \
  -H "Content-Type: application/json" \
  -d '{"nodes":[{"id":"a"},{"id":"b"}],"edges":[{"source":"a","target":"b"}]}'
# {"num_nodes":2,"num_edges":1,"is_dag":true}
```

## DAG detection

The cycle check uses Kahn's algorithm for topological sorting. Nodes with no
remaining incoming edges are removed one at a time; if every node can be removed,
the graph is acyclic. Edges that reference unknown node IDs are ignored so
malformed input cannot crash the check.

Complexity is linear in the size of the graph, `O(V + E)`.

See `../docs/lld.md` for a step-by-step walkthrough of the algorithm.

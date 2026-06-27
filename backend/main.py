from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow the React dev server (and others) to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    id: str

    class Config:
        extra = "allow"  # ignore the other ReactFlow fields (type, position, data, ...)


class Edge(BaseModel):
    source: str
    target: str

    class Config:
        extra = "allow"


class Pipeline(BaseModel):
    nodes: list[Node]
    edges: list[Edge]


def is_dag(nodes: list[Node], edges: list[Edge]) -> bool:
    """Return True if the directed graph (nodes, edges) has no cycles.

    Uses Kahn's algorithm: repeatedly remove nodes with no remaining incoming
    edges. If every node can be removed this way, the graph is acyclic.
    """
    node_ids = {node.id for node in nodes}

    # Build adjacency list and in-degree count, ignoring edges that reference
    # unknown nodes so malformed input can't crash the check.
    adjacency = {node_id: [] for node_id in node_ids}
    in_degree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            adjacency[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    queue = [node_id for node_id, degree in in_degree.items() if degree == 0]
    visited = 0

    while queue:
        current = queue.pop()
        visited += 1
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we visited every node, there was no cycle.
    return visited == len(node_ids)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': is_dag(pipeline.nodes, pipeline.edges),
    }

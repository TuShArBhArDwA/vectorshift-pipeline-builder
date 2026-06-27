// BaseNode.js
// --------------------------------------------------
// A single, config-driven node component that every node type is built on.
//
// Instead of copy/pasting handles + wrapper markup into each node file, a node
// just describes itself declaratively:
//   - title / icon / accent   -> header + theme
//   - fields                  -> labeled inputs that auto-sync to the store
//   - handles                 -> connection points (auto-spaced per side)
//   - children                -> any custom body (used by the Text node)
//
// This means a brand-new node is usually ~10 lines of config (see the nodes
// added for Part 1) and styling changes are made in exactly one place.

import { useEffect, useState } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

// Map the friendly position strings used in node configs to ReactFlow enums.
const POSITION_MAP = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

// Evenly distribute N handles along a side so they never overlap, regardless of
// how many a node declares. Handle index `i` of `count` sits at (i+1)/(count+1).
const handleOffset = (index, count) => `${((index + 1) / (count + 1)) * 100}%`;

export const BaseNode = ({
  id,
  data,
  title,
  icon,
  accent = '#6366f1',
  fields = [],
  handles = [],
  children,
  style = {},
}) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();

  // ReactFlow caches handle positions per node. When the set of handles changes
  // (e.g. the Text node adding a handle for a new {{ variable }}), we must tell
  // ReactFlow to re-measure so edges attach to the correct, current positions.
  const handleSignature = handles.map((h) => `${h.type}:${h.position}:${h.id}`).join('|');
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, handleSignature, updateNodeInternals]);

  // Local state for every declared field, initialized from saved data or default.
  const [values, setValues] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.name] =
        data?.[field.name] ??
        (typeof field.default === 'function' ? field.default(id) : field.default) ??
        '';
    });
    return initial;
  });

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    updateNodeField(id, name, value);
  };

  // Group handles by side so we can space them out independently.
  const handlesBySide = handles.reduce((acc, h) => {
    const side = h.position || 'left';
    (acc[side] = acc[side] || []).push(h);
    return acc;
  }, {});

  return (
    <div className="vs-node" style={{ '--accent': accent, ...style }}>
      <div className="vs-node__header">
        {icon && <span className="vs-node__icon">{icon}</span>}
        <span className="vs-node__title">{title}</span>
      </div>

      <div className="vs-node__body">
        {fields.map((field) => (
          <label key={field.name} className="vs-node__field">
            {field.label && <span className="vs-node__label">{field.label}</span>}
            {field.type === 'select' ? (
              <select
                className="vs-node__input"
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                className="vs-node__input vs-node__textarea"
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : (
              <input
                className="vs-node__input"
                type={field.type || 'text'}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
          </label>
        ))}

        {/* Custom body content (e.g. the Text node renders its own editor here) */}
        {children}
      </div>

      {/* Render handles, auto-spacing them along each side. */}
      {Object.entries(handlesBySide).map(([side, sideHandles]) =>
        sideHandles.map((handle, i) => (
          <Handle
            key={handle.id}
            type={handle.type}
            position={POSITION_MAP[side]}
            id={`${id}-${handle.id}`}
            className="vs-handle"
            style={{ top: handleOffset(i, sideHandles.length), ...handle.style }}
          />
        ))
      )}
    </div>
  );
};

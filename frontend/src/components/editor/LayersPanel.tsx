import { useState } from 'react';
import { Eye, EyeOff, Trash2, GripVertical, Type, Shapes, Pencil, Image } from 'lucide-react';
import type { CanvasElement, TextElement, ShapeElement } from '../../types/editor';

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onDeleteElement: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  hasImage: boolean;
}

function getLayerIcon(type: CanvasElement['type']) {
  if (type === 'text') return <Type className="h-3.5 w-3.5" />;
  if (type === 'shape') return <Shapes className="h-3.5 w-3.5" />;
  if (type === 'draw') return <Pencil className="h-3.5 w-3.5" />;
  return null;
}

function getLayerLabel(el: CanvasElement): string {
  if (el.type === 'text') return `Text: "${(el as TextElement).text?.slice(0, 15) ?? ''}..."`;
  if (el.type === 'shape') return `Shape: ${(el as ShapeElement).shapeType}`;
  if (el.type === 'draw') return 'Drawing';
  // Exhaustive fallback — el.id is always present on all union members
  return (el as { id: string }).id;
}

export default function LayersPanel({
  elements,
  selectedElementId,
  onSelectElement,
  onDeleteElement,
  onToggleVisibility,
  onReorder,
  hasImage,
}: LayersPanelProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const reversed = [...elements].reverse();

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, _index: number) => {
    e.preventDefault();
  };
  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const fromActual = elements.length - 1 - dragIndex;
    const toActual = elements.length - 1 - index;
    onReorder(fromActual, toActual);
    setDragIndex(null);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-editor-text">Layers</h3>

      {/* Base image layer */}
      <div className="flex items-center gap-2 rounded-lg border border-editor-border bg-editor-bg px-2 py-1.5">
        <GripVertical className="h-3.5 w-3.5 text-editor-muted opacity-30" />
        <Image className="h-3.5 w-3.5 text-editor-muted" />
        <span className="flex-1 truncate text-xs text-editor-muted">
          {hasImage ? 'Background Image' : 'No image'}
        </span>
        <Eye className="h-3.5 w-3.5 text-editor-muted" />
      </div>

      {reversed.length === 0 && (
        <p className="py-4 text-center text-xs text-editor-muted">
          No layers yet. Add text, shapes, or drawings.
        </p>
      )}

      {reversed.map((el, i) => (
        <div
          key={el.id}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={() => handleDrop(i)}
          onClick={() => onSelectElement(el.id === selectedElementId ? null : el.id)}
          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors ${
            selectedElementId === el.id
              ? 'border-editor-accent bg-editor-accent/10'
              : 'border-editor-border bg-editor-bg hover:border-editor-accent/40'
          }`}
        >
          <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-editor-muted" />
          <span className={`shrink-0 ${el.visible ? 'text-editor-accent' : 'text-editor-muted'}`}>
            {getLayerIcon(el.type)}
          </span>
          <span className="flex-1 truncate text-xs text-editor-text">{getLayerLabel(el)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleVisibility(el.id); }}
            className="shrink-0 text-editor-muted hover:text-editor-accent"
            aria-label="Toggle visibility"
          >
            {el.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteElement(el.id); }}
            className="shrink-0 text-editor-muted hover:text-destructive"
            aria-label="Delete layer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

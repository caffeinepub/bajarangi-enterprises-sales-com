import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { ToolType } from '../../types/editor';
import {
  MousePointer2,
  Crop,
  Pencil,
  Type,
  Shapes,
  SlidersHorizontal,
  Maximize2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Tool {
  id: ToolType;
  icon: React.ReactNode;
  label: string;
}

const TOOLS: Tool[] = [
  { id: 'select', icon: <MousePointer2 className="h-5 w-5" />, label: 'Select' },
  { id: 'crop', icon: <Crop className="h-5 w-5" />, label: 'Crop' },
  { id: 'draw', icon: <Pencil className="h-5 w-5" />, label: 'Draw' },
  { id: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
  { id: 'shape', icon: <Shapes className="h-5 w-5" />, label: 'Shapes' },
  { id: 'filter', icon: <SlidersHorizontal className="h-5 w-5" />, label: 'Filters' },
  { id: 'resize', icon: <Maximize2 className="h-5 w-5" />, label: 'Resize' },
  { id: 'layers', icon: <Layers className="h-5 w-5" />, label: 'Layers' },
  { id: 'aiEdit', icon: <Sparkles className="h-5 w-5" />, label: 'AI Edit' },
];

interface ToolsPanelProps {
  activeTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
}

export default function ToolsPanel({ activeTool, onToolSelect }: ToolsPanelProps) {
  return (
    <TooltipProvider>
      <aside className="flex w-16 flex-col items-center gap-1 border-r border-editor-border bg-editor-panel py-3 shrink-0">
        {TOOLS.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToolSelect(tool.id)}
                className={`
                  flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150
                  ${activeTool === tool.id
                    ? 'bg-editor-accent text-editor-bg shadow-lg shadow-editor-accent/30'
                    : 'text-editor-muted hover:bg-editor-hover hover:text-editor-text'
                  }
                  ${tool.id === 'aiEdit' ? 'mt-2 border border-editor-accent/40' : ''}
                `}
                aria-label={tool.label}
              >
                {tool.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{tool.label}</TooltipContent>
          </Tooltip>
        ))}
      </aside>
    </TooltipProvider>
  );
}

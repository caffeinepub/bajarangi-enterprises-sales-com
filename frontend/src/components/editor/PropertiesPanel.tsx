import { ScrollArea } from '@/components/ui/scroll-area';
import type { ToolType, FilterState, DrawToolSettings, TextToolSettings, ShapeToolSettings, CropRegion, CanvasElement } from '../../types/editor';
import type { TransformationDescriptor } from '../../types/editor';
import FilterTool from './tools/FilterTool';
import DrawTool from './tools/DrawTool';
import TextTool from './tools/TextTool';
import ShapeTool from './tools/ShapeTool';
import CropTool from './tools/CropTool';
import ResizeTool from './tools/ResizeTool';
import LayersPanel from './LayersPanel';
import AIEditPanel from './AIEditPanel';
import { MousePointer2 } from 'lucide-react';

interface PropertiesPanelProps {
  activeTool: ToolType;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onFiltersCommit: () => void;
  drawSettings: DrawToolSettings;
  onDrawSettingsChange: (s: DrawToolSettings) => void;
  textSettings: TextToolSettings;
  onTextSettingsChange: (s: TextToolSettings) => void;
  shapeSettings: ShapeToolSettings;
  onShapeSettingsChange: (s: ShapeToolSettings) => void;
  cropRegion: CropRegion | null;
  canvasWidth: number;
  canvasHeight: number;
  onApplyCrop: (region: CropRegion) => void;
  onCancelCrop: () => void;
  onApplyResize: (w: number, h: number) => void;
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onDeleteElement: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onApplyAITransformation: (descriptor: TransformationDescriptor) => void;
  hasImage: boolean;
}

export default function PropertiesPanel({
  activeTool,
  filters,
  onFiltersChange,
  onFiltersCommit,
  drawSettings,
  onDrawSettingsChange,
  textSettings,
  onTextSettingsChange,
  shapeSettings,
  onShapeSettingsChange,
  cropRegion,
  canvasWidth,
  canvasHeight,
  onApplyCrop,
  onCancelCrop,
  onApplyResize,
  elements,
  selectedElementId,
  onSelectElement,
  onDeleteElement,
  onToggleVisibility,
  onReorder,
  onApplyAITransformation,
  hasImage,
}: PropertiesPanelProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-editor-border bg-editor-panel">
      <div className="border-b border-editor-border px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-editor-muted">
          {activeTool === 'select' && 'Properties'}
          {activeTool === 'crop' && 'Crop'}
          {activeTool === 'draw' && 'Brush'}
          {activeTool === 'text' && 'Text'}
          {activeTool === 'shape' && 'Shapes'}
          {activeTool === 'filter' && 'Filters'}
          {activeTool === 'resize' && 'Resize'}
          {activeTool === 'layers' && 'Layers'}
          {activeTool === 'aiEdit' && 'AI Edit'}
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeTool === 'select' && (
            <div className="flex flex-col items-center gap-3 py-8 text-center text-editor-muted">
              <MousePointer2 className="h-8 w-8 opacity-30" />
              <p className="text-sm">Select a tool from the left panel to see options</p>
            </div>
          )}
          {activeTool === 'filter' && (
            <FilterTool filters={filters} onChange={onFiltersChange} onCommit={onFiltersCommit} />
          )}
          {activeTool === 'draw' && (
            <DrawTool settings={drawSettings} onChange={onDrawSettingsChange} />
          )}
          {activeTool === 'text' && (
            <TextTool settings={textSettings} onChange={onTextSettingsChange} />
          )}
          {activeTool === 'shape' && (
            <ShapeTool settings={shapeSettings} onChange={onShapeSettingsChange} />
          )}
          {activeTool === 'crop' && (
            <CropTool
              cropRegion={cropRegion}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              onApplyCrop={onApplyCrop}
              onCancelCrop={onCancelCrop}
            />
          )}
          {activeTool === 'resize' && (
            <ResizeTool
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              onApplyResize={onApplyResize}
              hasImage={hasImage}
            />
          )}
          {activeTool === 'layers' && (
            <LayersPanel
              elements={elements}
              selectedElementId={selectedElementId}
              onSelectElement={onSelectElement}
              onDeleteElement={onDeleteElement}
              onToggleVisibility={onToggleVisibility}
              onReorder={onReorder}
              hasImage={hasImage}
            />
          )}
          {activeTool === 'aiEdit' && (
            <AIEditPanel
              onApplyTransformation={onApplyAITransformation}
              hasImage={hasImage}
            />
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

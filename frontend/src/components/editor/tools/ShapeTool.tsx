import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ShapeToolSettings, ShapeType } from '../../../types/editor';
import { Square, Circle, Minus, MoveRight } from 'lucide-react';

interface ShapeToolProps {
  settings: ShapeToolSettings;
  onChange: (settings: ShapeToolSettings) => void;
}

const PRESET_COLORS = ['#ffffff', '#000000', '#14b8a6', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', 'transparent'];

export default function ShapeTool({ settings, onChange }: ShapeToolProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-editor-text">Shape Settings</h3>
      <p className="text-xs text-editor-muted">Drag on canvas to draw a shape</p>

      <div className="space-y-2">
        <Label className="text-xs text-editor-muted">Shape Type</Label>
        <ToggleGroup
          type="single"
          value={settings.shapeType}
          onValueChange={(v) => v && onChange({ ...settings, shapeType: v as ShapeType })}
          className="grid grid-cols-4 gap-1"
        >
          <ToggleGroupItem value="rectangle" className="data-[state=on]:bg-editor-accent data-[state=on]:text-editor-bg border-editor-border">
            <Square className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="circle" className="data-[state=on]:bg-editor-accent data-[state=on]:text-editor-bg border-editor-border">
            <Circle className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="line" className="data-[state=on]:bg-editor-accent data-[state=on]:text-editor-bg border-editor-border">
            <Minus className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="arrow" className="data-[state=on]:bg-editor-accent data-[state=on]:text-editor-bg border-editor-border">
            <MoveRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-editor-muted">Stroke Width</Label>
          <span className="text-xs font-mono text-editor-accent">{settings.strokeWidth}px</span>
        </div>
        <Slider
          min={1}
          max={20}
          step={1}
          value={[settings.strokeWidth]}
          onValueChange={([v]) => onChange({ ...settings, strokeWidth: v })}
          className="[&_[role=slider]]:bg-editor-accent [&_[role=slider]]:border-editor-accent"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-editor-muted">Stroke Color</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.filter(c => c !== 'transparent').map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...settings, strokeColor: color })}
              className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                settings.strokeColor === color ? 'border-editor-accent scale-110' : 'border-editor-border'
              }`}
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-editor-muted">Custom:</Label>
          <input
            type="color"
            value={settings.strokeColor}
            onChange={(e) => onChange({ ...settings, strokeColor: e.target.value })}
            className="h-8 w-12 cursor-pointer rounded border border-editor-border bg-transparent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-editor-muted">Fill Color</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...settings, fillColor: color })}
              className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                settings.fillColor === color ? 'border-editor-accent scale-110' : 'border-editor-border'
              } ${color === 'transparent' ? 'bg-transparent' : ''}`}
              style={{ backgroundColor: color === 'transparent' ? undefined : color }}
              aria-label={color}
            >
              {color === 'transparent' && <span className="text-xs text-editor-muted">∅</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-editor-muted">Custom:</Label>
          <input
            type="color"
            value={settings.fillColor === 'transparent' ? '#000000' : settings.fillColor}
            onChange={(e) => onChange({ ...settings, fillColor: e.target.value })}
            className="h-8 w-12 cursor-pointer rounded border border-editor-border bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { DrawToolSettings } from '../../../types/editor';

const PRESET_COLORS = [
  '#ffffff', '#000000', '#14b8a6', '#f59e0b', '#ef4444',
  '#3b82f6', '#8b5cf6', '#ec4899', '#22c55e', '#f97316',
];

interface DrawToolProps {
  settings: DrawToolSettings;
  onChange: (settings: DrawToolSettings) => void;
}

export default function DrawTool({ settings, onChange }: DrawToolProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-editor-text">Brush Settings</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-editor-muted">Brush Size</Label>
          <span className="text-xs font-mono text-editor-accent">{settings.brushSize}px</span>
        </div>
        <Slider
          min={1}
          max={50}
          step={1}
          value={[settings.brushSize]}
          onValueChange={([v]) => onChange({ ...settings, brushSize: v })}
          className="[&_[role=slider]]:bg-editor-accent [&_[role=slider]]:border-editor-accent"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-editor-muted">Color</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...settings, color })}
              className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                settings.color === color ? 'border-editor-accent scale-110' : 'border-editor-border'
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
            value={settings.color}
            onChange={(e) => onChange({ ...settings, color: e.target.value })}
            className="h-8 w-12 cursor-pointer rounded border border-editor-border bg-transparent"
          />
          <span className="text-xs font-mono text-editor-muted">{settings.color}</span>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-editor-border bg-editor-bg p-3">
        <Label className="mb-2 block text-xs text-editor-muted">Preview</Label>
        <div className="flex items-center justify-center">
          <div
            className="rounded-full"
            style={{
              width: Math.min(settings.brushSize * 2, 60),
              height: Math.min(settings.brushSize * 2, 60),
              backgroundColor: settings.color,
            }}
          />
        </div>
      </div>
    </div>
  );
}

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import type { TextToolSettings } from '../../../types/editor';

const FONT_FAMILIES = ['Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Impact'];
const PRESET_COLORS = ['#ffffff', '#000000', '#14b8a6', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

interface TextToolProps {
  settings: TextToolSettings;
  onChange: (settings: TextToolSettings) => void;
}

export default function TextTool({ settings, onChange }: TextToolProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-editor-text">Text Settings</h3>
      <p className="text-xs text-editor-muted">Click on the canvas to place text</p>

      <div className="space-y-2">
        <Label className="text-xs text-editor-muted">Text Content</Label>
        <Input
          value={settings.text}
          onChange={(e) => onChange({ ...settings, text: e.target.value })}
          placeholder="Enter text..."
          className="border-editor-border bg-editor-bg text-editor-text focus:border-editor-accent"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-editor-muted">Font Family</Label>
        <Select value={settings.fontFamily} onValueChange={(v) => onChange({ ...settings, fontFamily: v })}>
          <SelectTrigger className="border-editor-border bg-editor-bg text-editor-text">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-editor-border bg-editor-panel">
            {FONT_FAMILIES.map((f) => (
              <SelectItem key={f} value={f} className="text-editor-text hover:bg-editor-hover">
                <span style={{ fontFamily: f }}>{f}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-editor-muted">Font Size</Label>
          <span className="text-xs font-mono text-editor-accent">{settings.fontSize}px</span>
        </div>
        <Slider
          min={8}
          max={120}
          step={1}
          value={[settings.fontSize]}
          onValueChange={([v]) => onChange({ ...settings, fontSize: v })}
          className="[&_[role=slider]]:bg-editor-accent [&_[role=slider]]:border-editor-accent"
        />
      </div>

      <div className="flex items-center gap-2">
        <Toggle
          pressed={settings.bold}
          onPressedChange={(v) => onChange({ ...settings, bold: v })}
          size="sm"
          className="data-[state=on]:bg-editor-accent data-[state=on]:text-editor-bg"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={settings.italic}
          onPressedChange={(v) => onChange({ ...settings, italic: v })}
          size="sm"
          className="data-[state=on]:bg-editor-accent data-[state=on]:text-editor-bg"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <div className="mx-1 h-5 w-px bg-editor-border" />
        {(['left', 'center', 'right'] as const).map((align) => (
          <Toggle
            key={align}
            pressed={settings.align === align}
            onPressedChange={() => onChange({ ...settings, align })}
            size="sm"
            className="data-[state=on]:bg-editor-accent data-[state=on]:text-editor-bg"
          >
            {align === 'left' && <AlignLeft className="h-4 w-4" />}
            {align === 'center' && <AlignCenter className="h-4 w-4" />}
            {align === 'right' && <AlignRight className="h-4 w-4" />}
          </Toggle>
        ))}
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
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-editor-border bg-editor-bg p-3">
        <Label className="mb-2 block text-xs text-editor-muted">Preview</Label>
        <p
          style={{
            fontFamily: settings.fontFamily,
            fontSize: Math.min(settings.fontSize, 24),
            color: settings.color,
            fontWeight: settings.bold ? 'bold' : 'normal',
            fontStyle: settings.italic ? 'italic' : 'normal',
            textAlign: settings.align,
          }}
        >
          {settings.text || 'Preview text'}
        </p>
      </div>
    </div>
  );
}

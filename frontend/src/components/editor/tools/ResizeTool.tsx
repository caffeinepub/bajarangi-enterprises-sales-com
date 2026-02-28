import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Maximize2 } from 'lucide-react';

interface ResizeToolProps {
  canvasWidth: number;
  canvasHeight: number;
  onApplyResize: (width: number, height: number) => void;
  hasImage: boolean;
}

export default function ResizeTool({ canvasWidth, canvasHeight, onApplyResize, hasImage }: ResizeToolProps) {
  const [width, setWidth] = useState(canvasWidth);
  const [height, setHeight] = useState(canvasHeight);
  const [lockAspect, setLockAspect] = useState(true);
  const aspectRatio = canvasWidth / canvasHeight;

  const handleWidthChange = (val: string) => {
    const w = parseInt(val) || 1;
    setWidth(w);
    if (lockAspect) setHeight(Math.round(w / aspectRatio));
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val) || 1;
    setHeight(h);
    if (lockAspect) setWidth(Math.round(h * aspectRatio));
  };

  const PRESETS = [
    { label: 'HD', w: 1280, h: 720 },
    { label: 'FHD', w: 1920, h: 1080 },
    { label: 'Square', w: 1080, h: 1080 },
    { label: 'Portrait', w: 1080, h: 1350 },
    { label: 'Story', w: 1080, h: 1920 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-editor-text">Resize Canvas</h3>

      <div className="rounded-lg border border-editor-border bg-editor-bg p-3 text-xs text-editor-muted">
        <p>Current: {canvasWidth} × {canvasHeight}px</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-editor-muted">Width (px)</Label>
          <Input
            type="number"
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
            min={1}
            max={8000}
            className="border-editor-border bg-editor-bg text-editor-text focus:border-editor-accent"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-editor-muted">Height (px)</Label>
          <Input
            type="number"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
            min={1}
            max={8000}
            className="border-editor-border bg-editor-bg text-editor-text focus:border-editor-accent"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={lockAspect}
          onCheckedChange={setLockAspect}
          className="data-[state=checked]:bg-editor-accent"
        />
        <Label className="text-xs text-editor-muted">Lock aspect ratio</Label>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-editor-muted">Presets</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setWidth(p.w); setHeight(p.h); }}
              className="rounded border border-editor-border bg-editor-bg px-2 py-1.5 text-xs text-editor-muted transition-colors hover:border-editor-accent hover:text-editor-accent"
            >
              {p.label} ({p.w}×{p.h})
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onApplyResize(width, height)}
        disabled={!hasImage || (width === canvasWidth && height === canvasHeight)}
        className="w-full bg-editor-accent text-editor-bg hover:bg-editor-accent-hover disabled:opacity-30"
      >
        <Maximize2 className="mr-2 h-4 w-4" />
        Apply Resize
      </Button>
    </div>
  );
}

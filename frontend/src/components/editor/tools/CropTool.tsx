import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CropRegion } from '../../../types/editor';
import { Crop } from 'lucide-react';

interface CropToolProps {
  cropRegion: CropRegion | null;
  canvasWidth: number;
  canvasHeight: number;
  onApplyCrop: (region: CropRegion) => void;
  onCancelCrop: () => void;
}

export default function CropTool({ cropRegion, canvasWidth, canvasHeight, onApplyCrop, onCancelCrop }: CropToolProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-editor-text">Crop Tool</h3>
      <p className="text-xs text-editor-muted">Drag on the canvas to select a crop region</p>

      <div className="rounded-lg border border-editor-border bg-editor-bg p-3 text-xs text-editor-muted">
        <p>Canvas size: {canvasWidth} × {canvasHeight}px</p>
      </div>

      {cropRegion && (
        <div className="space-y-3 rounded-lg border border-editor-accent/30 bg-editor-bg p-3">
          <p className="text-xs font-medium text-editor-accent">Selected Region</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-editor-muted">
            <div>
              <Label className="text-xs text-editor-muted">X</Label>
              <p className="font-mono text-editor-text">{Math.round(cropRegion.x)}px</p>
            </div>
            <div>
              <Label className="text-xs text-editor-muted">Y</Label>
              <p className="font-mono text-editor-text">{Math.round(cropRegion.y)}px</p>
            </div>
            <div>
              <Label className="text-xs text-editor-muted">Width</Label>
              <p className="font-mono text-editor-text">{Math.round(cropRegion.width)}px</p>
            </div>
            <div>
              <Label className="text-xs text-editor-muted">Height</Label>
              <p className="font-mono text-editor-text">{Math.round(cropRegion.height)}px</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onApplyCrop(cropRegion)}
              disabled={cropRegion.width < 5 || cropRegion.height < 5}
              className="flex-1 bg-editor-accent text-editor-bg hover:bg-editor-accent-hover"
            >
              <Crop className="mr-1 h-3 w-3" />
              Apply Crop
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancelCrop}
              className="flex-1 text-editor-muted hover:text-editor-text"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!cropRegion && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-editor-border p-4 text-center text-xs text-editor-muted">
          <Crop className="h-4 w-4 shrink-0" />
          <span>Drag on the canvas to select crop area</span>
        </div>
      )}
    </div>
  );
}

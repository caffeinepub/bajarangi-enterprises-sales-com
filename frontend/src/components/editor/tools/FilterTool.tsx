import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { FilterState } from '../../../types/editor';

interface FilterToolProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onCommit: () => void;
}

const FILTER_CONFIG = [
  { key: 'brightness' as keyof FilterState, label: 'Brightness', min: 0, max: 200, default: 100 },
  { key: 'contrast' as keyof FilterState, label: 'Contrast', min: 0, max: 200, default: 100 },
  { key: 'saturation' as keyof FilterState, label: 'Saturation', min: 0, max: 200, default: 100 },
  { key: 'blur' as keyof FilterState, label: 'Blur', min: 0, max: 20, default: 0 },
  { key: 'grayscale' as keyof FilterState, label: 'Grayscale', min: 0, max: 100, default: 0 },
  { key: 'sepia' as keyof FilterState, label: 'Sepia', min: 0, max: 100, default: 0 },
  { key: 'hueRotate' as keyof FilterState, label: 'Hue Rotate', min: -180, max: 180, default: 0 },
  { key: 'opacity' as keyof FilterState, label: 'Opacity', min: 0, max: 100, default: 100 },
];

export default function FilterTool({ filters, onChange, onCommit }: FilterToolProps) {
  const handleChange = (key: keyof FilterState, value: number) => {
    onChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onChange({
      brightness: 100, contrast: 100, saturation: 100,
      blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, opacity: 100,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-editor-text">Filters & Adjustments</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-7 text-xs text-editor-muted hover:text-editor-accent"
        >
          Reset
        </Button>
      </div>

      {FILTER_CONFIG.map(({ key, label, min, max, default: def }) => (
        <div key={key} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-editor-muted">{label}</Label>
            <span className="text-xs font-mono text-editor-accent">{filters[key]}</span>
          </div>
          <Slider
            min={min}
            max={max}
            step={1}
            value={[filters[key] as number]}
            onValueChange={([v]) => handleChange(key, v)}
            onValueCommit={onCommit}
            className="[&_[role=slider]]:bg-editor-accent [&_[role=slider]]:border-editor-accent"
          />
          {filters[key] !== def && (
            <button
              onClick={() => { handleChange(key, def); onCommit(); }}
              className="text-xs text-editor-muted hover:text-editor-accent"
            >
              Reset to default
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

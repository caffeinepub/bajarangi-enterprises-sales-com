import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Loader2, Clock, ChevronRight } from 'lucide-react';
import { parsePrompt } from '../../utils/promptParser';
import { useGetAllAIPromptEntries, useSaveAIPromptEntry } from '../../hooks/useAIPrompts';
import type { TransformationDescriptor } from '../../types/editor';
import type { AIPromptEntry } from '../../backend';

interface AIEditPanelProps {
  onApplyTransformation: (descriptor: TransformationDescriptor) => void;
  hasImage: boolean;
}

const EXAMPLE_PROMPTS = [
  'Make it look vintage with sepia tones',
  'Add a dramatic vignette effect',
  'Brighten and increase saturation',
  'Apply a cool blue tone',
  'Make it black and white',
  'Add a warm sunset glow',
  'Make it look cinematic',
  'Apply a neon glow effect',
];

export default function AIEditPanel({ onApplyTransformation, hasImage }: AIEditPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const { data: promptHistory = [], isLoading: historyLoading } = useGetAllAIPromptEntries();
  const savePrompt = useSaveAIPromptEntry();

  const handleApply = async () => {
    if (!prompt.trim() || !hasImage) return;
    setIsProcessing(true);
    setLastResult(null);

    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 800));

    const { descriptor, description } = parsePrompt(prompt);
    setLastResult(description);
    onApplyTransformation(descriptor);

    // Save to backend (non-blocking)
    savePrompt.mutate({
      promptText: prompt,
      transformationDescriptor: JSON.stringify(descriptor),
    });

    setIsProcessing(false);
  };

  const formatTimestamp = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleString();
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-editor-accent" />
        <h3 className="text-sm font-semibold text-editor-text">AI Edit</h3>
        <span className="rounded-full bg-editor-accent/20 px-2 py-0.5 text-xs text-editor-accent">Beta</span>
      </div>

      {!hasImage && (
        <div className="rounded-lg border border-dashed border-editor-border p-4 text-center text-xs text-editor-muted">
          Upload an image first to use AI editing
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs text-editor-muted">Describe your edit</Label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Make it look vintage with warm tones and add a vignette..."
          rows={3}
          disabled={!hasImage}
          className="resize-none border-editor-border bg-editor-bg text-editor-text placeholder:text-editor-muted focus:border-editor-accent disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleApply();
          }}
        />
        <p className="text-xs text-editor-muted">Tip: Press Ctrl+Enter to apply</p>
      </div>

      <Button
        onClick={handleApply}
        disabled={!prompt.trim() || !hasImage || isProcessing}
        className="w-full bg-editor-accent text-editor-bg hover:bg-editor-accent-hover disabled:opacity-40"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Apply AI Edit
          </>
        )}
      </Button>

      {lastResult && (
        <div className="rounded-lg border border-editor-accent/30 bg-editor-accent/10 p-3 text-xs text-editor-accent">
          ✓ {lastResult}
        </div>
      )}

      {/* Example prompts */}
      <div className="space-y-2">
        <Label className="text-xs text-editor-muted">Try these prompts:</Label>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex}
              onClick={() => setPrompt(ex)}
              disabled={!hasImage}
              className="rounded-full border border-editor-border bg-editor-bg px-2 py-1 text-xs text-editor-muted transition-colors hover:border-editor-accent hover:text-editor-accent disabled:opacity-40"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-editor-muted" />
          <Label className="text-xs text-editor-muted">Prompt History</Label>
        </div>
        <ScrollArea className="h-48">
          {historyLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-editor-muted" />
            </div>
          ) : promptHistory.length === 0 ? (
            <p className="py-4 text-center text-xs text-editor-muted">No history yet</p>
          ) : (
            <div className="space-y-2 pr-2">
              {promptHistory.map((entry: AIPromptEntry, i: number) => (
                <button
                  key={i}
                  onClick={() => setPrompt(entry.promptText)}
                  className="w-full rounded-lg border border-editor-border bg-editor-bg p-2 text-left transition-colors hover:border-editor-accent/40"
                >
                  <div className="flex items-start gap-1.5">
                    <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-editor-accent" />
                    <div className="min-w-0">
                      <p className="truncate text-xs text-editor-text">{entry.promptText}</p>
                      <p className="mt-0.5 text-xs text-editor-muted">{formatTimestamp(entry.timestamp)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

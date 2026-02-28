import { useRef } from 'react';
import { Upload, Download, Undo2, Redo2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface EditorToolbarProps {
  onUpload: (file: File) => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasImage: boolean;
}

export default function EditorToolbar({
  onUpload,
  onDownload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasImage,
}: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  return (
    <TooltipProvider>
      <header className="flex h-14 items-center justify-between border-b border-editor-border bg-editor-panel px-4 shrink-0">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/editor-logo.dim_256x256.png"
            alt="AI Canvas Editor"
            className="h-8 w-8 rounded-md object-cover"
          />
          <span className="hidden text-sm font-bold tracking-wide text-editor-accent sm:block">
            AI Canvas Editor
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 text-editor-text hover:bg-editor-hover hover:text-editor-accent"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload Image</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="gap-2 text-editor-text hover:bg-editor-hover hover:text-editor-accent disabled:opacity-30"
              >
                <Undo2 className="h-4 w-4" />
                <span className="hidden sm:inline">Undo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="gap-2 text-editor-text hover:bg-editor-hover hover:text-editor-accent disabled:opacity-30"
              >
                <Redo2 className="h-4 w-4" />
                <span className="hidden sm:inline">Redo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>

          <div className="mx-1 h-6 w-px bg-editor-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={onDownload}
                disabled={!hasImage}
                className="gap-2 bg-editor-accent text-editor-bg hover:bg-editor-accent-hover disabled:opacity-30"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download as PNG</TooltipContent>
          </Tooltip>
        </div>

        {/* Right side hint */}
        {!hasImage && (
          <div className="hidden items-center gap-2 text-xs text-editor-muted lg:flex">
            <Image className="h-3 w-3" />
            Upload an image to start editing
          </div>
        )}
      </header>
    </TooltipProvider>
  );
}

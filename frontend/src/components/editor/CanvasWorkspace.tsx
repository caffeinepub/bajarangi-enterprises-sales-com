import { useEffect, useRef, useCallback } from 'react';
import type { ToolType, CropRegion } from '../../types/editor';

interface CanvasWorkspaceProps {
  // React 19 useRef returns RefObject<T | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeTool: ToolType;
  hasImage: boolean;
  cropRegion: CropRegion | null;
  setCropRegion: (region: CropRegion | null) => void;
  onCanvasClick: (x: number, y: number) => void;
  onDrawStart: (x: number, y: number) => void;
  onDrawMove: (x: number, y: number) => void;
  onDrawEnd: () => void;
  onShapeEnd: (x: number, y: number, width: number, height: number) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export default function CanvasWorkspace({
  canvasRef,
  activeTool,
  hasImage,
  cropRegion,
  setCropRegion,
  onCanvasClick,
  onDrawStart,
  onDrawMove,
  onDrawEnd,
  onShapeEnd,
  canvasWidth,
  canvasHeight,
}: CanvasWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const getCanvasPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX ?? 0;
      clientY = e.touches[0]?.clientY ?? 0;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, [canvasRef]);

  const drawCropOverlay = useCallback((region: CropRegion) => {
    const overlay = overlayCanvasRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !canvas) return;
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, overlay.width, overlay.height);
    ctx.clearRect(region.x, region.y, region.width, region.height);
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 2;
    ctx.strokeRect(region.x, region.y, region.width, region.height);
    // Rule-of-thirds grid lines
    ctx.strokeStyle = 'rgba(20,184,166,0.5)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(region.x + (region.width / 3) * i, region.y);
      ctx.lineTo(region.x + (region.width / 3) * i, region.y + region.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(region.x, region.y + (region.height / 3) * i);
      ctx.lineTo(region.x + region.width, region.y + (region.height / 3) * i);
      ctx.stroke();
    }
  }, [canvasRef]);

  useEffect(() => {
    if (cropRegion) {
      drawCropOverlay(cropRegion);
    } else {
      const overlay = overlayCanvasRef.current;
      if (overlay) {
        const ctx = overlay.getContext('2d');
        ctx?.clearRect(0, 0, overlay.width, overlay.height);
      }
    }
  }, [cropRegion, drawCropOverlay]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    isDraggingRef.current = true;
    startPosRef.current = pos;

    if (activeTool === 'draw') {
      onDrawStart(pos.x, pos.y);
    } else if (activeTool === 'crop' || activeTool === 'shape') {
      setCropRegion({ x: pos.x, y: pos.y, width: 0, height: 0 });
    }
  }, [activeTool, getCanvasPos, onDrawStart, setCropRegion]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const pos = getCanvasPos(e);

    if (activeTool === 'draw') {
      onDrawMove(pos.x, pos.y);
    } else if (activeTool === 'crop' || activeTool === 'shape') {
      const region = {
        x: Math.min(startPosRef.current.x, pos.x),
        y: Math.min(startPosRef.current.y, pos.y),
        width: Math.abs(pos.x - startPosRef.current.x),
        height: Math.abs(pos.y - startPosRef.current.y),
      };
      setCropRegion(region);
      if (activeTool === 'crop') drawCropOverlay(region);
    }
  }, [activeTool, getCanvasPos, onDrawMove, setCropRegion, drawCropOverlay]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const pos = getCanvasPos(e);

    if (activeTool === 'draw') {
      onDrawEnd();
    } else if (activeTool === 'text') {
      onCanvasClick(pos.x, pos.y);
    } else if (activeTool === 'shape' && cropRegion) {
      if (cropRegion.width > 5 && cropRegion.height > 5) {
        onShapeEnd(cropRegion.x, cropRegion.y, cropRegion.width, cropRegion.height);
      }
      setCropRegion(null);
    }
  }, [activeTool, getCanvasPos, onDrawEnd, onCanvasClick, onShapeEnd, cropRegion, setCropRegion]);

  const getCursor = () => {
    switch (activeTool) {
      case 'draw': return 'crosshair';
      case 'text': return 'text';
      case 'crop': return 'crosshair';
      case 'shape': return 'crosshair';
      default: return 'default';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 items-center justify-center overflow-auto bg-editor-workspace p-6"
    >
      {!hasImage && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 text-editor-muted">
          <div className="rounded-2xl border-2 border-dashed border-editor-border p-12 text-center">
            <div className="mb-3 text-5xl">🖼️</div>
            <p className="text-lg font-medium text-editor-text">No image loaded</p>
            <p className="mt-1 text-sm">Click "Upload" in the toolbar to get started</p>
          </div>
        </div>
      )}

      <div className="relative shadow-2xl shadow-black/50">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ cursor: getCursor(), display: 'block', maxWidth: '100%', maxHeight: 'calc(100vh - 200px)' }}
          className="rounded-sm"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {/* Crop/Shape overlay canvas */}
        <canvas
          ref={overlayCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 200px)',
          }}
        />
      </div>
    </div>
  );
}

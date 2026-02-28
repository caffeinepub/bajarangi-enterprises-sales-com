import { useRef, useState, useCallback } from 'react';
import type {
  ToolType,
  CanvasElement,
  FilterState,
  HistoryEntry,
  DrawElement,
  TextElement,
  ShapeElement,
  DrawToolSettings,
  TextToolSettings,
  ShapeToolSettings,
  CropRegion,
  TransformationDescriptor,
} from '../types/editor';
import {
  renderElements,
  applyFiltersToCanvas,
  loadImageToCanvas,
  cropImageData,
  resizeImageData,
  exportCanvasToPNG,
  drawVignette,
  drawColorOverlay,
} from '../utils/canvasOperations';

const DEFAULT_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  opacity: 100,
};

export function useCanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [cropRegion, setCropRegion] = useState<CropRegion | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawId, setCurrentDrawId] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const [drawSettings, setDrawSettings] = useState<DrawToolSettings>({
    color: '#14b8a6',
    brushSize: 5,
  });
  const [textSettings, setTextSettings] = useState<TextToolSettings>({
    text: 'Your text here',
    fontSize: 32,
    fontFamily: 'Inter',
    color: '#ffffff',
    bold: false,
    italic: false,
    align: 'left',
  });
  const [shapeSettings, setShapeSettings] = useState<ShapeToolSettings>({
    shapeType: 'rectangle',
    strokeColor: '#14b8a6',
    fillColor: 'transparent',
    strokeWidth: 2,
  });

  const pushHistory = useCallback((imgData: ImageData | null, els: CanvasElement[], filt: FilterState) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ imageData: imgData, elements: [...els], filters: { ...filt } });
      return newHistory.slice(-50);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const redrawCanvas = useCallback((
    imgData: ImageData | null,
    els: CanvasElement[],
    filt: FilterState
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imgData) {
      applyFiltersToCanvas(canvas, imgData, filt);
    } else {
      ctx.fillStyle = '#2a2a3e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    renderElements(ctx, els);
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const imgData = await loadImageToCanvas(canvas, file);
      setCanvasSize({ width: canvas.width, height: canvas.height });
      setImageData(imgData);
      setElements([]);
      setFilters({ ...DEFAULT_FILTERS });
      pushHistory(imgData, [], { ...DEFAULT_FILTERS });
      redrawCanvas(imgData, [], { ...DEFAULT_FILTERS });
    } catch (e) {
      console.error('Failed to load image', e);
    }
  }, [pushHistory, redrawCanvas]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    if (!entry) return;
    setHistoryIndex(newIndex);
    setImageData(entry.imageData);
    setElements(entry.elements);
    setFilters(entry.filters);
    redrawCanvas(entry.imageData, entry.elements, entry.filters);
  }, [history, historyIndex, redrawCanvas]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    if (!entry) return;
    setHistoryIndex(newIndex);
    setImageData(entry.imageData);
    setElements(entry.elements);
    setFilters(entry.filters);
    redrawCanvas(entry.imageData, entry.elements, entry.filters);
  }, [history, historyIndex, redrawCanvas]);

  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    redrawCanvas(imageData, elements, newFilters);
  }, [imageData, elements, redrawCanvas]);

  const commitFilters = useCallback(() => {
    pushHistory(imageData, elements, filters);
  }, [imageData, elements, filters, pushHistory]);

  const applyCrop = useCallback((region: CropRegion) => {
    if (!imageData) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cropped = cropImageData(imageData, region.x, region.y, region.width, region.height);
    canvas.width = region.width;
    canvas.height = region.height;
    setCanvasSize({ width: region.width, height: region.height });
    setImageData(cropped);
    setCropRegion(null);
    pushHistory(cropped, elements, filters);
    redrawCanvas(cropped, elements, filters);
  }, [imageData, elements, filters, pushHistory, redrawCanvas]);

  const applyResize = useCallback((width: number, height: number) => {
    if (!imageData) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resized = resizeImageData(imageData, width, height);
    canvas.width = width;
    canvas.height = height;
    setCanvasSize({ width, height });
    setImageData(resized);
    pushHistory(resized, elements, filters);
    redrawCanvas(resized, elements, filters);
  }, [imageData, elements, filters, pushHistory, redrawCanvas]);

  const addTextElement = useCallback((x: number, y: number) => {
    const newEl: TextElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x, y,
      width: 200,
      height: textSettings.fontSize * 1.5,
      text: textSettings.text,
      fontSize: textSettings.fontSize,
      fontFamily: textSettings.fontFamily,
      color: textSettings.color,
      bold: textSettings.bold,
      italic: textSettings.italic,
      align: textSettings.align,
      visible: true,
    };
    const newElements: CanvasElement[] = [...elements, newEl];
    setElements(newElements);
    setSelectedElementId(newEl.id);
    pushHistory(imageData, newElements, filters);
    redrawCanvas(imageData, newElements, filters);
  }, [elements, textSettings, imageData, filters, pushHistory, redrawCanvas]);

  const addShapeElement = useCallback((x: number, y: number, width: number, height: number) => {
    const newEl: ShapeElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      shapeType: shapeSettings.shapeType,
      x, y, width, height,
      strokeColor: shapeSettings.strokeColor,
      fillColor: shapeSettings.fillColor,
      strokeWidth: shapeSettings.strokeWidth,
      visible: true,
    };
    const newElements: CanvasElement[] = [...elements, newEl];
    setElements(newElements);
    setSelectedElementId(newEl.id);
    pushHistory(imageData, newElements, filters);
    redrawCanvas(imageData, newElements, filters);
  }, [elements, shapeSettings, imageData, filters, pushHistory, redrawCanvas]);

  const startDrawing = useCallback((x: number, y: number) => {
    const newEl: DrawElement = {
      id: `draw-${Date.now()}`,
      type: 'draw',
      points: [{ x, y }],
      color: drawSettings.color,
      brushSize: drawSettings.brushSize,
      visible: true,
    };
    setElements((prev) => [...prev, newEl]);
    setCurrentDrawId(newEl.id);
    setIsDrawing(true);
  }, [drawSettings]);

  const continueDrawing = useCallback((x: number, y: number) => {
    if (!isDrawing || !currentDrawId) return;
    setElements((prev) => {
      const updated: CanvasElement[] = prev.map((el) => {
        if (el.id === currentDrawId && el.type === 'draw') {
          const drawEl = el as DrawElement;
          return { ...drawEl, points: [...drawEl.points, { x, y }] } as DrawElement;
        }
        return el;
      });
      redrawCanvas(imageData, updated, filters);
      return updated;
    });
  }, [isDrawing, currentDrawId, imageData, filters, redrawCanvas]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setCurrentDrawId(null);
    pushHistory(imageData, elements, filters);
  }, [isDrawing, imageData, elements, filters, pushHistory]);

  const deleteElement = useCallback((id: string) => {
    const newElements = elements.filter((el) => el.id !== id);
    setElements(newElements);
    if (selectedElementId === id) setSelectedElementId(null);
    pushHistory(imageData, newElements, filters);
    redrawCanvas(imageData, newElements, filters);
  }, [elements, selectedElementId, imageData, filters, pushHistory, redrawCanvas]);

  const toggleElementVisibility = useCallback((id: string) => {
    const newElements: CanvasElement[] = elements.map((el) =>
      el.id === id ? ({ ...el, visible: !el.visible } as CanvasElement) : el
    );
    setElements(newElements);
    redrawCanvas(imageData, newElements, filters);
  }, [elements, imageData, filters, redrawCanvas]);

  const reorderElements = useCallback((fromIndex: number, toIndex: number) => {
    const newElements = [...elements];
    const [moved] = newElements.splice(fromIndex, 1);
    newElements.splice(toIndex, 0, moved);
    setElements(newElements);
    pushHistory(imageData, newElements, filters);
    redrawCanvas(imageData, newElements, filters);
  }, [elements, imageData, filters, pushHistory, redrawCanvas]);

  const applyAITransformation = useCallback((descriptor: TransformationDescriptor) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newFilters = { ...filters };
    if (descriptor.filters) {
      Object.assign(newFilters, descriptor.filters);
    }
    setFilters(newFilters);

    if (descriptor.overlay && imageData) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.putImageData(imageData, 0, 0);
          if (descriptor.overlay.type === 'vignette') {
            drawVignette(tempCtx, canvas.width, canvas.height, descriptor.overlay.opacity ?? 0.6);
          } else if (descriptor.overlay.type === 'color' && descriptor.overlay.color) {
            drawColorOverlay(tempCtx, canvas.width, canvas.height, descriptor.overlay.color, descriptor.overlay.opacity ?? 0.25);
          } else if (descriptor.overlay.type === 'gradient' && descriptor.overlay.color) {
            const grad = tempCtx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(1, descriptor.overlay.color);
            tempCtx.globalAlpha = descriptor.overlay.opacity ?? 0.4;
            tempCtx.fillStyle = grad;
            tempCtx.fillRect(0, 0, canvas.width, canvas.height);
            tempCtx.globalAlpha = 1;
          }
          const newImgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
          setImageData(newImgData);
          pushHistory(newImgData, elements, newFilters);
          redrawCanvas(newImgData, elements, newFilters);
          return;
        }
      }
    }

    pushHistory(imageData, elements, newFilters);
    redrawCanvas(imageData, elements, newFilters);
  }, [filters, imageData, elements, pushHistory, redrawCanvas]);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    exportCanvasToPNG(canvas, imageData, elements, filters);
  }, [imageData, elements, filters]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements: CanvasElement[] = elements.map((el) =>
      el.id === id ? ({ ...el, ...updates } as CanvasElement) : el
    );
    setElements(newElements);
    redrawCanvas(imageData, newElements, filters);
  }, [elements, imageData, filters, redrawCanvas]);

  return {
    canvasRef,
    activeTool,
    setActiveTool,
    imageData,
    elements,
    filters,
    selectedElementId,
    setSelectedElementId,
    cropRegion,
    setCropRegion,
    isDrawing,
    canvasSize,
    drawSettings,
    setDrawSettings,
    textSettings,
    setTextSettings,
    shapeSettings,
    setShapeSettings,
    uploadImage,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    updateFilters,
    commitFilters,
    applyCrop,
    applyResize,
    addTextElement,
    addShapeElement,
    startDrawing,
    continueDrawing,
    stopDrawing,
    deleteElement,
    toggleElementVisibility,
    reorderElements,
    applyAITransformation,
    downloadImage,
    updateElement,
    redrawCanvas,
  };
}

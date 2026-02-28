import type { FilterState, CanvasElement, TextElement, ShapeElement, DrawElement } from '../types/editor';

export function applyFiltersToCanvas(
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  filters: FilterState
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.filter = buildFilterString(filters);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  tempCtx.putImageData(imageData, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = 'none';
}

export function buildFilterString(filters: FilterState): string {
  const parts: string[] = [];
  if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
  if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
  if (filters.saturation !== 100) parts.push(`saturate(${filters.saturation}%)`);
  if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
  if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
  if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
  if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
  if (filters.opacity !== 100) parts.push(`opacity(${filters.opacity}%)`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function renderElements(
  ctx: CanvasRenderingContext2D,
  elements: CanvasElement[]
): void {
  elements.forEach((el) => {
    if (!el.visible) return;
    if (el.type === 'text') renderTextElement(ctx, el as TextElement);
    else if (el.type === 'shape') renderShapeElement(ctx, el as ShapeElement);
    else if (el.type === 'draw') renderDrawElement(ctx, el as DrawElement);
  });
}

function renderTextElement(ctx: CanvasRenderingContext2D, el: TextElement): void {
  ctx.save();
  const fontStyle = `${el.italic ? 'italic ' : ''}${el.bold ? 'bold ' : ''}${el.fontSize}px ${el.fontFamily}`;
  ctx.font = fontStyle;
  ctx.fillStyle = el.color;
  ctx.textAlign = el.align;
  ctx.textBaseline = 'top';
  const x = el.align === 'center' ? el.x + el.width / 2 : el.align === 'right' ? el.x + el.width : el.x;
  const lines = el.text.split('\n');
  lines.forEach((line, i) => {
    ctx.fillText(line, x, el.y + i * (el.fontSize * 1.2));
  });
  ctx.restore();
}

function renderShapeElement(ctx: CanvasRenderingContext2D, el: ShapeElement): void {
  ctx.save();
  ctx.strokeStyle = el.strokeColor;
  ctx.fillStyle = el.fillColor;
  ctx.lineWidth = el.strokeWidth;

  if (el.shapeType === 'rectangle') {
    if (el.fillColor !== 'transparent') ctx.fillRect(el.x, el.y, el.width, el.height);
    ctx.strokeRect(el.x, el.y, el.width, el.height);
  } else if (el.shapeType === 'circle') {
    ctx.beginPath();
    ctx.ellipse(
      el.x + el.width / 2,
      el.y + el.height / 2,
      Math.abs(el.width / 2),
      Math.abs(el.height / 2),
      0, 0, Math.PI * 2
    );
    if (el.fillColor !== 'transparent') ctx.fill();
    ctx.stroke();
  } else if (el.shapeType === 'line') {
    ctx.beginPath();
    ctx.moveTo(el.x, el.y);
    ctx.lineTo(el.x + el.width, el.y + el.height);
    ctx.stroke();
  } else if (el.shapeType === 'arrow') {
    const endX = el.x + el.width;
    const endY = el.y + el.height;
    const angle = Math.atan2(endY - el.y, endX - el.x);
    const headLen = 15;
    ctx.beginPath();
    ctx.moveTo(el.x, el.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = el.strokeColor;
    ctx.fill();
  }
  ctx.restore();
}

function renderDrawElement(ctx: CanvasRenderingContext2D, el: DrawElement): void {
  if (el.points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = el.color;
  ctx.lineWidth = el.brushSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(el.points[0].x, el.points[0].y);
  for (let i = 1; i < el.points.length; i++) {
    ctx.lineTo(el.points[i].x, el.points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

export function loadImageToCanvas(
  canvas: HTMLCanvasElement,
  file: File
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No context')); return; }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(imageData);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function cropImageData(
  imageData: ImageData,
  x: number, y: number, width: number, height: number
): ImageData {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return imageData;
  tempCtx.putImageData(imageData, 0, 0);

  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = width;
  cropCanvas.height = height;
  const cropCtx = cropCanvas.getContext('2d');
  if (!cropCtx) return imageData;
  cropCtx.drawImage(tempCanvas, x, y, width, height, 0, 0, width, height);
  return cropCtx.getImageData(0, 0, width, height);
}

export function resizeImageData(
  imageData: ImageData,
  newWidth: number,
  newHeight: number
): ImageData {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return imageData;
  tempCtx.putImageData(imageData, 0, 0);

  const resizeCanvas = document.createElement('canvas');
  resizeCanvas.width = newWidth;
  resizeCanvas.height = newHeight;
  const resizeCtx = resizeCanvas.getContext('2d');
  if (!resizeCtx) return imageData;
  resizeCtx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
  return resizeCtx.getImageData(0, 0, newWidth, newHeight);
}

export function exportCanvasToPNG(
  canvas: HTMLCanvasElement,
  imageData: ImageData | null,
  elements: CanvasElement[],
  filters: FilterState
): void {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;
  const ctx = exportCanvas.getContext('2d');
  if (!ctx) return;

  if (imageData) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.putImageData(imageData, 0, 0);
      ctx.filter = buildFilterString(filters);
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.filter = 'none';
    }
  }

  renderElements(ctx, elements);

  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = exportCanvas.toDataURL('image/png');
  link.click();
}

export function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number = 0.7): void {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.3,
    width / 2, height / 2, Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, `rgba(0,0,0,0)`);
  gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export function drawColorOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, color: string, opacity: number): void {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

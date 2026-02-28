export type ToolType =
  | 'select'
  | 'crop'
  | 'draw'
  | 'text'
  | 'shape'
  | 'filter'
  | 'resize'
  | 'layers'
  | 'aiEdit';

export type ShapeType = 'rectangle' | 'circle' | 'line' | 'arrow';

export interface FilterState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  opacity: number;
}

export interface TextElement {
  id: string;
  type: 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  visible: boolean;
}

export interface ShapeElement {
  id: string;
  type: 'shape';
  shapeType: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  visible: boolean;
}

export interface DrawElement {
  id: string;
  type: 'draw';
  points: { x: number; y: number }[];
  color: string;
  brushSize: number;
  visible: boolean;
}

export type CanvasElement = TextElement | ShapeElement | DrawElement;

export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HistoryEntry {
  imageData: ImageData | null;
  elements: CanvasElement[];
  filters: FilterState;
}

export interface DrawToolSettings {
  color: string;
  brushSize: number;
}

export interface TextToolSettings {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
}

export interface ShapeToolSettings {
  shapeType: ShapeType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
}

export interface TransformationDescriptor {
  type: string;
  filters?: Partial<FilterState>;
  overlay?: {
    type: 'vignette' | 'gradient' | 'color';
    color?: string;
    opacity?: number;
    direction?: string;
  };
  text?: string;
}

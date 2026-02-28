import { useEffect, useCallback } from 'react';
import { useCanvasEditor } from '../hooks/useCanvasEditor';
import EditorToolbar from '../components/editor/EditorToolbar';
import ToolsPanel from '../components/editor/ToolsPanel';
import CanvasWorkspace from '../components/editor/CanvasWorkspace';
import PropertiesPanel from '../components/editor/PropertiesPanel';

export default function Editor() {
  const {
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
    canUndo,
    canRedo,
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
  } = useCanvasEditor();

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
      e.preventDefault();
      redo();
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedElementId && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        deleteElement(selectedElementId);
      }
    }
  }, [undo, redo, selectedElementId, deleteElement]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleCanvasClick = useCallback((x: number, y: number) => {
    if (activeTool === 'text') {
      addTextElement(x, y);
    }
  }, [activeTool, addTextElement]);

  const handleShapeEnd = useCallback((x: number, y: number, width: number, height: number) => {
    if (activeTool === 'shape') {
      addShapeElement(x, y, width, height);
    }
  }, [activeTool, addShapeElement]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-editor-bg">
      <EditorToolbar
        onUpload={uploadImage}
        onDownload={downloadImage}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        hasImage={!!imageData}
      />

      <div className="flex flex-1 overflow-hidden">
        <ToolsPanel activeTool={activeTool} onToolSelect={setActiveTool} />

        <CanvasWorkspace
          canvasRef={canvasRef}
          activeTool={activeTool}
          hasImage={!!imageData}
          cropRegion={cropRegion}
          setCropRegion={setCropRegion}
          onCanvasClick={handleCanvasClick}
          onDrawStart={startDrawing}
          onDrawMove={continueDrawing}
          onDrawEnd={stopDrawing}
          onShapeEnd={handleShapeEnd}
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
        />

        <PropertiesPanel
          activeTool={activeTool}
          filters={filters}
          onFiltersChange={updateFilters}
          onFiltersCommit={commitFilters}
          drawSettings={drawSettings}
          onDrawSettingsChange={setDrawSettings}
          textSettings={textSettings}
          onTextSettingsChange={setTextSettings}
          shapeSettings={shapeSettings}
          onShapeSettingsChange={setShapeSettings}
          cropRegion={cropRegion}
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
          onApplyCrop={applyCrop}
          onCancelCrop={() => setCropRegion(null)}
          onApplyResize={applyResize}
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onDeleteElement={deleteElement}
          onToggleVisibility={toggleElementVisibility}
          onReorder={reorderElements}
          onApplyAITransformation={applyAITransformation}
          hasImage={!!imageData}
        />
      </div>
    </div>
  );
}

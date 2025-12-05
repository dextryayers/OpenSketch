'use client';

import React, { useEffect, useRef } from 'react';
import { 
  Canvas, 
  Rect, 
  Ellipse, 
  Triangle, 
  Polygon, 
  Line, 
  Path, 
  IText, 
  PencilBrush, 
  Point, 
  Pattern, 
  util 
} from 'fabric';
import { useStore } from '../../store/useStore';
import { ToolType, GridType } from '../../types';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

interface WhiteboardProps {
  roomId: string;
}

export const Whiteboard: React.FC<WhiteboardProps> = ({ roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const socketRef = useRef<any>(null);
  
  // Interaction State Refs
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const lastClientX = useRef(0);
  const lastClientY = useRef(0);
  
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const currentObject = useRef<any>(null);
  
  // Ref for active tool and properties
  const activeToolRef = useRef<ToolType>(ToolType.SELECTION);
  const strokeColorRef = useRef<string>('#000000');
  const strokeWidthRef = useRef<number>(2);
  const opacityRef = useRef<number>(1);

  // History State
  const history = useRef<string[]>([]);
  const historyStep = useRef<number>(-1);
  const isHistoryProcessing = useRef<boolean>(false);

  const { activeTool, strokeColor, strokeWidth, fillColor, roughness, opacity, isDarkMode, gridType } = useStore();

  // Sync state to Refs
  useEffect(() => {
    activeToolRef.current = activeTool;
    strokeColorRef.current = strokeColor;
    strokeWidthRef.current = strokeWidth;
    opacityRef.current = opacity;
    updateCanvasInteraction();
  }, [activeTool, strokeColor, strokeWidth, opacity]);

  const getClientPos = (evt: any) => {
    if (evt.touches && evt.touches.length > 0) {
      return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
    }
    return { x: evt.clientX, y: evt.clientY };
  };

  const getArrowPath = (x1: number, y1: number, x2: number, y2: number) => {
    const headLength = 20;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const p3 = {
      x: x2 - headLength * Math.cos(angle - Math.PI / 6),
      y: y2 - headLength * Math.sin(angle - Math.PI / 6)
    };
    const p4 = {
      x: x2 - headLength * Math.cos(angle + Math.PI / 6),
      y: y2 - headLength * Math.sin(angle + Math.PI / 6)
    };
    return `M ${x1} ${y1} L ${x2} ${y2} M ${x2} ${y2} L ${p3.x} ${p3.y} M ${x2} ${y2} L ${p4.x} ${p4.y}`;
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : hex;
  };

  const applyBackground = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const baseColor = isDarkMode ? '#18181b' : '#ffffff';
    const gridColor = isDarkMode ? '#3f3f46' : '#e5e7eb';
    
    if (gridType === GridType.NONE) {
        canvas.backgroundColor = baseColor;
        canvas.requestRenderAll();
        return;
    }

    const size = 20;
    let svgContent = '';
    
    if (gridType === GridType.LINES) {
        svgContent = `<defs><pattern id="grid" width="${size}" height="${size}" patternUnits="userSpaceOnUse"><path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${gridColor}" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" />`;
    } else if (gridType === GridType.DOTS) {
        svgContent = `<defs><pattern id="dots" width="${size}" height="${size}" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="${gridColor}" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" />`;
    }

    const url = `data:image/svg+xml;base64,${btoa(`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`)}`;
    
    const img = new Image();
    img.src = url;
    img.onload = () => {
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.backgroundColor = new Pattern({ source: img, repeat: 'repeat' });
            fabricCanvasRef.current.requestRenderAll();
        }
    };
  };

  const saveHistory = () => {
    if (isHistoryProcessing.current || !fabricCanvasRef.current) return;
    if (historyStep.current < history.current.length - 1) {
      history.current = history.current.slice(0, historyStep.current + 1);
    }
    const json = fabricCanvasRef.current.toObject(['id', 'selectable', 'evented', 'opacity']);
    delete (json as any).background;
    delete (json as any).backgroundColor;
    delete (json as any).backgroundImage;
    const jsonString = JSON.stringify(json);
    history.current.push(jsonString);
    historyStep.current = history.current.length - 1;
    if (history.current.length > 50) {
      history.current.shift();
      historyStep.current--;
    }
  };

  const undo = () => {
    if (historyStep.current > 0) {
      isHistoryProcessing.current = true;
      historyStep.current--;
      const state = history.current[historyStep.current];
      loadCanvasState(state);
    }
  };

  const redo = () => {
    if (historyStep.current < history.current.length - 1) {
      isHistoryProcessing.current = true;
      historyStep.current++;
      const state = history.current[historyStep.current];
      loadCanvasState(state);
    }
  };

  const loadCanvasState = async (json: string) => {
    if (!fabricCanvasRef.current) return;
    const data = JSON.parse(json);
    await fabricCanvasRef.current.loadFromJSON(data);
    applyBackground();
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.getObjects().forEach(obj => applyToolRules(obj));
    }
    fabricCanvasRef.current?.requestRenderAll();
    isHistoryProcessing.current = false;
  };

  useEffect(() => {
    const handleUndoEvent = () => undo();
    const handleRedoEvent = () => redo();
    window.addEventListener('whiteboard:undo', handleUndoEvent);
    window.addEventListener('whiteboard:redo', handleRedoEvent);
    return () => {
      window.removeEventListener('whiteboard:undo', handleUndoEvent);
      window.removeEventListener('whiteboard:redo', handleRedoEvent);
    };
  }, []);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    if (roomId) socketRef.current.emit('join-room', roomId);

    socketRef.current.on('drawing-data', (data: any) => {
      if (!fabricCanvasRef.current) return;
      const existingObj = fabricCanvasRef.current.getObjects().find((o: any) => o.id === data.id);
      isHistoryProcessing.current = true;
      if (!existingObj) {
        util.enlivenObjects([data]).then((objs: any[]) => {
          objs.forEach((o) => {
            (o as any).id = data.id;
            applyToolRules(o);
            fabricCanvasRef.current?.add(o);
          });
          fabricCanvasRef.current?.requestRenderAll();
          isHistoryProcessing.current = false;
          saveHistory();
        });
      } else {
        existingObj.set(data);
        existingObj.setCoords();
        fabricCanvasRef.current.requestRenderAll();
        isHistoryProcessing.current = false;
        saveHistory();
      }
    });

    socketRef.current.on('delete-object', (id: string) => {
        if (!fabricCanvasRef.current) return;
        const obj = fabricCanvasRef.current.getObjects().find((o: any) => o.id === id);
        if (obj) {
            isHistoryProcessing.current = true;
            fabricCanvasRef.current.remove(obj);
            fabricCanvasRef.current.requestRenderAll();
            isHistoryProcessing.current = false;
            saveHistory();
        }
    });

    return () => { socketRef.current?.disconnect(); };
  }, [roomId]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: true,
      backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
      preserveObjectStacking: true,
      stopContextMenu: true,
      fireRightClick: true,
    });

    fabricCanvasRef.current = canvas;
    saveHistory();

    const handleResize = () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);

    canvas.on('mouse:wheel', function(opt: any) {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 5) zoom = 5;
      if (zoom < 0.2) zoom = 0.2;
      const point = new Point(opt.e.offsetX, opt.e.offsetY);
      canvas.zoomToPoint(point, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('path:created', handlePathCreated);

    canvas.on('object:modified', (e: any) => {
        saveHistory();
        const obj = e.target;
        if (!obj) return;
        const json = obj.toObject(['id', 'opacity']);
        socketRef.current?.emit('drawing-data', { roomId, ...json });
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    applyBackground();
  }, [isDarkMode, gridType]);

  const applyToolRules = (obj: any) => {
      const tool = activeToolRef.current;
      const isSelection = tool === ToolType.SELECTION;
      if (isSelection) {
          obj.evented = true;
          obj.selectable = true;
      } else {
          obj.evented = false;
          obj.selectable = false;
      }
  };

  const updateCanvasInteraction = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const tool = activeToolRef.current;
    const isPencil = tool === ToolType.PENCIL;

    canvas.selection = tool === ToolType.SELECTION;
    canvas.isDrawingMode = isPencil;

    if (isPencil) {
      const brush = new PencilBrush(canvas);
      brush.width = strokeWidthRef.current;
      brush.color = hexToRgba(strokeColorRef.current, opacityRef.current);
      canvas.freeDrawingBrush = brush;
    }

    canvas.getObjects().forEach(obj => applyToolRules(obj));

    if (tool === ToolType.HAND) {
      canvas.defaultCursor = 'grab';
      canvas.hoverCursor = 'grab';
    } else if (tool === ToolType.ERASER) {
      canvas.defaultCursor = 'cell'; 
      canvas.hoverCursor = 'cell';
    } else if (tool === ToolType.SELECTION) {
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
    } else {
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    }
    canvas.requestRenderAll();
  };

  useEffect(() => { updateCanvasInteraction(); }, [activeTool, strokeColor, strokeWidth, opacity]);

  const handleMouseDown = (opt: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const evt = opt.e;
    const clientPos = getClientPos(evt);
    const pointer = canvas.getPointer(evt);
    const tool = activeToolRef.current;

    if (tool === ToolType.HAND) {
      if(evt.preventDefault) evt.preventDefault();
      isPanning.current = true;
      lastClientX.current = clientPos.x;
      lastClientY.current = clientPos.y;
      canvas.setCursor('grabbing');
      canvas.requestRenderAll();
      return;
    }

    if (tool === ToolType.ERASER) {
      if(evt.preventDefault) evt.preventDefault();
      isDrawing.current = true;
      eraseObjectsAtPoint(pointer);
      return;
    }

    if (tool === ToolType.SELECTION || tool === ToolType.PENCIL) return;

    isDrawing.current = true;
    startPoint.current = { x: pointer.x, y: pointer.y };
    const id = uuidv4();

    const commonProps = {
      left: pointer.x,
      top: pointer.y,
      fill: fillColor === 'transparent' ? '' : fillColor, 
      stroke: strokeColorRef.current,
      strokeWidth: strokeWidthRef.current,
      opacity: opacityRef.current,
      selectable: false,
      evented: false,
      originX: 'left' as const,
      originY: 'top' as const,
      id: id,
      strokeUniform: true,
      cornerStyle: 'circle' as const,
      cornerColor: 'white',
      borderColor: '#3b82f6',
      transparentCorners: false,
    };

    let shape: any = null;

    if (tool === ToolType.RECTANGLE) {
      shape = new Rect({ ...commonProps, width: 0, height: 0 });
    } else if (tool === ToolType.ROUND_RECT) {
      shape = new Rect({ ...commonProps, width: 0, height: 0, rx: 10, ry: 10 });
    } else if (tool === ToolType.CIRCLE) {
      shape = new Ellipse({ ...commonProps, rx: 0, ry: 0 });
    } else if (tool === ToolType.TRIANGLE) {
      shape = new Triangle({ ...commonProps, width: 0, height: 0 });
    } else if (tool === ToolType.RHOMBUS) {
      shape = new Polygon([{ x: 0.5, y: 0 }, { x: 1, y: 0.5 }, { x: 0.5, y: 1 }, { x: 0, y: 0.5 }], { ...commonProps, scaleX: 0, scaleY: 0 });
    } else if (tool === ToolType.HEXAGON) {
      shape = new Polygon([{ x: 0.25, y: 0 }, { x: 0.75, y: 0 }, { x: 1, y: 0.5 }, { x: 0.75, y: 1 }, { x: 0.25, y: 1 }, { x: 0, y: 0.5 }], { ...commonProps, scaleX: 0, scaleY: 0 });
    } else if (tool === ToolType.LINE) {
      shape = new Line([pointer.x, pointer.y, pointer.x, pointer.y], commonProps);
    } else if (tool === ToolType.ARROW) {
      shape = new Path(getArrowPath(pointer.x, pointer.y, pointer.x, pointer.y), { ...commonProps, fill: '', stroke: strokeColorRef.current });
    } else if (tool === ToolType.TEXT) {
      const text = new IText('Type here', { ...commonProps, fontFamily: 'Inter, sans-serif', fontSize: 24, fill: strokeColorRef.current });
      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      text.selectable = true;
      text.evented = true;
      isDrawing.current = false;
      saveHistory(); 
      return;
    }

    if (shape) {
      canvas.add(shape);
      currentObject.current = shape;
    }
  };

  const handleMouseMove = (opt: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const evt = opt.e;
    const clientPos = getClientPos(evt);
    const pointer = canvas.getPointer(evt);
    const tool = activeToolRef.current;

    if (tool === ToolType.HAND && isPanning.current) {
      if(evt.preventDefault) evt.preventDefault();
      if(evt.stopPropagation) evt.stopPropagation();
      const deltaX = clientPos.x - lastClientX.current;
      const deltaY = clientPos.y - lastClientY.current;
      canvas.relativePan(new Point(deltaX, deltaY));
      lastClientX.current = clientPos.x;
      lastClientY.current = clientPos.y;
      return;
    }

    if (tool === ToolType.ERASER && isDrawing.current) {
        eraseObjectsAtPoint(pointer);
        return;
    }

    if (!isDrawing.current || !currentObject.current || !startPoint.current) return;

    const startX = startPoint.current.x;
    const startY = startPoint.current.y;
    const shape = currentObject.current;
    const newLeft = Math.min(startX, pointer.x);
    const newTop = Math.min(startY, pointer.y);
    const width = Math.abs(startX - pointer.x);
    const height = Math.abs(startY - pointer.y);

    if (tool === ToolType.RECTANGLE || tool === ToolType.ROUND_RECT || tool === ToolType.TRIANGLE) {
        shape.set({ left: newLeft, top: newTop, width, height });
    } else if (tool === ToolType.CIRCLE) {
        shape.set({ left: newLeft, top: newTop, rx: width / 2, ry: height / 2 });
    } else if (tool === ToolType.RHOMBUS || tool === ToolType.HEXAGON) {
        shape.set({ left: newLeft, top: newTop, scaleX: width, scaleY: height });
    } else if (tool === ToolType.LINE) {
        shape.set({ x2: pointer.x, y2: pointer.y });
    } else if (tool === ToolType.ARROW) {
        canvas.remove(shape);
        const newArrow = new Path(getArrowPath(startX, startY, pointer.x, pointer.y), { ...(shape.toObject()), fill: '', stroke: strokeColorRef.current });
        canvas.add(newArrow);
        currentObject.current = newArrow;
    }
    canvas.requestRenderAll();
  };

  const handleMouseUp = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const tool = activeToolRef.current;

    if (tool === ToolType.HAND) {
      isPanning.current = false;
      canvas.setCursor('grab');
      return;
    }

    isDrawing.current = false;
    if (currentObject.current) {
      const shape = currentObject.current;
      shape.setCoords();
      const json = shape.toObject(['id', 'opacity']);
      socketRef.current?.emit('drawing-data', { roomId, ...json });
      saveHistory(); 
      currentObject.current = null;
    }
  };

  const handlePathCreated = (e: any) => {
    const path = e.path;
    path.set({ 
        id: uuidv4(), 
        opacity: opacityRef.current,
        selectable: activeToolRef.current === ToolType.SELECTION,
        evented: activeToolRef.current === ToolType.SELECTION
    });
    const json = path.toObject(['id', 'opacity']);
    socketRef.current?.emit('drawing-data', { roomId, ...json });
    saveHistory(); 
  };

  const eraseObjectsAtPoint = (pointer: { x: number, y: number }) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      const zoom = canvas.getZoom();
      const brushSize = 30 / zoom; 
      const objects = canvas.getObjects();
      let erasedSomething = false;
      
      for (let i = objects.length - 1; i >= 0; i--) {
          const obj = objects[i];
          const isIntersecting = obj.intersectsWithRect(
              new Point(pointer.x - brushSize/2, pointer.y - brushSize/2),
              new Point(pointer.x + brushSize/2, pointer.y + brushSize/2)
          );
          const containsPoint = obj.containsPoint(new Point(pointer.x, pointer.y));
          if (isIntersecting || containsPoint) {
              deleteObject(obj);
              erasedSomething = true;
          }
      }
      if (erasedSomething) {
          saveHistory();
      }
  };

  const deleteObject = (target: any) => {
      if (!fabricCanvasRef.current) return;
      const id = target.id;
      fabricCanvasRef.current.remove(target);
      fabricCanvasRef.current.requestRenderAll();
      socketRef.current?.emit('delete-object', { roomId, id });
  };

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-neutral-100 dark:bg-zinc-900" 
      style={{ touchAction: 'none' }} 
    >
      <canvas ref={canvasRef} />
    </div>
  );
};
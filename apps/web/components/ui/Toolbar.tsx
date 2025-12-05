
'use client';

import React from 'react';
import { useStore } from '../../store/useStore';
import { ToolType } from '../../types';
import { 
  MousePointer2, Square, Circle, Minus, ArrowRight, Pen, Type, Eraser, 
  Moon, Sun, Hand, Triangle, Hexagon, Diamond, CreditCard 
} from 'lucide-react';

const TOOLS = [
  { type: ToolType.HAND, icon: Hand, label: 'Hand (H)' },
  { type: ToolType.SELECTION, icon: MousePointer2, label: 'Selection (V)' },
  { type: ToolType.RECTANGLE, icon: Square, label: 'Rectangle (R)' },
  { type: ToolType.ROUND_RECT, icon: CreditCard, label: 'Round Rect' },
  { type: ToolType.CIRCLE, icon: Circle, label: 'Circle (O)' },
  { type: ToolType.TRIANGLE, icon: Triangle, label: 'Triangle' },
  { type: ToolType.RHOMBUS, icon: Diamond, label: 'Diamond' },
  { type: ToolType.HEXAGON, icon: Hexagon, label: 'Hexagon' },
  { type: ToolType.ARROW, icon: ArrowRight, label: 'Arrow (A)' },
  { type: ToolType.LINE, icon: Minus, label: 'Line (L)' },
  { type: ToolType.PENCIL, icon: Pen, label: 'Draw (P)' },
  { type: ToolType.TEXT, icon: Type, label: 'Text (T)' },
  { type: ToolType.ERASER, icon: Eraser, label: 'Eraser (E)' },
];

export const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool, isDarkMode, toggleDarkMode } = useStore();

  return (
    <div className="fixed z-[9999] flex items-center justify-center
      bottom-4 left-2 right-2 md:left-1/2 md:right-auto md:top-4 md:bottom-auto md:transform md:-translate-x-1/2
    " style={{ touchAction: 'none' }}>
      <div className="flex items-center gap-1 p-1.5 bg-white dark:bg-zinc-800 shadow-xl rounded-xl border border-gray-200 dark:border-zinc-700 overflow-x-auto max-w-full no-scrollbar pointer-events-auto">
        {TOOLS.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setActiveTool(tool.type)}
            className={`p-2 rounded-lg transition-all flex-shrink-0 flex items-center justify-center ${
              activeTool === tool.type
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 shadow-sm'
                : 'hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-zinc-700'
            }`}
            title={tool.label}
          >
            <tool.icon size={18} className={activeTool === tool.type ? "stroke-2" : "stroke-1.5"} />
          </button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 dark:bg-zinc-600 mx-1 flex-shrink-0" />
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 transition-colors flex-shrink-0"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
};

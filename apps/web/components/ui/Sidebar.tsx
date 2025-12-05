
'use client';

import React from 'react';
import { useStore } from '../../store/useStore';
import { GridType } from '../../types';
import { Palette, Grid3x3, ChevronLeft, ChevronRight, Hash, CircleDashed, Droplets, PenLine } from 'lucide-react';

const COLORS = [
  '#000000', // Black
  '#ef4444', // Red
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#eab308', // Yellow
  '#a855f7', // Purple
  '#f97316', // Orange
  '#ffffff', // White
];

export const Sidebar: React.FC = () => {
  const { 
    strokeColor, setStrokeColor, 
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
    gridType, setGridType,
    isSidebarOpen, toggleSidebar
  } = useStore();

  return (
    <>
      {/* Toggle Button (Always Visible) */}
      <button
        onClick={toggleSidebar}
        className={`
          fixed top-1/2 -translate-y-1/2 z-[60]
          w-8 h-12 bg-white dark:bg-zinc-800 
          border-y border-r border-gray-200 dark:border-zinc-700 
          rounded-r-lg shadow-md flex items-center justify-center
          text-gray-600 dark:text-gray-300 hover:text-blue-500
          transition-all duration-300
          ${isSidebarOpen ? 'left-[240px]' : 'left-0'}
        `}
        style={{ touchAction: 'none' }}
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar Content */}
      <div 
        className={`
          fixed top-1/2 -translate-y-1/2 left-0 z-50
          w-[240px] bg-white dark:bg-zinc-800 
          border-y border-r border-gray-200 dark:border-zinc-700 
          shadow-xl rounded-r-xl p-4 flex flex-col gap-6
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ touchAction: 'none' }}
      >
        
        {/* Color Picker Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Palette size={16} />
            <span>Stroke Color</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-600 transition-transform hover:scale-110 ${
                  strokeColor === color ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-800' : ''
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-600">
                <input 
                type="color" 
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0"
                title="Custom Color"
                />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 dark:bg-zinc-700" />
        
        {/* Opacity & Width Section */}
        <div className="flex flex-col gap-4">
            {/* Opacity Slider */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Droplets size={16} />
                        <span>Opacity</span>
                    </div>
                    <span className="text-xs">{Math.round(opacity * 100)}%</span>
                </div>
                <input 
                    type="range" 
                    min="0.1" 
                    max="1" 
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>

            {/* Stroke Width Slider */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <PenLine size={16} />
                        <span>Thickness</span>
                    </div>
                    <span className="text-xs">{strokeWidth}px</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>
        </div>

        <div className="w-full h-px bg-gray-200 dark:bg-zinc-700" />

        {/* Grid Mode Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Grid3x3 size={16} />
            <span>Canvas Grid</span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setGridType(GridType.NONE)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                gridType === GridType.NONE 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="w-4 h-4 rounded border border-current opacity-50" />
              Blank
            </button>
            <button
              onClick={() => setGridType(GridType.LINES)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                gridType === GridType.LINES 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Hash size={16} />
              Grid Lines
            </button>
            <button
              onClick={() => setGridType(GridType.DOTS)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                gridType === GridType.DOTS 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <CircleDashed size={16} />
              Dots
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

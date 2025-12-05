
'use client';

import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

export const HistoryControls: React.FC = () => {
  const handleUndo = () => {
    window.dispatchEvent(new CustomEvent('whiteboard:undo'));
  };

  const handleRedo = () => {
    window.dispatchEvent(new CustomEvent('whiteboard:redo'));
  };

  return (
    <div 
      className="fixed z-[60] flex gap-2
        top-4 left-4 
        md:top-auto md:bottom-4 md:left-4"
      style={{ touchAction: 'none' }}
    >
      <button
        onClick={handleUndo}
        className="p-2.5 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors active:scale-95"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={20} />
      </button>
      <button
        onClick={handleRedo}
        className="p-2.5 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors active:scale-95"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={20} />
      </button>
    </div>
  );
};

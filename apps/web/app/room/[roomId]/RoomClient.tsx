'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Toolbar } from '../../../components/ui/Toolbar';
import { Sidebar } from '../../../components/ui/Sidebar';
import { HistoryControls } from '../../../components/ui/HistoryControls';

const Whiteboard = dynamic(
  () => import('../../../components/canvas/Whiteboard').then((mod) => mod.Whiteboard),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-neutral-50 dark:bg-zinc-900 text-gray-400 animate-pulse">
        Initializing Canvas...
      </div>
    )
  }
);

interface RoomClientProps {
  roomId: string;
}

export default function RoomClient({ roomId }: RoomClientProps) {
  if (!roomId) {
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-neutral-50 dark:bg-zinc-900">
            <div className="animate-pulse text-gray-500">Loading Room...</div>
        </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden bg-neutral-50 dark:bg-zinc-900"
      style={{ touchAction: 'none' }}
    >
      <div className="flex-1 relative w-full h-full">
        <Whiteboard roomId={roomId} />
        <Sidebar />
        <HistoryControls />
        <Toolbar />
        <div className="absolute bottom-24 left-4 md:bottom-4 md:left-4 text-xs text-gray-400 pointer-events-none select-none z-0 hidden md:block">
           OpenSketch • {roomId.slice(0, 8)}...
        </div>
      </div>
    </div>
  );
}
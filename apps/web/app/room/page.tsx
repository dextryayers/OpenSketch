'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Toolbar } from '../../components/ui/Toolbar';
import { Sidebar } from '../../components/ui/Sidebar';
import { HistoryControls } from '../../components/ui/HistoryControls';

const Whiteboard = dynamic(
  () => import('../../components/canvas/Whiteboard').then((mod) => mod.Whiteboard),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-neutral-50 dark:bg-zinc-900 text-gray-400 animate-pulse">
        Initializing Canvas...
      </div>
    )
  }
);

function RoomContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('id');

  if (!roomId) {
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-neutral-50 dark:bg-zinc-900">
            <div className="text-gray-500">No Room ID provided.</div>
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

export default function RoomPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <RoomContent />
    </Suspense>
  );
}
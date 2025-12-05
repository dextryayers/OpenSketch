'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { PenTool } from 'lucide-react';

interface LandingPageProps {
  onJoin?: (id: string) => void;
}

export default function LandingPage({ onJoin }: LandingPageProps) {
  let router: any = null;
  try {
    router = useRouter();
  } catch (e) {
    // Ignore error
  }

  const createRoom = () => {
    const roomId = uuidv4();
    if (onJoin) {
      onJoin(roomId);
    } else if (router) {
      // PENTING: Gunakan Query Param (?id=) untuk static hosting
      router.push(`/room?id=${roomId}`);
    } else {
      window.location.href = `/room?id=${roomId}`;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 p-4 rounded-full mb-4 shadow-lg">
            <PenTool size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">OpenSketch</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Collaborative, open-source whiteboard with hand-drawn style.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700">
          <button
            onClick={createRoom}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Start Drawing
          </button>
          <p className="mt-4 text-sm text-gray-500">
            No sign-up required. Just click and share the link.
          </p>
        </div>

        <div className="pt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">
                © {new Date().getFullYear()} OpenSketch. Copyright by haniipp.space
            </p>
        </div>
      </div>
    </div>
  );
}
import React, { useRef } from 'react';
import { Tldraw } from 'tldraw';
import { useSyncDemo } from '@tldraw/sync';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';
import 'tldraw/tldraw.css';

const Whiteboard = ({ whiteboardVisibility, setWhiteboardVisibility }) => {
  const { interviewSessionData } = useSelector((state) => state.interviewSession);
  const editorRef = useRef(null);

  // Create shared store using roomId for real-time sync
  const store = useSyncDemo({
    roomId: interviewSessionData?.roomId || 'default-room'
  });

  return (
    <div className={`fixed ${whiteboardVisibility ? 'right-0' : '-right-full'} top-0 z-30 h-full w-[70%] bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0 h-14">
        <h2 className="text-gray-900 font-semibold text-lg">Whiteboard</h2>
        <button
          onClick={() => setWhiteboardVisibility(false)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Close whiteboard"
        >
          <X className="h-5 w-5 text-gray-900" />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <Tldraw
          store={store}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>
    </div>
  );
};

export default Whiteboard;

import {
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomControls from './CustomControls';
import { Users, Maximize2, Grid3x3, User } from 'lucide-react';
import './VideoCall.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useSocket } from '@/contexts/SocketContext';
import { toast } from 'sonner';
import Chat from './Chat';
import InterviewQuestions from './InterviewQuestions';
import RecordAnswerArea from './RecordAnswerArea';
import Whiteboard from './Whiteboard';
import CodeEditorPanel from './CodeEditorPanel';
import ResumeViewer from './ResumeViewer';

const CallView = ({ onLeave }) => {
  const { interviewSessionData } = useSelector((state) => state.interviewSession);
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' or 'speaker'
  const [chatVisibility, setChatVisibility] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState(() => interviewSessionData?.interviewQuestions || []);
  const [interviewQuestionsVisibility, setInterviewQuestionsVisibility] = useState(false);
  const [answerAreaVisibility, setAnswerAreaVisibility] = useState(false);
  const [whiteboardVisibility, setWhiteboardVisibility] = useState(false);
  const [codeEditorVisibility, setCodeEditorVisibility] = useState(false);
  const [resumeVisibility, setResumeVisibility] = useState(false);
  const [askedQuestionData, setAskedQuestionData] = useState(null);
  const { socket, isConnected, joinRoom, leaveRoom, addEventListener } = useSocket();
  const canViewQuestions = interviewSessionData?.role === 'recruiter' || interviewSessionData?.role === 'admin';
  const canViewResume = canViewQuestions && Boolean(interviewSessionData?.resumeUrl);
  const canAnswerQuestions = interviewSessionData?.role === 'candidate';

  const toggleChatVisibility = () => {
    setChatVisibility((prev) => {
      const next = !prev;
      if (next) {
        setInterviewQuestionsVisibility(false);
        setAnswerAreaVisibility(false);
        setWhiteboardVisibility(false);
        setCodeEditorVisibility(false);
        setResumeVisibility(false);
      }
      return next;
    });
  };

  const toggleInterviewQuestionsVisibility = () => {
    setInterviewQuestionsVisibility((prev) => {
      const next = !prev;
      if (next) {
        setChatVisibility(false);
        setAnswerAreaVisibility(false);
        setWhiteboardVisibility(false);
        setCodeEditorVisibility(false);
        setResumeVisibility(false);
      }
      return next;
    });
  };

  const toggleAnswerAreaVisibility = () => {
    setAnswerAreaVisibility((prev) => {
      const next = !prev;
      if (next) {
        setChatVisibility(false);
        setInterviewQuestionsVisibility(false);
        setWhiteboardVisibility(false);
        setCodeEditorVisibility(false);
        setResumeVisibility(false);
      }
      return next;
    });
  };

  const toggleWhiteboardVisibility = () => {
    setWhiteboardVisibility((prev) => {
      const next = !prev;
      if (next) {
        setChatVisibility(false);
        setInterviewQuestionsVisibility(false);
        setAnswerAreaVisibility(false);
        setCodeEditorVisibility(false);
        setResumeVisibility(false);
      }
      return next;
    });
  };

  const toggleCodeEditorVisibility = () => {
    setCodeEditorVisibility((prev) => {
      const next = !prev;
      if (next) {
        setChatVisibility(false);
        setInterviewQuestionsVisibility(false);
        setAnswerAreaVisibility(false);
        setWhiteboardVisibility(false);
        setResumeVisibility(false);
      }
      return next;
    });
  };

  const toggleResumeVisibility = () => {
    setResumeVisibility((prev) => {
      const next = !prev;
      if (next) {
        setChatVisibility(false);
        setInterviewQuestionsVisibility(false);
        setAnswerAreaVisibility(false);
        setWhiteboardVisibility(false);
        setCodeEditorVisibility(false);
      }
      return next;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    if (isConnected && socket && interviewSessionData?.roomId) {
      const joined = joinRoom(interviewSessionData.roomId);
      if (!joined) {
        toast.error('Failed to connect with socket.');
        return;
      };
      console.log("SOCKET CONNECTEDDDDDDDD AND JOINED IN ROOM")
    }

    return () => leaveRoom(interviewSessionData?.roomId);
  }, [isConnected, socket, interviewSessionData, joinRoom, leaveRoom]);

  useEffect(() => {
    setInterviewQuestions(interviewSessionData?.interviewQuestions || []);
  }, [interviewSessionData?.interviewQuestions]);

  useEffect(() => {
    if (!canAnswerQuestions || !addEventListener) return;

    const removeAskedQuestionListener = addEventListener('asked-question', (data) => {
      if (!data?.question) return;

      setAskedQuestionData({
        question: data.question,
        difficulty: (data?.difficulty || 'medium').toLowerCase(),
        timestamp: data.timestamp,
      });
      setAnswerAreaVisibility(true);
      toast.info('New interview question received.');
    });

    return () => {
      if (removeAskedQuestionListener) {
        removeAskedQuestionListener();
      }
    };
  }, [canAnswerQuestions, addEventListener]);

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Header - Fixed Height */}
      <div className="h-14 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-30">
        {/* Left: User Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#6A38C2] to-[#5b30a6] flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white text-sm font-semibold">
              {interviewSessionData?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="min-w-0 flex-1 hidden sm:block">
            <h3 className="text-white text-sm font-semibold truncate">
              {interviewSessionData?.email || 'Interview Session'}
            </h3>
            <p className="text-gray-400 text-xs truncate">
              {interviewSessionData?.role === 'candidate' ? 'Candidate' : 'Interviewer'}
            </p>
          </div>
        </div>

        {/* Center: Participant Count & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-white text-sm font-medium">{participants.length}</span>
          </div>

          {/* Layout Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-1">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${layoutMode === 'grid'
                ? 'bg-[#6A38C2] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              title="Grid View"
            >
              <Grid3x3 className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setLayoutMode('speaker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${layoutMode === 'speaker'
                ? 'bg-[#6A38C2] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              title="Speaker View"
            >
              <User className="h-3.5 w-3.5" />
              <span>Speaker</span>
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex items-center justify-center h-8 w-8 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Right: Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/30 ml-3">
          <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
          <span className="text-red-500 text-xs font-semibold hidden sm:inline">LIVE</span>
        </div>
      </div>

      {/* Video Container - Takes all remaining space between header and controls */}
      <div className="flex-1 min-h-0 overflow-hidden bg-[#121212]">
        <div className="h-full w-full p-2 sm:p-3">
          {layoutMode === 'grid' ? (
            <PaginatedGridLayout groupSize={16} />
          ) : (
            <SpeakerLayout participantsBarPosition="bottom" />
          )}
        </div>
      </div>

      {/* Control Bar - Fixed Height */}
      <div className="h-16 bg-gradient-to-r from-[#1a1a1a] to-[#313131] border-t border-gray-800 px-4 sm:px-6 flex items-center justify-start flex-shrink-0  z-30">

        <CustomControls
          onLeave={onLeave}
          chatVisibility={chatVisibility}
          onToggleChat={toggleChatVisibility}
          interviewQuestionsVisibility={interviewQuestionsVisibility}
          onToggleInterviewQuestions={toggleInterviewQuestionsVisibility}
          canViewQuestions={canViewQuestions}
          canAnswerQuestions={canAnswerQuestions}
          answerAreaVisibility={answerAreaVisibility}
          onToggleAnswerArea={toggleAnswerAreaVisibility}
          whiteboardVisibility={whiteboardVisibility}
          onToggleWhiteboard={toggleWhiteboardVisibility}
          codeEditorVisibility={codeEditorVisibility}
          onToggleCodeEditor={toggleCodeEditorVisibility}
          canViewResume={canViewResume}
          resumeVisibility={resumeVisibility}
          onToggleResume={toggleResumeVisibility}
        />

      </div>

      <Chat chatVisibility={chatVisibility} setChatVisibility={setChatVisibility} />
      {canViewQuestions ? (
        interviewQuestionsVisibility && (
          <InterviewQuestions
            interviewQuestions={interviewQuestions}
            interviewQuestionsVisibility={interviewQuestionsVisibility}
            setInterviewQuestionsVisibility={setInterviewQuestionsVisibility}
            roomId={interviewSessionData?.roomId}
          />
        )
      ) : null}
      {whiteboardVisibility && (
        <Whiteboard
          whiteboardVisibility={whiteboardVisibility}
          setWhiteboardVisibility={setWhiteboardVisibility}
        />
      )}

      <CodeEditorPanel
        codeEditorVisibility={codeEditorVisibility}
        setCodeEditorVisibility={setCodeEditorVisibility}
      />

      {canViewResume ? (
        <ResumeViewer
          open={resumeVisibility}
          onOpenChange={setResumeVisibility}
          resumeUrl={interviewSessionData?.resumeUrl}
        />
      ) : null}

      {
        canAnswerQuestions ? (
          answerAreaVisibility && (
            <RecordAnswerArea
              answerAreaVisibility={answerAreaVisibility}
              setAnswerAreaVisibility={setAnswerAreaVisibility}
              askedQuestionData={askedQuestionData}
              interviewId={interviewSessionData?.interviewId}
            />
          )

        ) : null
      }
    </div>
  );
};

export default CallView;

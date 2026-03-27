import React, { useEffect, useMemo, useState } from 'react';
import { X, CircleHelp, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useSocket } from '@/contexts/SocketContext';

const difficultyStyles = {
  easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  medium: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  hard: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
};

const difficultyFilters = ['all', 'easy', 'medium', 'hard'];
const ASKED_QUESTIONS_STORAGE_KEY = 'interview_asked_questions';

function InterviewQuestions({ interviewQuestions = [], setInterviewQuestionsVisibility, roomId }) {
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [hasHydratedAskedQuestions, setHasHydratedAskedQuestions] = useState(false);
  const { sendAskedQuestion } = useSocket();

  const normalizedQuestions = useMemo(() => {
    if (!Array.isArray(interviewQuestions)) return [];

    return interviewQuestions
      .map((item, index) => {
        if (typeof item === 'string') {
          return {
            id: `q-${index}`,
            question: item,
            difficulty: 'medium',
            field: 'General',
          };
        }

        const id = item?._id || item?.id || `q-${index}`;
        const question = item?.question || '';
        const difficulty = (item?.difficulty || 'medium').toLowerCase();
        const field = item?.field || 'General';

        return {
          id,
          question,
          difficulty,
          field,
        };
      })
      .filter((item) => item.question?.trim());
  }, [interviewQuestions]);

  const filteredQuestions = useMemo(() => {
    if (activeDifficulty === 'all') return normalizedQuestions;
    return normalizedQuestions.filter((item) => item.difficulty === activeDifficulty);
  }, [activeDifficulty, normalizedQuestions]);

  useEffect(() => {
    try {
      const savedAskedQuestions = sessionStorage.getItem(ASKED_QUESTIONS_STORAGE_KEY);
      if (!savedAskedQuestions) {
        setAskedQuestions([]);
        setHasHydratedAskedQuestions(true);
        return;
      }

      const parsedAskedQuestions = JSON.parse(savedAskedQuestions);
      if (Array.isArray(parsedAskedQuestions)) {
        setAskedQuestions(parsedAskedQuestions);
      } else {
        setAskedQuestions([]);
      }
    } catch {
      setAskedQuestions([]);
    } finally {
      setHasHydratedAskedQuestions(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedAskedQuestions) return;

    try {
      sessionStorage.setItem(ASKED_QUESTIONS_STORAGE_KEY, JSON.stringify(askedQuestions));
    } catch {
      // Skip persistence if sessionStorage is not available.
    }
  }, [askedQuestions, hasHydratedAskedQuestions]);

  const askQuestion = async (questionId, questionText, difficulty = 'medium') => {
    if (roomId && sendAskedQuestion) {
      const sent = sendAskedQuestion(roomId, questionText, difficulty);
      if (!sent) {
        toast.error('Unable to send asked question right now.');
      }
    }

    try {
      await navigator.clipboard.writeText(questionText);
      toast.success('Question copied. Ask it now.');
    } catch {
      toast.info('Question selected. Clipboard permission unavailable.');
    }

    setAskedQuestions((prev) => (prev.includes(questionId) ? prev : [...prev, questionId]));
  };

  return (
    <div className="fixed right-0 top-0 z-30 h-full w-full sm:w-[24rem] md:w-[28rem] bg-[#111111] shadow-2xl transition-all duration-300 ease-in-out border-l border-white/10 flex flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-[#161616] to-[#1f1f1f] border-b border-white/10">
        <div className="min-w-0">
          <h2 className="text-white font-semibold text-lg truncate">Interview Questions</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {filteredQuestions.length} of {normalizedQuestions.length} prepared question{normalizedQuestions.length === 1 ? '' : 's'}
          </p>
        </div>

        <button
          onClick={() => setInterviewQuestionsVisibility(false)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close questions panel"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="px-3 sm:px-4 py-3 border-b border-white/10 bg-[#101010]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {difficultyFilters.map((difficulty) => {
            const isActive = activeDifficulty === difficulty;

            return (
              <Button
                key={difficulty}
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setActiveDifficulty(difficulty)}
                className={`h-8 px-3 rounded-full text-xs font-semibold capitalize whitespace-nowrap border transition-colors ${
                  isActive
                    ? 'bg-[#6A38C2] border-[#6A38C2] text-white hover:bg-[#5b30a6]'
                    : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {difficulty}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 bg-[#0c0c0c] custom-scrollbar">
        {normalizedQuestions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-5">
            <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <CircleHelp className="h-7 w-7 text-gray-500" />
            </div>
            <p className="text-sm text-gray-300 font-medium">No interview questions available</p>
            <p className="text-xs text-gray-500 mt-1">Questions will appear here once the session data is loaded.</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-5">
            <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <CircleHelp className="h-7 w-7 text-gray-500" />
            </div>
            <p className="text-sm text-gray-300 font-medium">No {activeDifficulty} questions found</p>
            <p className="text-xs text-gray-500 mt-1">Try another difficulty filter.</p>
          </div>
        ) : (
          filteredQuestions.map((item, index) => {
            const isAsked = askedQuestions.includes(item.id);
            const difficultyClass = difficultyStyles[item.difficulty] || difficultyStyles.medium;

            return (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#151515] p-3.5 sm:p-4 shadow-lg shadow-black/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm sm:text-[15px] leading-6 text-gray-100">
                    <span className="text-gray-500 mr-1.5">Q{index + 1}.</span>
                    {item.question}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`capitalize border ${difficultyClass}`}>
                      {item.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-gray-300 capitalize bg-white/[0.03]">
                      {item.field}
                    </Badge>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    disabled={isAsked}
                    onClick={() => askQuestion(item.id, item.question, item.difficulty)}
                    className={`h-8 px-3 text-xs font-semibold ${
                      isAsked
                        ? 'bg-emerald-600 hover:bg-emerald-600 text-white opacity-100 cursor-not-allowed'
                        : 'bg-[#6A38C2] hover:bg-[#5b30a6] text-white'
                    }`}
                  >
                    {isAsked ? (
                      <>
                        <ClipboardCheck className="h-3.5 w-3.5" />
                        Asked
                      </>
                    ) : (
                      'Ask question'
                    )}
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

export default InterviewQuestions;
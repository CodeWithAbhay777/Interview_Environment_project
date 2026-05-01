import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useMutation } from '@tanstack/react-query';
import { X, Mic, MicOff, Send, CircleHelp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { evaluateCandidateAnswer } from '@/api/report/evaluateCandidateAnswer';

const RecordAnswerArea = ({ answerAreaVisibility, setAnswerAreaVisibility, askedQuestionData, interviewId }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const submitAnswerMutation = useMutation({
    mutationFn: evaluateCandidateAnswer,
    onSuccess: async () => {
      const cleanedTranscript = transcript.trim();

      toast.success('Answer submitted successfully.');

      resetTranscript();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit answer. Please try again.');
    },
  });

  const startAnswerRecording = async () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }

    if (isMicrophoneAvailable === false) {
      toast.error('Microphone access is required to record your answer.');
      return;
    }

    try {
      await SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    } catch {
      toast.error('Unable to start recording. Please try again.');
    }
  };

  const stopAnswerRecording = () => {
    SpeechRecognition.stopListening();
    SpeechRecognition.abortListening();
  };

  const submitAnswer = () => {
    const cleanedTranscript = transcript.trim();

    if (!cleanedTranscript) {
      toast.error('Please record your answer before submitting.');
      return;
    }

    if (!askedQuestionData?.question) {
      toast.error('Question is missing. Please wait for the interviewer question.');
      return;
    }

    if (!interviewId) {
      toast.error('Interview session not found. Please rejoin the interview.');
      return;
    }

    submitAnswerMutation.mutate({
      question: askedQuestionData.question,
      candidateAnswer: cleanedTranscript,
      interviewId,
      difficulty: (askedQuestionData?.difficulty || 'medium').toLowerCase(),
    });
  };

  return (
    <div className={`fixed ${answerAreaVisibility ? 'right-0' : '-right-full'} top-0 z-30 h-full w-full sm:w-[24rem] md:w-[28rem] bg-[#101010] border-l border-white/10 shadow-2xl transition-all duration-300 ease-in-out flex flex-col`}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-[#171717] to-[#212121] border-b border-white/10">
        <div className="min-w-0">
          <h2 className="text-white font-semibold text-lg truncate">Record Your Answer</h2>
          <p className="text-xs text-gray-400 mt-0.5">Speak clearly and submit when you are done.</p>
        </div>

        <button
          onClick={() => setAnswerAreaVisibility(false)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close answer area"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 bg-[#0b0b0b] custom-scrollbar">
        <section className="rounded-xl border border-white/10 bg-gradient-to-b from-[#1c1c1c] to-[#151515] p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-white">Asked Question</h3>
            {askedQuestionData?.timestamp ? (
              <Badge variant="outline" className="border-white/20 text-gray-300 bg-white/[0.03]">
                {askedQuestionData.timestamp}
              </Badge>
            ) : null}
          </div>

          {askedQuestionData?.question ? (
            <p className="text-sm text-gray-200 leading-6">{askedQuestionData.question}</p>
          ) : (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <CircleHelp className="h-4 w-4" />
              <span>Waiting for interviewer to ask a question.</span>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-4">
          <h3 className="text-sm font-semibold text-white mb-2">How to use</h3>
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li>1. Click Start Answering to begin recording.</li>
            <li>2. Speak naturally and clearly in one flow.</li>
            <li>3. Click Stop Recording when you finish.</li>
            <li>4. Review transcript and press Submit.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold text-white">Live Transcript</h3>
            <Badge className={`${listening ? 'bg-red-500/15 text-red-300 border-red-500/40' : 'bg-gray-500/15 text-gray-300 border-gray-500/40'} border`}>
              {listening ? 'Recording' : 'Idle'}
            </Badge>
          </div>

          <Textarea
            value={transcript}
            readOnly
            placeholder="Your spoken answer will appear here..."
            className="min-h-[170px] resize-none bg-[#0f0f0f] border-white/10 text-gray-100 placeholder:text-gray-500"
          />

          <div className="mt-2 text-[11px] text-gray-500">
            {transcript.trim() ? `${transcript.trim().split(/\s+/).length} words captured` : 'No transcript captured yet'}
          </div>
        </section>
      </div>

      <div className="p-4 bg-[#111111] border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={startAnswerRecording}
            disabled={listening || !askedQuestionData?.question}
            className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {listening ? 'Listening' : (<><Mic className="h-4 w-4" /> Start Answering</>)}
            
          </Button>

          <Button
            type="button"
            onClick={stopAnswerRecording}
            disabled={!listening}
            className="h-10 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <MicOff className="h-4 w-4" />
            Stop Recording
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={resetTranscript}
            disabled={!transcript.trim()}
            className="h-10 border-white/20 bg-transparent text-gray-200 hover:bg-white/10"
          >
            Clear
          </Button>

          <Button
            type="button"
            onClick={submitAnswer}
            disabled={!transcript.trim() || submitAnswerMutation.isPending}
            className="h-10 bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
          >
            {submitAnswerMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {submitAnswerMutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordAnswerArea;
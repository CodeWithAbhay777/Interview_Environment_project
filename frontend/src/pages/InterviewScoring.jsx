import React, { useMemo, useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'react-router-dom';
import { interviewerEvaluation } from '@/api/report/interviewerEvaluation';
import { validateScoreData } from '@/utils/scoreValidation';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const evaluationCriteria = [
  {
    key: 'problemSolving',
    label: 'Problem Solving',
    hint: 'How well did the candidate break down and solve the question logically?',
  },
  {
    key: 'communication',
    label: 'Communication',
    hint: 'Clarity of explanation, thought process sharing, and responsiveness.',
  },
  {
    key: 'technicalKnowledge',
    label: 'Technical Knowledge',
    hint: 'Depth of understanding of core concepts, tools, and best practices.',
  },
  {
    key: 'confidence',
    label: 'Confidence',
    hint: 'Composure, ownership, and confidence while answering under pressure.',
  },
  {
    key: 'overallImpression',
    label: 'Overall Impression',
    hint: 'Your final judgment considering all aspects of the interview.',
  },
];

const InterviewScoring = () => {

  const params = useParams();
  const navigate = useNavigate();
  const [scores, setScores] = useState({
    problemSolving: 0,
    communication: 0,
    technicalKnowledge: 0,
    confidence: 0,
    overallImpression: 0,
  });
  const [recommendation, setRecommendation] = useState('');

  const totalScore = useMemo(() => {
    return Object.values(scores).reduce((sum, current) => sum + current, 0);
  }, [scores]);

  const maxScore = evaluationCriteria.length * 10;
  const scorePercent = Math.round((totalScore / maxScore) * 100);

  const interviewerEvaluationMutation = useMutation({
    mutationFn: interviewerEvaluation,
    onSuccess: () => {
      toast.success('Evaluation submitted successfully');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || 'Submission failed. Please try again.');
    },
  });

  const onSelectScore = (criterionKey, value) => {
    setScores((prev) => ({
      ...prev,
      [criterionKey]: value,
    }));
  };

  const onSubmitEvaluation = async (event) => {
    event.preventDefault();

    const payload = {
      scores,
      recommendation,
      totalScore,
      maxScore,
      percentage: scorePercent,
      interviewId: params.interviewId,
    };

    const validated = validateScoreData(payload);
    if (!validated.isValid) {
      toast(`Validation Error: ${validated.message}`);
      return;
    }

    console.log('Interview evaluation draft:', payload);

    interviewerEvaluationMutation.mutate(payload);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(114,9,183,0.12),_transparent_38%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-5xl">
        <Card className="border-slate-200 shadow-xl shadow-violet-100/40">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge className="bg-violet-100 text-[#7209b7] hover:bg-violet-100">Interview Scoring</Badge>
              <div className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-[#7209b7] sm:text-sm">
                Total: {totalScore}/{maxScore} ({scorePercent}%)
              </div>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Candidate Performance Evaluation
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Rate each criterion using the stars from 0 to 10. Keep scoring consistent across candidates.
              Add final recommendation notes at the end for hiring decision context.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmitEvaluation} className="space-y-6">
              {evaluationCriteria.map((criterion, index) => (
                <section key={criterion.key} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 sm:text-lg">{criterion.label}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">{criterion.hint}</p>
                    </div>
                    <Badge variant="outline" className="border-slate-300 text-slate-700">
                      Score: {scores[criterion.key]}/10
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {Array.from({ length: 10 }, (_, starIndex) => {
                      const value = starIndex + 1;
                      const selected = value <= scores[criterion.key];

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => onSelectScore(criterion.key, value)}
                          className={`group inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-all sm:h-10 sm:w-10 ${selected
                              ? 'border-violet-300 bg-violet-100 text-[#7209b7]'
                              : 'border-slate-200 bg-white text-slate-400 hover:border-violet-200 hover:bg-violet-50 hover:text-[#7209b7]'
                            }`}
                          aria-label={`Set ${criterion.label} score to ${value}`}
                          title={`Score ${value}/10`}
                        >
                          <Star className={`h-4 w-4 sm:h-5 sm:w-5 ${selected ? 'fill-current' : ''}`} />
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>

                  {index !== evaluationCriteria.length - 1 ? <Separator className="mt-4" /> : null}
                </section>
              ))}

              <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <label htmlFor="recommendation" className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <CheckCircle2 className="h-4 w-4 text-[#7209b7]" />
                  Recommendation Notes
                </label>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Add strengths, concerns, and your final recommendation.
                </p>
                <Textarea
                  id="recommendation"
                  value={recommendation}
                  onChange={(event) => setRecommendation(event.target.value)}
                  placeholder="Example: Strong technical depth and communication. Recommended for next round."
                  className="mt-3 min-h-28 resize-y border-slate-300 focus-visible:ring-[#7209b7]"
                />
              </section>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button type="button" variant="outline" className="border-slate-300 text-slate-700">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#7209b7] hover:bg-[#5f0899]" disabled={interviewerEvaluationMutation.isPending}>
                  {interviewerEvaluationMutation.isPending ? 'Submitting...' : 'Submit Evaluation'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default InterviewScoring
import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const ResumeViewer = ({ open, onOpenChange, resumeUrl }) => {
  const normalizedResumeUrl = typeof resumeUrl === 'string'
    ? resumeUrl.trim().replace(/^http:\/\//i, 'https://')
    : '';
  const hasResume = Boolean(normalizedResumeUrl);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-l border-slate-700 bg-[#0f1115] p-0 text-white sm:w-[42rem] sm:max-w-none lg:w-[52rem]"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <SheetTitle className="text-left text-base text-white">Candidate Resume</SheetTitle>
                <SheetDescription className="text-left text-xs text-slate-400">
                  Review candidate profile during the interview.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 p-2 sm:p-3">
            {!hasResume ? (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 bg-[#161a22] px-4 text-center">
                <p className="text-sm font-semibold text-slate-200">Resume is unavailable</p>
                <p className="mt-1 text-xs text-slate-400">
                  No resume URL was found for this candidate.
                </p>
              </div>
            ) : (
              <div className="flex h-full min-h-0 flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#171b24] px-3 py-1.5">
                  <Badge className="bg-violet-600 hover:bg-violet-600">Resume Preview</Badge>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 border-slate-600 bg-transparent text-xs text-slate-200 hover:bg-slate-800 hover:text-white"
                    onClick={() => window.open(normalizedResumeUrl, '_blank', 'noopener,noreferrer')}
                  >
                    Open in new tab
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <iframe
                    title="Candidate resume"
                    src={normalizedResumeUrl}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ResumeViewer;

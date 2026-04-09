import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-[#7209b7]">
                <BriefcaseBusiness className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-extrabold text-slate-900">Jobify.AI</h2>
            </div>
            <p className="mt-1 text-sm text-slate-600">AI-powered interviews and structured hiring workflows.</p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <Link to="/jobs" className="transition-colors hover:text-[#7209b7]">Jobs</Link>
            <Link to="/about" className="transition-colors hover:text-[#7209b7]">About</Link>
            <Link to="/profile" className="transition-colors hover:text-[#7209b7]">Profile</Link>
            <Link to="/notifications" className="transition-colors hover:text-[#7209b7]">Notifications</Link>
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> support@jobify.ai</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Recruitment Operations</span>
          </div>
          <p>© 2026 Jobify.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
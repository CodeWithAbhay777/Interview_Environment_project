import React from 'react'

import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from '@/components/ui/carousel'

import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCheck,
  CalendarClock,
  CircleCheckBig,
  FileText,
  MessageSquareQuote,
  MoveRight,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'

const Home = () => {
  
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  const primaryActionLabel = user ? 'Browse Jobs' : 'Get Started';

  const featureCards = [
    {
      title: 'AI Interview Engine',
      description:
        'Run structured technical interviews with AI-powered evaluations and fair scoring across candidates.',
      icon: Bot,
    },
    {
      title: 'Smart Hiring Workflow',
      description:
        'Manage openings, applications, interviews, and reports in one clean workspace built for speed.',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Clear Evaluation Reports',
      description:
        'Generate actionable interview insights that help recruiters decide faster and candidates improve.',
      icon: FileText,
    },
  ];

  const processSteps = [
    {
      title: 'Post & Match Roles',
      detail: 'Publish openings and attract candidates aligned with job requirements.',
      icon: Users,
    },
    {
      title: 'Schedule Interviews',
      detail: 'Set up interviews with simple workflows and automated communication.',
      icon: CalendarClock,
    },
    {
      title: 'Evaluate with AI',
      detail: 'Measure candidate performance consistently using AI-assisted scoring.',
      icon: Bot,
    },
    {
      title: 'Hire with Confidence',
      detail: 'Use detailed reports and insights to make faster, data-backed hiring decisions.',
      icon: ShieldCheck,
    },
  ];

  const valueTracks = [
    {
      title: 'For Candidates',
      points: [
        'Practice with structured interview flows',
        'Receive clear, actionable evaluation feedback',
        'Track upcoming interviews in one place',
      ],
      image:
        'https://plus.unsplash.com/premium_photo-1684769160411-ab16f414d1bc?fm=jpg&q=60&w=1600&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJ2aWV3fGVufDB8fDB8fHww',
      icon: Target,
    },
    {
      title: 'For Recruiters',
      points: [
        'Schedule and manage interviews efficiently',
        'Compare candidates with consistent AI-backed scoring',
        'Share structured reports with hiring stakeholders',
      ],
      image:
        'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1600&q=80',
      icon: Shield,
    },
  ];

  const testimonials = [
    {
      quote:
        'The interview workflow is simple and reliable. Our team now evaluates candidates with much more clarity.',
      role: 'Talent Acquisition Team',
      org: 'Partner Organization',
    },
    {
      quote:
        'Candidates appreciate the transparent process, and recruiters save time with structured reports.',
      role: 'Hiring Operations',
      org: 'Internal Recruitment Unit',
    },
  ];
  
  return (
    <div className='bg-slate-50 text-slate-900'>
      <section className='relative overflow-hidden border-b border-slate-200'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(114,9,183,0.2),_transparent_60%),radial-gradient(circle_at_20%_80%,_rgba(14,116,144,0.15),_transparent_45%)]' />
        <div className='relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24'>
          <Badge className='mb-5 rounded-full border border-violet-200 bg-violet-100 px-4 py-1 text-violet-800 hover:bg-violet-100'>
            Professional AI-Powered Hiring Platform
          </Badge>

          <div className='grid items-center gap-10 lg:grid-cols-2'>
            <div>
              <h1 className='text-balance text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl'>
                Hire Better Talent With Structured AI Interviews
              </h1>
              <p className='mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg'>
                Jobify.AI helps teams post jobs, interview candidates, and evaluate performance using
                intelligent workflows. Candidates get a transparent process, recruiters get better hiring
                outcomes.
              </p>

              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <Button
                  onClick={() => navigate('/jobs')}
                  className='h-11 bg-[#7209b7] px-6 text-sm font-semibold hover:bg-[#5f0899]'
                >
                  {primaryActionLabel}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
                <Button
                  onClick={() => navigate('/candidate/upcoming-interviews')}
                  variant='outline'
                  className='h-11 border-slate-300 px-6 text-sm font-semibold text-slate-700 hover:bg-slate-100'
                >
                  View Interview Flow
                </Button>
              </div>

              <div className='mt-8 flex flex-wrap gap-5 text-sm text-slate-600'>
                <div className='flex items-center gap-2'>
                  <CircleCheckBig className='h-4 w-4 text-[#7209b7]' />
                  AI-based interview assessments
                </div>
                <div className='flex items-center gap-2'>
                  <CircleCheckBig className='h-4 w-4 text-[#7209b7]' />
                  Real-time interview scheduling
                </div>
                <div className='flex items-center gap-2'>
                  <CircleCheckBig className='h-4 w-4 text-[#7209b7]' />
                  Recruiter-ready performance reports
                </div>
              </div>
            </div>

            <div className='relative'>
              <div className='absolute -inset-8 -z-10 rounded-[2rem] bg-gradient-to-r from-violet-300/20 via-fuchsia-300/15 to-cyan-300/20 blur-2xl' />
              <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl'>
                <div className='relative h-64 sm:h-72'>
                  <img
                    src='https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1650&q=80'
                    alt='Team collaborating during recruitment workflow'
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/15 to-transparent' />
                  <div className='absolute bottom-4 left-4 right-4 rounded-xl border border-white/30 bg-white/15 p-4 backdrop-blur'>
                    <p className='text-xs font-semibold uppercase tracking-wider text-violet-100'>Structured Hiring Experience</p>
                    <p className='mt-1 text-sm font-medium text-white'>From job posting to final report, everything stays organized and transparent.</p>
                  </div>
                </div>
                <div className='grid gap-3 p-4 sm:grid-cols-2 sm:p-5'>
                  <div className='rounded-xl border border-slate-100 bg-slate-50 p-3'>
                    <p className='text-sm font-semibold text-slate-900'>AI-guided interviews</p>
                    <p className='mt-1 text-xs text-slate-600'>Consistent interview structure for fair candidate evaluation.</p>
                  </div>
                  <div className='rounded-xl border border-slate-100 bg-slate-50 p-3'>
                    <p className='text-sm font-semibold text-slate-900'>Role-based workflows</p>
                    <p className='mt-1 text-xs text-slate-600'>Built for candidate, recruiter, and admin collaboration.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8'>
        <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-wide text-[#7209b7]'>Platform Highlights</p>
            <h2 className='mt-2 text-2xl font-black text-slate-900 sm:text-3xl'>Built for candidates and recruiters</h2>
          </div>
          <p className='max-w-md text-sm text-slate-600'>
            A focused hiring stack to discover opportunities, run technical interviews, and make better
            decisions with confidence.
          </p>
        </div>

        <div className='grid gap-5 md:grid-cols-3'>
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className='group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-[#7209b7]'>
                  <Icon className='h-5 w-5' />
                </div>
                <h3 className='text-lg font-bold text-slate-900'>{feature.title}</h3>
                <p className='mt-2 text-sm leading-relaxed text-slate-600'>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className='border-y border-slate-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8'>
          <div className='mb-8 flex items-center gap-3'>
            <div className='h-8 w-1 rounded-full bg-[#7209b7]' />
            <h2 className='text-2xl font-black text-slate-900 sm:text-3xl'>How Jobify.AI Works</h2>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {processSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.title} className='rounded-2xl border border-slate-200 bg-slate-50 p-5'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Step {index + 1}</p>
                  <div className='mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#7209b7] shadow-sm'>
                    <StepIcon className='h-5 w-5' />
                  </div>
                  <h3 className='mt-4 text-base font-bold text-slate-900'>{step.title}</h3>
                  <p className='mt-2 text-sm leading-relaxed text-slate-600'>{step.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8'>
        <div className='mb-8 flex items-center gap-3'>
          <Sparkles className='h-5 w-5 text-[#7209b7]' />
          <h2 className='text-2xl font-black text-slate-900 sm:text-3xl'>Designed for both sides of hiring</h2>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          {valueTracks.map((track) => {
            const TrackIcon = track.icon;
            return (
              <div key={track.title} className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                <div className='h-52 overflow-hidden'>
                  <img
                    src={track.image}
                    alt={track.title}
                    className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
                  />
                </div>
                <div className='p-6'>
                  <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-[#7209b7]'>
                    <TrackIcon className='h-5 w-5' />
                  </div>
                  <h3 className='text-xl font-bold text-slate-900'>{track.title}</h3>
                  <div className='mt-4 space-y-2'>
                    {track.points.map((point) => (
                      <div key={point} className='flex items-start gap-2 text-sm text-slate-600'>
                        <CheckCheck className='mt-0.5 h-4 w-4 shrink-0 text-[#7209b7]' />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className='border-y border-slate-200 bg-white'>
        <div className='mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8'>
          <div className='relative overflow-hidden rounded-2xl border border-slate-200'>
            <img
              src='https://plus.unsplash.com/premium_photo-1684769160411-ab16f414d1bc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJ2aWV3fGVufDB8fDB8fHww'
              alt='Candidate interview preparation'
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent' />
            <p className='absolute bottom-4 left-4 text-sm font-semibold text-white'>Candidate preparation with clear outcomes</p>
          </div>

          <div>
            <p className='text-sm font-semibold uppercase tracking-wide text-[#7209b7]'>Why organizations choose this platform</p>
            <h2 className='mt-2 text-2xl font-black text-slate-900 sm:text-3xl'>Simple, reliable, and context-driven hiring</h2>
            <p className='mt-4 text-sm leading-relaxed text-slate-600'>
              Jobify.AI focuses on practical hiring operations, not dashboard noise. Every section supports real recruiter and candidate workflows, so your team can run interviews professionally and efficiently.
            </p>

            <div className='mt-6 space-y-4'>
              <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm font-bold text-slate-900'>Clear role context</p>
                <p className='mt-1 text-sm text-slate-600'>Job descriptions, interview setup, and evaluation stay aligned to role expectations.</p>
              </div>
              <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm font-bold text-slate-900'>Professional communication</p>
                <p className='mt-1 text-sm text-slate-600'>Candidates and interviewers receive timely, structured updates throughout the process.</p>
              </div>
              <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm font-bold text-slate-900'>Actionable evaluations</p>
                <p className='mt-1 text-sm text-slate-600'>Reports are easy to review and immediately useful for final decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8'>
        <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h2 className='text-2xl font-black text-slate-900 sm:text-3xl'>Explore Opportunities by Category</h2>
          <p className='text-sm text-slate-600'>Discover roles that match your goals and interview readiness.</p>
        </div>
        <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
          <CategoryCarousel />
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='mb-6 flex items-center gap-3'>
          <MessageSquareQuote className='h-5 w-5 text-[#7209b7]' />
          <h2 className='text-2xl font-black text-slate-900 sm:text-3xl'>What teams appreciate most</h2>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          {testimonials.map((item, index) => (
            <div
              key={item.role}
              className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
            >
              <p className='text-base leading-relaxed text-slate-700'>“{item.quote}”</p>
              <div className='mt-5 flex items-center justify-between'>
                <div>
                  <p className='text-sm font-bold text-slate-900'>{item.role}</p>
                  <p className='text-xs text-slate-500'>{item.org}</p>
                </div>
                <Badge variant='outline' className='border-violet-200 text-[#7209b7]'>
                  Review {index + 1}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='px-4 pb-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-[#7209b7] via-[#8a2ad0] to-[#4f46e5] px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-12'>
          <div className='flex flex-col items-start justify-between gap-6 md:flex-row md:items-center'>
            <div>
              <p className='text-sm font-semibold uppercase tracking-wide text-violet-100'>Ready to get started?</p>
              <h2 className='mt-2 text-2xl font-black leading-tight sm:text-3xl'>
                Build your next hiring success story with Jobify.AI
              </h2>
            </div>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button
                onClick={() => navigate('/jobs')}
                className='h-11 bg-white px-6 text-sm font-bold text-[#7209b7] hover:bg-violet-50'
              >
                Explore Jobs
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
              <Button
                onClick={() => navigate('/candidate/upcoming-interviews')}
                variant='outline'
                className='h-11 border-white/70 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10'
              >
                Interview Timeline
                <MoveRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

const category = [
  "Frontend Developer",
  "Backend Developer",
  "FullStack Developer",
  "Software Developer"
];

const CategoryCarousel = () => {
 
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    
    navigate("/jobs");
  };

  return (
    <section className="py-16 px-6 md:px-12 lg:px-24 bg-violet-50">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          Explore Popular Job Categories
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
          Quickly jump into interviews tailored to your preferred career path.
          Select a category below to get started!
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto relative">
        <Carousel className="w-full">
          <CarouselContent>
            {category.map((cat, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 px-2">
                <Button
                  onClick={() => searchJobHandler(cat)}
                  variant="outline"
                  className="rounded-full w-full py-3 text-sm md:text-base font-semibold hover:bg-violet-200 transition"
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-violet-600 hover:text-violet-800" />
          <CarouselNext className="text-violet-600 hover:text-violet-800" />
        </Carousel>
      </div>
    </section>
  );
};


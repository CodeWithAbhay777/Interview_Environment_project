import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle,
  Globe,
  Lightbulb,
  Shield,
  Users,
  Zap,
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const missionValues = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Leveraging AI to make hiring smarter, fairer, and more transparent for everyone.',
    },
    {
      icon: Shield,
      title: 'Fairness',
      description: 'Consistent evaluation criteria that eliminate bias and ensure equal opportunities.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Building tools that bring candidates and recruiters together in meaningful ways.',
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'Streamlined workflows that save time without compromising quality or insight.',
    },
  ];

  const achievements = [
    {
      number: '100%',
      label: 'AI-Powered Evaluations',
      description: 'Consistent, data-driven interview assessments',
    },
    {
      number: '24/7',
      label: 'Scheduling Support',
      description: 'Automated interview coordination anytime',
    },
    {
      number: '10+',
      label: 'Tech Skills Assessed',
      description: 'Multiple domains and expertise areas',
    },
    {
      number: '∞',
      label: 'Scalability',
      description: 'Built to grow with your hiring needs',
    },
  ];

  const features = [
    {
      icon: Bot,
      title: 'AI Interview Engine',
      description:
        'Structured technical interviews with intelligent question curation, real-time evaluation, and fair scoring across all candidates.',
      points: ['Adaptive questioning', 'Real-time scoring', 'Quality assurance'],
    },
    {
      icon: BriefcaseBusiness,
      title: 'Smart Hiring Workflow',
      description:
        'Complete hiring stack from job posting to final decision, designed for collaboration between candidates and recruiters.',
      points: ['Job management', 'Interview scheduling', 'Candidate tracking'],
    },
    {
      icon: Shield,
      title: 'Clear Evaluation Reports',
      description:
        'Actionable performance insights that help recruiters make confident decisions and candidates understand their strengths.',
      points: ['Performance metrics', 'Skill breakdown', 'Improvement feedback'],
    },
  ];

  const timeline = [
    {
      phase: '2024 Q1',
      title: 'Platform Launch',
      description: 'Jobify.AI launches with core AI interview and scheduling capabilities.',
    },
    {
      phase: '2024 Q2',
      title: 'Enhanced Evaluation',
      description: 'Advanced AI models for multi-dimensional candidate assessment.',
    },
    {
      phase: '2024 Q3',
      title: 'Recruiter Tools',
      description: 'Comprehensive reporting and candidate management features.',
    },
    {
      phase: '2024 Q4',
      title: 'Community Growth',
      description: 'Expanding platform adoption among enterprises and startups.',
    },
  ];

  return (
    <div className="bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(114,9,183,0.15),_transparent_60%),radial-gradient(circle_at_10%_50%,_rgba(14,116,144,0.1),_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-6 text-center">
            <Badge className="border border-violet-200 bg-violet-50 px-4 py-1.5 text-[#7209b7] hover:bg-violet-50">
              About Jobify.AI
            </Badge>
          </div>

          <h1 className="mx-auto max-w-3xl text-center text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Reimagining how teams hire with{' '}
            <span className="text-[#7209b7]">AI-powered fairness</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-slate-600">
            Jobify.AI is a modern hiring platform that combines structured interviews, intelligent evaluation, and
            transparent workflows. We believe great hiring should be fair, efficient, and insightful for everyone
            involved.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#7209b7]">Our Foundation</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Mission & Core Values
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            We're building tools that make hiring transparent, fair, and data-driven for candidates and recruiters alike.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {missionValues.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-[#7209b7]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#7209b7]">What We Offer</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              Comprehensive Hiring Solution
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-slate-200 shadow-sm bg-white">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-[#7209b7]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                    <ul className="mt-4 space-y-2">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="h-4 w-4 text-[#7209b7] flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#7209b7]">By The Numbers</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Platform Capabilities
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement) => (
            <Card key={achievement.label} className="border-slate-200 shadow-sm bg-gradient-to-br from-violet-50 to-indigo-50">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-black text-[#7209b7]">{achievement.number}</p>
                <p className="mt-2 text-sm font-bold text-slate-900">{achievement.label}</p>
                <p className="mt-2 text-xs text-slate-600">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#7209b7]">Our Journey</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              Product Roadmap
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((item, index) => (
              <div key={item.phase} className="relative">
                {/* Timeline line */}
                {index < timeline.length - 1 && (
                  <div className="absolute top-12 left-full hidden w-full border-t-2 border-dashed border-slate-200 lg:block" />
                )}

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#7209b7]">{item.phase}</p>
                    <h3 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>

                    <div className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-[#7209b7] text-sm font-bold">
                      {index + 1}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Candidates & Recruiters */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#7209b7]">Platform Benefits</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              Built for Everyone
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* For Candidates */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-violet-100 to-indigo-100 flex items-center justify-center">
                <Users className="h-24 w-24 text-violet-200" />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900">For Candidates</h3>
                <p className="mt-3 text-slate-600">
                  Get access to meaningful interview opportunities with transparent evaluation processes and actionable
                  feedback.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7209b7] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Practice with structured interview flows</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7209b7] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Receive detailed performance feedback</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7209b7] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Track all your upcoming interviews</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7209b7] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Fair, unbiased evaluation process</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* For Recruiters */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center">
                <BriefcaseBusiness className="h-24 w-24 text-indigo-200" />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900">For Recruiters</h3>
                <p className="mt-3 text-slate-600">
                  Manage your entire hiring cycle efficiently with AI-powered evaluations and data-driven insights.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7209b7] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Schedule and manage interviews easily</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7209b7] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Compare candidates with consistent scoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7209b7] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Generate actionable evaluation reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7209b7] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Make faster, confident hiring decisions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#7209b7]">Why Jobify.AI</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            What Sets Us Apart
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-900">AI-Driven Fairness</h3>
              <p className="mt-3 text-slate-600">
                Our AI models are trained to evaluate candidates consistently, reducing human bias from the hiring
                process while maintaining the human touch where it matters most.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-900">Complete Transparency</h3>
              <p className="mt-3 text-slate-600">
                Every step of the hiring process is visible and understandable to candidates, building trust and
                improving the overall candidate experience.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-900">Real-Time Insights</h3>
              <p className="mt-3 text-slate-600">
                Instant feedback during the interview process and comprehensive reports after help both candidates and
                recruiters make better decisions quickly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-900">Scalable Infrastructure</h3>
              <p className="mt-3 text-slate-600">
                Whether you're managing 10 or 10,000 interviews, our platform scales seamlessly without compromising
                quality or performance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 bg-gradient-to-r from-[#7209b7] via-[#8a2ad0] to-[#4f46e5]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
            Ready to Experience Better Hiring?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
            Join teams that are transforming their hiring process with fair, intelligent, and transparent workflows.
          </p>

          <div className="mt-8 flex flex-col gap-3 justify-center sm:flex-row">
            <Button
              onClick={() => navigate('/jobs')}
              className="h-11 bg-white px-8 text-sm font-bold text-[#7209b7] hover:bg-violet-50"
            >
              Explore Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate('/candidate/upcoming-interviews')}
              variant="outline"
              className="h-11 border-white/70 bg-transparent px-8 text-sm font-semibold text-white hover:bg-white/10"
            >
              View Interviews
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-2">
            <Globe className="h-4 w-4 text-[#7209b7]" />
            <p className="text-sm text-slate-700">
              Jobify.AI is built by a team passionate about reimagining modern hiring practices.
            </p>
          </div>
          <p className="mt-6 text-xs text-slate-500">© 2024 Jobify.AI. All rights reserved. | Designed for fairness, built for impact.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
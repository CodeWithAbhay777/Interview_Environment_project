import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProfileQuery } from '@/hooks/queries/useGetProfileQuery';

const toTitle = (value = '') => {
  if (!value) return 'User';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const safeList = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const Profile = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  const { data: profile, isLoading, isError, error, refetch } = useGetProfileQuery(
    user?._id,
    user?.role,
    {
      enabled: isAuthenticated && Boolean(user?._id) && Boolean(user?.role),
    }
  );

  const role = user?.role || 'user';
  const isCandidate = role === 'candidate';

  const fullName =
    profile?.fullname || user?.fullname || user?.username || (user?.email ? user.email.split('@')[0] : 'User');

  const profilePhoto = profile?.profilePhoto || '';
  const bio = profile?.bio || 'No bio added yet.';
  const phone = profile?.phone || 'Not added';
  const address = profile?.address || 'Not added';

  const skills = safeList(profile?.skills);
  const expertiseAreas = safeList(profile?.expertiseAreas);
  const chips = isCandidate ? skills : expertiseAreas;

  const links = [
    {
      label: 'LinkedIn',
      url: profile?.linkedInProfile,
    },
    {
      label: 'GitHub',
      url: isCandidate ? profile?.githubProfile : '',
    },
    {
      label: 'Resume',
      url: isCandidate ? profile?.resume : '',
    },
  ].filter((item) => item.url);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-20 w-full mb-6" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="py-12 text-center">
              <p className="text-lg font-semibold text-slate-900">Unable to load profile</p>
              <p className="text-slate-600 mt-2">{error?.message || 'Something went wrong while fetching profile.'}</p>
              <Button className="mt-6 bg-[#7209b7] hover:bg-[#5f0899]" onClick={() => refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        {/* Header Card */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardContent className="p-6 md:p-8">
            {/* Top Row: Avatar and Info */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex gap-4 flex-1 min-w-0">
                <Avatar className="h-24 w-24 md:h-28 md:w-28 flex-shrink-0 border-2 border-violet-200 shadow-sm">
                  <AvatarImage src={profilePhoto} alt={fullName} />
                  <AvatarFallback className="bg-[#7209b7] text-white text-2xl font-semibold">
                    {(fullName || 'U').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 pt-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 truncate">{fullName}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className="bg-[#7209b7] hover:bg-[#5f0899] text-white font-medium">
                      {toTitle(role)}
                    </Badge>
                    {profile?.designation && !isCandidate && (
                      <span className="text-slate-600 text-sm font-medium">{profile.designation}</span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm md:text-base mt-3 line-clamp-2">{bio}</p>
                </div>
              </div>

              {/* Right: Edit and Links */}
              <div className="flex flex-col gap-3 md:items-end">
                <Button
                  className="bg-[#7209b7] hover:bg-[#5f0899] text-white w-full md:w-auto"
                  onClick={() => toast.info('Edit profile coming soon')}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>

                {/* Social Icons */}
                {links.length > 0 && (
                  <div className="flex gap-2">
                    {links.map((item) => {
                      let Icon;
                      if (item.label === 'LinkedIn') Icon = Linkedin;
                      else if (item.label === 'GitHub') Icon = Github;
                      else if (item.label === 'Resume') Icon = Download;

                      return (
                        <a
                          key={item.label}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#7209b7] hover:text-white transition-all duration-200"
                          title={item.label}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 my-6"></div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="text-slate-700 break-all">{user?.email || 'Not added'}</p>
                </div>
              </div>

              {phone !== 'Not added' && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Phone</p>
                    <p className="text-slate-700">{phone}</p>
                  </div>
                </div>
              )}

              {address !== 'Not added' && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Address</p>
                    <p className="text-slate-700">{address}</p>
                  </div>
                </div>
              )}

              {isCandidate && profile?.college && (
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">College</p>
                    <p className="text-slate-700">{profile.college}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experience and Expertise Card */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-[#7209b7]">
                  {isCandidate ? profile?.experience ?? 0 : profile?.totalExperience ?? 0}
                </p>
                <p className="text-sm text-slate-600 mt-2 font-medium">
                  {isCandidate ? 'Years Experience' : 'Years Experience'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-[#7209b7]">{chips.length}</p>
                <p className="text-sm text-slate-600 mt-2 font-medium">
                  {isCandidate ? 'Skills' : 'Expertise Areas'}
                </p>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <p className="text-sm md:text-lg font-bold text-slate-700 truncate">
                  {isCandidate ? 'Candidate' : profile?.designation || 'N/A'}
                </p>
                <p className="text-sm text-slate-600 mt-2 font-medium">Profile Type</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Card */}
        {chips.length > 0 && (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                {isCandidate ? 'Skills' : 'Expertise Areas'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {chips.map((item, index) => (
                  <Badge
                    key={`${item}-${index}`}
                    className="bg-[#7209b7]/10 text-[#7209b7] border-[#7209b7]/20 font-semibold text-sm"
                    variant="outline"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;

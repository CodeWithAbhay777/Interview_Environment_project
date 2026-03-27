import { useCallStateHooks, VideoPreview } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
    Video, 
    Mic, 
    MicOff, 
    VideoOff, 
    Wifi, 
    Shield, 
    Clock,
    AlertCircle,
    CheckCircle2,
    Settings,
    User,
    Monitor
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';

const Lobby = ({onJoin}) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();
    const { camera, isMuted: isCameraMuted, status: cameraStatus } = useCameraState();
    const { microphone, isMuted: isMicMuted, status: micStatus } = useMicrophoneState();
    const [isReady, setIsReady] = useState(false);

    console.log('Camera Muted:', isCameraMuted, 'Camera Status:', cameraStatus);
    console.log('Mic Muted:', isMicMuted, 'Mic Status:', micStatus);

    useEffect(() => {
        camera.enable();
        microphone.enable();
    }, [camera, microphone]);

    useEffect(() => {
        // Check if user is ready (camera and mic enabled)
        setIsReady(cameraStatus === 'enabled' && micStatus === 'enabled');
    }, [cameraStatus, micStatus]);

    const guidelines = [
        {
            icon: <Video className="h-5 w-5 text-[#6A38C2]" />,
            title: "Camera Required",
            description: "Keep your camera on throughout the interview for verification purposes."
        },
        {
            icon: <Wifi className="h-5 w-5 text-[#6A38C2]" />,
            title: "Stable Internet",
            description: "Ensure you have a strong and stable internet connection (minimum 2 Mbps)."
        },
        {
            icon: <Shield className="h-5 w-5 text-[#6A38C2]" />,
            title: "No Cheating",
            description: "Any form of malpractice or external assistance is strictly prohibited and monitored."
        },
        {
            icon: <Monitor className="h-5 w-5 text-[#6A38C2]" />,
            title: "Quiet Environment",
            description: "Choose a quiet, well-lit space with minimal background noise and distractions."
        },
        {
            icon: <Clock className="h-5 w-5 text-[#6A38C2]" />,
            title: "Be Punctual",
            description: "Join on time. Late entries may not be permitted after 10 minutes."
        },
        {
            icon: <Settings className="h-5 w-5 text-[#6A38C2]" />,
            title: "Test Your Setup",
            description: "Verify your camera and microphone are working properly before joining."
        }
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-6 lg:p-8 overflow-x-hidden'>
            <div className='max-w-7xl mx-auto w-full'>
                {/* Header */}
                <div className='text-center mb-4 md:mb-6'>
                    <div className='flex items-center justify-center flex-wrap gap-2 mb-3 px-2'>
                        <div className='flex items-center space-x-1.5 px-2.5 py-1.5 bg-purple-100 rounded-full'>
                            <Video className='h-3.5 w-3.5 text-[#6A38C2]' />
                            <span className='text-xs font-semibold text-[#6A38C2]'>Live Session</span>
                        </div>
                        <div className='flex items-center space-x-1.5 px-2.5 py-1.5 bg-green-50 rounded-full'>
                            <div className='h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse'></div>
                            <span className='text-xs text-green-700 font-medium'>Ready</span>
                        </div>
                        <div className='flex items-center space-x-1.5 px-2.5 py-1.5 bg-gray-100 rounded-full'>
                            <Shield className='h-3.5 w-3.5 text-[#6A38C2]' />
                            <span className='text-xs text-gray-600 font-medium'>Secure</span>
                        </div>
                    </div>
                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] bg-clip-text text-transparent mb-2 px-2'>
                        Interview Lobby
                    </h1>
                    <p className='text-xs md:text-sm text-gray-500 max-w-xl mx-auto px-4'>
                        Review guidelines and test your setup before joining the interview
                    </p>
                </div>

                <div className='grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full'>
                    {/* Left Column - Video Preview */}
                    <div className='lg:col-span-2 w-full min-w-0 space-y-4'>
                        {/* Video Preview Card */}
                        <Card className='border-0 shadow-xl flex flex-col w-full'>
                            <CardHeader className='bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] text-white rounded-t-lg'>
                                <CardTitle className='flex items-center space-x-2 text-lg md:text-xl'>
                                    <User className="h-5 w-5 md:h-6 md:w-6" />
                                    <span>Video Preview</span>
                                </CardTitle>
                                <CardDescription className='text-gray-100 text-xs md:text-sm'>
                                    Check your camera and audio before joining
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='p-3 md:p-4 lg:p-6 flex-1 flex flex-col pb-3'>
                                {/* Video Preview Container */}
                                <div className='relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-3 md:mb-4 w-full'>
                                    <VideoPreview className='w-full h-full object-cover' />
                                    
                                    {/* Status Badges */}
                                    <div className='absolute top-4 left-4 flex flex-col space-y-2'>
                                        <Badge 
                                            variant="secondary" 
                                            className={`${
                                                cameraStatus === 'enabled' 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-red-500 text-white'
                                            } flex items-center space-x-1 w-fit`}
                                        >
                                            {cameraStatus === 'enabled' ? (
                                                <><Video className="h-3 w-3" /> <span>Camera On</span></>
                                            ) : (
                                                <><VideoOff className="h-3 w-3" /> <span>Camera Off</span></>
                                            )}
                                        </Badge>
                                        <Badge 
                                            variant="secondary" 
                                            className={`${
                                                micStatus === 'enabled' 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-red-500 text-white'
                                            } flex items-center space-x-1 w-fit`}
                                        >
                                            {micStatus === 'enabled' ? (
                                                <><Mic className="h-3 w-3" /> <span>Mic On</span></>
                                            ) : (
                                                <><MicOff className="h-3 w-3" /> <span>Mic Off</span></>
                                            )}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className='flex flex-col sm:flex-row gap-2 md:gap-3 mb-3 md:mb-4 w-full'>
                                    <Button 
                                        onClick={() => camera.toggle()}
                                        variant={cameraStatus === 'enabled' ? 'default' : 'destructive'}
                                        className={`flex-1 ${
                                            cameraStatus === 'enabled' 
                                                ? 'bg-[#6A38C2] hover:bg-[#5b30a6]' 
                                                : ''
                                        }`}
                                    >
                                        {cameraStatus === 'enabled' ? (
                                            <><Video className="h-4 w-4 mr-2" /> Turn Off Camera</>
                                        ) : (
                                            <><VideoOff className="h-4 w-4 mr-2" /> Turn On Camera</>
                                        )}
                                    </Button>
                                    <Button 
                                        onClick={() => microphone.toggle()}
                                        variant={micStatus === 'enabled' ? 'default' : 'destructive'}
                                        className={`flex-1 ${
                                            micStatus === 'enabled' 
                                                ? 'bg-[#6A38C2] hover:bg-[#5b30a6]' 
                                                : ''
                                        }`}
                                    >
                                        {micStatus === 'enabled' ? (
                                            <><Mic className="h-4 w-4 mr-2" /> Mute Microphone</>
                                        ) : (
                                            <><MicOff className="h-4 w-4 mr-2" /> Unmute Microphone</>
                                        )}
                                    </Button>
                                </div>

                                {/* Setup Checklist */}
                                <div className='bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border border-gray-200 w-full'>
                                    <h3 className='text-sm font-semibold text-gray-900 mb-3 flex items-center'>
                                        <Settings className='h-4 w-4 mr-2 text-[#6A38C2]' />
                                        Pre-Interview Checklist
                                    </h3>
                                    <div className='space-y-2'>
                                        <div className='flex items-center space-x-3'>
                                            <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                                                cameraStatus === 'enabled' ? 'bg-green-500' : 'bg-gray-300'
                                            }`}>
                                                {cameraStatus === 'enabled' ? (
                                                    <CheckCircle2 className='h-3 w-3 text-white' />
                                                ) : (
                                                    <div className='h-2 w-2 bg-white rounded-full' />
                                                )}
                                            </div>
                                            <span className={`text-sm ${
                                                cameraStatus === 'enabled' ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                                Camera enabled and working
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-3'>
                                            <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                                                micStatus === 'enabled' ? 'bg-green-500' : 'bg-gray-300'
                                            }`}>
                                                {micStatus === 'enabled' ? (
                                                    <CheckCircle2 className='h-3 w-3 text-white' />
                                                ) : (
                                                    <div className='h-2 w-2 bg-white rounded-full' />
                                                )}
                                            </div>
                                            <span className={`text-sm ${
                                                micStatus === 'enabled' ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                                Microphone enabled and working
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-3'>
                                            <div className='flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center bg-gray-300'>
                                                <Wifi className='h-3 w-3 text-gray-600' />
                                            </div>
                                            <span className='text-sm text-gray-500'>
                                                Stable internet connection
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-3'>
                                            <div className='flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center bg-gray-300'>
                                                <Monitor className='h-3 w-3 text-gray-600' />
                                            </div>
                                            <span className='text-sm text-gray-500'>
                                                Quiet, well-lit environment
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ready Status */}
                                <div className='w-full'>
                                    {!isReady && (
                                        <Alert className="w-full border-amber-200 bg-amber-50">
                                            <AlertCircle className="h-4 w-4 text-amber-600" />
                                            <AlertDescription className="text-amber-800 text-xs md:text-sm">
                                                Please enable both camera and microphone to proceed
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    
                                    {isReady && (
                                        <Alert className="w-full border-green-200 bg-green-50">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <AlertDescription className="text-green-800 text-xs md:text-sm">
                                                You're all set! Ready to join the interview
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Join Button - Mobile */}
                        <div className='lg:hidden w-full'>
                            <Button 
                                onClick={onJoin} 
                                // disabled={!isReady}
                                className='w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white py-5 md:py-6 text-base md:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                            >
                                {isReady ? 'Join Interview Now' : 'Complete Setup to Join'}
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Guidelines */}
                    <div className='flex flex-col gap-4 md:gap-6 w-full min-w-0'>
                        {/* Guidelines Card */}
                        <Card className='border-0 shadow-xl flex-1 flex flex-col w-full'>
                            <CardHeader className='bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] text-white rounded-t-lg'>
                                <CardTitle className='text-base md:text-lg lg:text-xl'>Interview Guidelines</CardTitle>
                                <CardDescription className='text-gray-100 text-xs md:text-sm'>
                                    Please read carefully before proceeding
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4 flex-1'>
                                {guidelines.map((guideline, index) => (
                                    <div key={index}>
                                        <div className='flex items-start space-x-3'>
                                            <div className='flex-shrink-0 mt-0.5'>
                                                {guideline.icon}
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <h4 className='font-semibold text-gray-900 text-sm mb-1'>
                                                    {guideline.title}
                                                </h4>
                                                <p className='text-xs text-gray-600 leading-relaxed'>
                                                    {guideline.description}
                                                </p>
                                            </div>
                                        </div>
                                        {index < guidelines.length - 1 && (
                                            <Separator className='mt-3 md:mt-4' />
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Important Notice */}
                        <Card className='border-0 shadow-xl bg-red-50 border-red-200 w-full'>
                            <CardContent className='p-3 md:p-4 lg:p-6'>
                                <div className='flex items-start space-x-3'>
                                    <AlertCircle className='h-5 w-5 text-red-600 flex-shrink-0 mt-0.5' />
                                    <div>
                                        <h4 className='font-semibold text-red-900 mb-2 text-sm'>
                                            Important Notice
                                        </h4>
                                        <p className='text-xs text-red-800 leading-relaxed'>
                                            This interview session is monitored and recorded. Any violation of guidelines may result in disqualification. Ensure you maintain professional conduct throughout.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Join Button - Desktop */}
                        <div className='hidden lg:block w-full'>
                            <Button 
                                onClick={onJoin} 
                                // disabled={!isReady}
                                className='w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                            >
                                {isReady ? 'Join Interview Now' : 'Complete Setup to Join'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Lobby
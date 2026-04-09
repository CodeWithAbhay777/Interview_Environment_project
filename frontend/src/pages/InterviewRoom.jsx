import { endInterview } from '@/api/interview/endInterview';
import CallView from '@/components/InterviewRoom/CallView';
import Lobby from '@/components/InterviewRoom/Lobby';
import { SocketProvider } from '@/contexts/SocketContext';
import { setInterviewSessionData } from '@/redux/interviewSessionDataSlice';
import { StreamCall, StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import axios from 'axios';
import { set } from 'date-fns/set';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';

const InterviewRoom = () => {

    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [inCall, setInCall] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { interviewSessionData } = useSelector((state) => state.interviewSession);


    useEffect(() => {

        const init = async () => {
            try {
                // Use a local variable to hold the session data
                let sessionData = interviewSessionData;

                if (!sessionData) {
                    const storedData = sessionStorage.getItem('sessionData');
                    if (!storedData) {
                        toast.error('No interview session data found');
                        navigate('/');
                        return;
                    } else {
                        sessionData = JSON.parse(storedData);
                        dispatch(setInterviewSessionData({ sessionData }));
                        console.log("Interview Session Data:", sessionData);
                    }
                }

                // Check if token exists, if not, you need to get it from backend
                if (!sessionData.token) {
                    toast.error('Authentication token is missing. Please rejoin the interview.');
                    navigate('/');
                    return;
                }



                const vc = new StreamVideoClient({
                    apiKey: import.meta.env.VITE_STREAM_VIDEO_API_KEY,
                    user: {
                        id: sessionData.id,
                        name: sessionData.username || sessionData.email,
                        image: `https://getstream.io/random_png/?name=${sessionData.email || sessionData.id}`,
                    },
                    tokenProvider: sessionData.token,
                });

                setClient(vc);
                const c = vc.call('default', sessionData.roomId);
                await c.getOrCreate();
                setCall(c);

            } catch (error) {
                // Check if it's a token expiration error
                if (error.message && (error.message.includes('expired') || error.message.includes('401'))) {
                    toast.error('Your session has expired. Please rejoin the interview.');
                    // Clear expired session data
                    sessionStorage.removeItem('sessionData');
                    navigate('/');
                } else {
                    toast.error('Error initializing video call client');
                    console.error('Error initializing video call client', error);
                }
            }
        }
        init();


        return () => {
            if (client) {
                client.disconnectUser().catch(err => console.error('Error disconnecting:', err));
            }
        };
    }, []);

    const join = async () => {
        try {
            await call.join();
            setInCall(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const leave = async () => {

        const confirmLeave = window.confirm("Are you sure you want to end the interview?");

        if (!confirmLeave) {
            return; // User cancelled the action
        }

        if (interviewSessionData.role === 'candidate') {

            await call.leave();
            setInCall(false);
            navigate('/');

        } else {

            try {

                const response = await endInterview(interviewSessionData.interviewId);

                if (!response.success) {
                    toast.error('Failed to end interview.');
                    console.log(response);
                    return;
                }

                toast.success('Interview ended successfully.');
                await call.leave();
                setInCall(false);
                navigate(`/interview-scoring/${interviewSessionData.interviewId}`);




            } catch (error) {
                console.log(error);
                toast.error('Error leaving the call. Please try again.');
            }

        }



    };


    if (error) return <div className='p-20 text-red'>Error: {error}</div>;
    if (!client || !call) return <div className='p-20'>Loading...</div>;


    return (
        <SocketProvider user={interviewSessionData}>
            <StreamVideo client={client}>
                <StreamCall call={call}>

                    <div>
                        {
                            !inCall ? <Lobby onJoin={join} /> : <CallView onLeave={leave} />
                        }
                    </div>

                </StreamCall>
            </StreamVideo>

        </SocketProvider>
    )
}

export default InterviewRoom
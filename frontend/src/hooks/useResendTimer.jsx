import { useEffect , useState } from "react";

export default function useResendTimer() {
    const [timeLeft, setTimeLeft] = useState(0); 
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    useEffect(() => {

        if (timeLeft <= 0) {
            setIsResendDisabled(false);
            return;
        }
        
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                console.log(`Time left: ${timeLeft} seconds`);
            }, 1000);
            
       

        return () => clearTimeout(timer);
    }, [timeLeft]);

    const handleResend = (timerDuration) => {
        setTimeLeft(timerDuration);
        setIsResendDisabled(true);
    };

    return { timeLeft, isResendDisabled, handleResend };
}
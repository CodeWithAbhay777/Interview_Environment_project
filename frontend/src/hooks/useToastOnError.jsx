import { useEffect } from 'react'
import { toast } from 'sonner'


export const useToastOnError = (error , message = "Something went wrong") => {
    useEffect(() => {

        if (!error) return;
        
        toast.error(message);
     
    },[error]);
}



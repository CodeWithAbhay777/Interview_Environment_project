import { useEffect } from 'react'
import { toast } from 'sonner'


export const useToastOnError = (isError , message = "Something went wrong") => {
    useEffect(() => {
        if (isError) toast.error(message);
     
    },[isError]);
}
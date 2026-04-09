import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const EndInterviewProtectedRoute = ({ children }) => {

  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {

    if (!isAuthenticated || !user) {
      //delete sessiondata if any in session storage
      sessionStorage.removeItem('sessionData');
      toast.info("Not Authenticated : Login first");
      navigate("/login");
    }

   

    if (user?.role !== "recruiter" && user?.role !== "admin") {
      
      toast.error("Unauthorized : Only Interviewers are allowed to access this page");
      navigate("/");
    }

  }, []);



  return children;
}

export default EndInterviewProtectedRoute;
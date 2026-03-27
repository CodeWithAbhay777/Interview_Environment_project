import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const InterviewProtectedRoute = ({children}) => {

const { user, isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    //delete sessiondata if any in session storage
    sessionStorage.removeItem('sessionData');
    toast.info("Not Authenticated : Login first");
    navigate("/login");
  }

  if (!user?.isProfileComplete){
    sessionStorage.removeItem('sessionData');
    toast.info('Create profile first to move further');
    //Move to prfile completion pg
    if (user?.role === "candidate") navigate("/candidate-profile-form");
    else if (user?.role === "recruiter" || user?.role === "admin") navigate("/recruiter-profile-form");
    else navigate("/login");
  }

  if (!user?.isEmailVerified){
    sessionStorage.removeItem('sessionData');
    toast.info('Verify your email first to move further');
    // move to verificatin pg
    if (user?.role === "candidate") navigate("/candidate-profile-form");
    else if (user?.role === "recruiter" || user?.role === "admin") navigate("/recruiter-profile-form");
    else navigate("/login");
  }


  return children;
    
 
}

export default InterviewProtectedRoute
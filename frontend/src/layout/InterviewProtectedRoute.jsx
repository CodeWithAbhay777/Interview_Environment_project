import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { navigateWithToast } from "@/lib/navigationToast";

const InterviewProtectedRoute = ({ children }) => {

  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const role = user?.role;
  const isUnauthenticated = !isAuthenticated || !user;
  const isProfileIncomplete = !isUnauthenticated && !user?.isProfileComplete;
  const isEmailUnverified = !isUnauthenticated && !user?.isEmailVerified;

  const getProfileRouteByRole = (currentRole) => {
    if (currentRole === "candidate") return "/candidate-profile-form";
    if (currentRole === "recruiter" || currentRole === "admin") return "/recruiter-profile-form";
    return "/login";
  };

  useEffect(() => {
    if (isUnauthenticated) {
      // Delete any interview session data before redirecting.
      sessionStorage.removeItem('sessionData');
      navigateWithToast(navigate, "/login", {
        type: "info",
        message: "Not Authenticated : Login first",
        id: "interview-auth-required",
      });
      return;
    }

    if (isProfileIncomplete) {
      sessionStorage.removeItem('sessionData');
      navigateWithToast(navigate, getProfileRouteByRole(role), {
        type: 'info',
        message: 'Create profile first to move further',
        id: 'interview-profile-required',
      });
      return;
    }

    if (isEmailUnverified) {
      sessionStorage.removeItem('sessionData');
      navigateWithToast(navigate, getProfileRouteByRole(role), {
        type: 'info',
        message: 'Verify your email first to move further',
        id: 'interview-email-required',
      });
    }

    return undefined;

  }, [isUnauthenticated, isProfileIncomplete, isEmailUnverified, role, navigate]);

  if (isUnauthenticated || isProfileIncomplete || isEmailUnverified) {
    return null;
  }

  return children;


}

export default InterviewProtectedRoute
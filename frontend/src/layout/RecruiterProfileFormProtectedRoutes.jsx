import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { navigateWithToast } from "@/lib/navigationToast";

const RecruiterProfileFormProtectedRoutes = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const isUnauthenticated = !isAuthenticated || !user;
  const isUnauthorizedRole = !isUnauthenticated && user?.role !== "recruiter" && user?.role !== "admin";
  const isProfileAlreadyCompleted = !isUnauthenticated && user?.isEmailVerified && user?.isProfileComplete;

  useEffect(() => {
    if (isUnauthenticated) {
      navigateWithToast(navigate, "/login", {
        type: "info",
        message: "Not Authenticated : Login first",
        id: "recruiter-profile-form-auth-required",
      });
      return;
    }

    if (isUnauthorizedRole) {
      navigateWithToast(navigate, "/", {
        type: "error",
        message: "Unauthorized : Only Recruiters are allowed to access this page",
        id: "recruiter-profile-form-unauthorized",
      });
      return;
    }

    if (isProfileAlreadyCompleted) {
      navigateWithToast(navigate, "/profile", {
        type: "info",
        message: "Profile already exists : Redirecting to profile page",
        id: "recruiter-profile-exists-redirect",
      });
      return;

    }

  }, [isUnauthenticated, isUnauthorizedRole, isProfileAlreadyCompleted, navigate]);

  if (isUnauthenticated || isUnauthorizedRole || isProfileAlreadyCompleted) {
    return null;
  }

  return children;
};

export default RecruiterProfileFormProtectedRoutes;



import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { navigateWithToast } from "@/lib/navigationToast";

const CandidateProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const isUnauthenticated = !isAuthenticated || !user;
  const role = user?.role;
  const isUnauthorizedRole = !isUnauthenticated && role !== "candidate";

  useEffect(() => {
    if (isUnauthenticated) {
      navigateWithToast(navigate, "/login", {
        type: "info",
        message: "Not Authenticated : Login first",
        id: "candidate-protected-auth-required",
      });
      return;
    }

    if (isUnauthorizedRole) {
      navigateWithToast(navigate, "/", {
        type: "error",
        message: "Unauthorized : Only Candidates are allowed to access this page",
        id: "candidate-protected-unauthorized",
      });
      return;
    }

  }, [isUnauthenticated, isUnauthorizedRole, navigate]);

  if (isUnauthenticated || isUnauthorizedRole) {
    return null;
  }

  return children;
};

export default CandidateProtectedRoute;
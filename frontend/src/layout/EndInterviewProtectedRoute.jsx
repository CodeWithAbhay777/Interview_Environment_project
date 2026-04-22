import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { navigateWithToast } from '@/lib/navigationToast';

const EndInterviewProtectedRoute = ({ children }) => {

  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const isUnauthenticated = !isAuthenticated || !user;
  const isUnauthorizedRole = !isUnauthenticated && user?.role !== 'recruiter' && user?.role !== 'admin';

  useEffect(() => {
    if (isUnauthenticated) {
      // Delete any interview session data before redirecting.
      sessionStorage.removeItem('sessionData');
      navigateWithToast(navigate, '/login', {
        type: 'info',
        message: 'Not Authenticated : Login first',
        id: 'end-interview-auth-required',
      });
      return;
    }

    if (isUnauthorizedRole) {
      navigateWithToast(navigate, '/', {
        type: 'error',
        message: 'Unauthorized : Only Interviewers are allowed to access this page',
        id: 'end-interview-unauthorized-role',
      });
      return;
    }

    return undefined;

  }, [isUnauthenticated, isUnauthorizedRole, navigate]);

  if (isUnauthenticated) {
    return null;
  }

  if (isUnauthorizedRole) {
    return null;
  }

  return children;
}

export default EndInterviewProtectedRoute;
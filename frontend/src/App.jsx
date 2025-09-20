import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import JobDescription from "./pages/JobDescription";
import Companies from "./pages/Companies";
import CompanyCreate from "./pages/CompanyCreate";
import CompanySetup from "./pages/CompanySetup";
import AdminJobs from "./pages/AdminJobs";
import PostJob from "./pages/PostJob";
import Applicants from "./pages/Applicants";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import JobApplicationForm from "./components/JobApplicationForm";
import Mainlayout from "./layout/Mainlayout";
import Verification from "./pages/Verification";
import CandidateProfileForm from "./pages/CandidateProfileForm";
import RecruiterProfileForm from "./pages/RecruiterProfileForm";
import AdminDashboardLayout from "./layout/AdminDashboardLayout";
import DashboardJobs from "./components/admin/DashboardJobs";
import ProtectedRouteLayout from "./layout/ProtectedRouteLayout";
import CreateJobsForm from "./components/admin/CreateJobsForm";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "verification",
        element: <Verification />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path : "/jobs/:id",
        element : <JobDescription />
      },
      
      {
        path: "browse",
        element: <Browse />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "candidate-profile-form",
        element: <CandidateProfileForm />,
      },
      {
        path: "recruiter-profile-form",
        element: <RecruiterProfileForm />,
      },
      {
        path: "apply",
        element: <JobApplicationForm />,
      },
      // admin ke liye yha se start hoga

      {
        path: "admin/companies",
        element: (
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/companies/create",
        element: (
          <ProtectedRoute>
            <CompanyCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/companies/:id",
        element: (
          <ProtectedRoute>
            <CompanySetup />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/jobs",
        element: (
          <ProtectedRoute>
            <AdminJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/jobs/create",
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/jobs/:id/applicants",
        element: (
          <ProtectedRoute>
            <Applicants />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ADMIN ROUTES
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRouteLayout>
        <AdminDashboardLayout />
      </ProtectedRouteLayout>
    ),
    children: [
      {
        path: "jobs",
        element: <DashboardJobs />,
      },
      {
        path : "jobs/create",
        element: <CreateJobsForm />
      }
    ],
  },
]);
function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;

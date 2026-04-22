import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import JobDescription from "./pages/JobDescription";
import NotFound from "./pages/NotFound";
import Mainlayout from "./layout/Mainlayout";
import CandidateProfileForm from "./pages/CandidateProfileForm";
import RecruiterProfileForm from "./pages/RecruiterProfileForm";
import AdminDashboardLayout from "./layout/AdminDashboardLayout";
import DashboardJobs from "./components/admin/DashboardJobs";
import ProtectedRouteLayout from "./layout/ProtectedRouteLayout";
import CreateJobsForm from "./components/admin/CreateJobsForm";
import ManageJob from "./components/admin/ManageJob";
import ManageInterviewsOfJob from "./components/admin/ManageInterviewsOfJob";
import DashboardInterviews from "./components/admin/DashboardInterviews";
import DashboardFeedback from "./components/admin/DashboardFeedback";
import CandidateUpcomingInterviews from "./pages/CandidateUpcomingInterviews";
import RecruiterUpcomingInterviews from "./pages/RecruiterUpcomingInterviews";
import InterviewProtectedRoute from "./layout/InterviewProtectedRoute";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewScoring from "./pages/InterviewScoring";
import EndInterviewProtectedRoute from "./layout/EndInterviewProtectedRoute";
import CandidateResults from "./pages/CandidateResults";
import CandidateReportDetail from "./pages/CandidateReportDetail";
import About from "./pages/About";
import AdminProtectedRoutes from "./layout/AdminProtectedRoutes";
import CandidateProfileFormProtectedRoutes from "./layout/CandidateProfileFormProtectedRoutes";
import RecruiterProfileFormProtectedRoutes from "./layout/RecruiterProfileFormProtectedRoutes";
import CandidateProtectedRoute from "./layout/CandidateProtectedRoute";
import RecruiterProtectedRoute from "./layout/RecruiterProtectedRoute";
import RouteErrorFallback from "./components/shared/RouteErrorFallback";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: "/",
        element: <Home />,
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
        path: "/jobs/:id",

        element: (
          <ProtectedRouteLayout>
            <JobDescription />
          </ProtectedRouteLayout>

        )
      },

      {
        path: "about",
        element: <About />
      },

      {
        path: "candidate/upcoming-interviews",
        element: (
          <ProtectedRouteLayout>
            <CandidateProtectedRoute>
              <CandidateUpcomingInterviews />
            </CandidateProtectedRoute>
          </ProtectedRouteLayout>

        ),
      },
      {
        path: "candidate/results",
        element: (
          <ProtectedRouteLayout>
            <CandidateProtectedRoute>
              <CandidateResults />
            </CandidateProtectedRoute>
          </ProtectedRouteLayout>

        ),
      },
      {
        path: "candidate/results/:reportId",
        element: (
          <ProtectedRouteLayout>
            <CandidateProtectedRoute>
              <CandidateReportDetail />
            </CandidateProtectedRoute>
          </ProtectedRouteLayout>

        ),
      },
      {
        path: "recruiter/upcoming-interviews",
        element: (
          <ProtectedRouteLayout>
            <RecruiterProtectedRoute>
              <RecruiterUpcomingInterviews />
            </RecruiterProtectedRoute>
          </ProtectedRouteLayout>

        ),
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "candidate-profile-form",
        element: (
        <CandidateProfileFormProtectedRoutes>
          <CandidateProfileForm />
        </CandidateProfileFormProtectedRoutes>
        ),
      },
      {
        path: "recruiter-profile-form",
        element: (
        <RecruiterProfileFormProtectedRoutes>
          <RecruiterProfileForm />
        </RecruiterProfileFormProtectedRoutes>
        ),
      },

    ],
  },

  {
    path: "interview/room",
    errorElement: <RouteErrorFallback />,
    element: (
      <InterviewProtectedRoute>
        <InterviewRoom />
      </InterviewProtectedRoute>
    ),
  },

  {
    path: "interview-scoring/:interviewId",
    errorElement: <RouteErrorFallback />,
    element: (
      <EndInterviewProtectedRoute>
        <InterviewScoring />
      </EndInterviewProtectedRoute>
    )
  },

  // ADMIN ROUTES
  {
    path: "/admin/dashboard",
    errorElement: <RouteErrorFallback />,
    element: (
      <ProtectedRouteLayout>
        <AdminProtectedRoutes>
          <AdminDashboardLayout />
        </AdminProtectedRoutes>
      </ProtectedRouteLayout>
    ),
    children: [
      {
        path: "jobs",
        element: <DashboardJobs />,
      },
      {
        path: "jobs/create",
        element: <CreateJobsForm />
      },
      {
        path: "jobs/:id",
        element: <ManageJob />,
      },
      {
        path: "jobs/:id/interviews",
        element: <ManageInterviewsOfJob />
      },
      // interviews
      {
        path: "interviews",
        element: <DashboardInterviews />

      }
      // feedback
      ,
      {
        path: "feedbacks",
        element: <DashboardFeedback />
      }
    ],
  },

  // 404 Not Found Route
  {
    path: "*",
    element: <NotFound />,
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

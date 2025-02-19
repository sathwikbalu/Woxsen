import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { MoodTracker } from "./components/MoodTracker";
import { MeditationList } from "./components/meditation/MeditationList";
import { BreathingExercise } from "./components/breathing/BreathingExercise";
import { GratitudeJournal } from "./components/gratitude/GratitudeJournal";
import { GoalTracker } from "./components/goals/GoalTracker";
import { DailyCheckin } from "./components/DailyCheckin";
import { BubblePop } from "./components/games/BubblePop";
import { UserManagement } from "./components/admin/UserManagement";
import { CommunityPage } from "./components/community/CommunityPage";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { PhotoCapture } from "./components/PhotoCapture";
import { AiChat } from "./components/AiChat";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { YogaPage } from "./components/yoga/YogaPage";
import { StoryGenerator } from "./components/StoryGenerator";
import { ProfessionalChat } from "./components/chat/ProfessionalChat";
// import {GoogleFitConnect} from './components/GoogleFitConnect';
// import {HealthDashboard} from './components/healthDashboard';

const PrivateRoute = ({
  children,
  requiresProfessional = false,
}: {
  children: React.ReactNode;
  requiresProfessional?: boolean;
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiresProfessional && user?.role !== "professional") {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {isAuthenticated && <Navbar />}
      <div className={isAuthenticated ? "pt-16" : ""}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/mood"
            element={
              <PrivateRoute>
                <MoodTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/meditate"
            element={
              <PrivateRoute>
                <MeditationList />
              </PrivateRoute>
            }
          />
          <Route
            path="/breathing"
            element={
              <PrivateRoute>
                <BreathingExercise
                  duration={300}
                  inhaleTime={4}
                  holdTime={4}
                  exhaleTime={4}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/gratitude"
            element={
              <PrivateRoute>
                <GratitudeJournal />
              </PrivateRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <PrivateRoute>
                <GoalTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkin"
            element={
              <PrivateRoute>
                <DailyCheckin />
              </PrivateRoute>
            }
          />
          <Route
            path="/community"
            element={
              <PrivateRoute>
                <CommunityPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/photo"
            element={
              <PrivateRoute>
                <PhotoCapture />
              </PrivateRoute>
            }
          />
          <Route
            path="/yoga"
            element={
              <PrivateRoute>
                <YogaPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-chat"
            element={
              <PrivateRoute>
                <AiChat />
              </PrivateRoute>
            }
          />
          <Route
            path="/story"
            element={
              <PrivateRoute>
                <StoryGenerator />
              </PrivateRoute>
            }
          />
          <Route
            path="/Pchat"
            element={
              <PrivateRoute>
                <ProfessionalChat />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/fitauth"
            element={
              <PrivateRoute>
                <GoogleFitConnect/>
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            path="/fit"
            element={
              <PrivateRoute>
                <HealthDashboard/>
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/games/bubble-pop"
            element={
              <PrivateRoute>
                <BubblePop />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute requiresProfessional>
                <UserManagement />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

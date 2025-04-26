import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProfileUser from './pages/ProfileUser';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import VideoPlayerPage from './pages/VideoPlayerPage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import MyCourses from './pages/MyCourses';
import TeachingPage from './pages/TeachingPage';
import CourseManagementPage from './pages/CourseManagementPage';

// Protected route wrapper
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

//  component layout riêng biệt
function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isVideoPlayerPage = location.pathname.includes('/courses/') && location.pathname.includes('/lessons/');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && !isVideoPlayerPage && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/profileuser" element={
            <ProtectedRoute>
              <ProfileUser />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={
            <ProtectedRoute>
              <VideoPlayerPage />
            </ProtectedRoute>
          } />
          <Route path="/my-courses" element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          } />
          <Route path="/teaching" element={
            <ProtectedRoute>
              <TeachingPage />
            </ProtectedRoute>
          } />
          <Route path="/teaching/courses/:courseId" element={
            <ProtectedRoute>
              <CourseManagementPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isAuthPage && !isVideoPlayerPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
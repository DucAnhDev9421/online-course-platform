import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfileUser from './pages/ProfileUser';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import VideoPlayerPage from './pages/VideoPlayerPage';


// Tạo một component layout riêng biệt
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
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/profileuser" element={<ProfileUser />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<VideoPlayerPage />} />
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
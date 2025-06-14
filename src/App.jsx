import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Header from './components/AppLayout/Header';
import Footer from './components/AppLayout/Footer';
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
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import AdminLayout from './layouts/AdminLayout';
import NotFound from './pages/NotFound';
import TokenPage from './pages/TokenPage';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './contexts/UserContext';
import AdminCourseDetail from './pages/AdminCourseDetail';
import UserManagement from './pages/admin/UserManagement';
import InstructorManagement from './pages/admin/InstructorManagement';
import SlideManagement from './pages/admin/SlideManagement';
import CouponManagement from './pages/admin/CouponManagement';
import BecomeInstructor from './pages/BecomeInstructor';

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

// component layout riêng biệt
function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isVideoPlayerPage = location.pathname.includes('/courses/') && location.pathname.includes('/lessons/');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isTeachingPage = location.pathname.startsWith('/teaching');
  const isNotFoundPage = !['/', '/login', '/register', '/profileuser', '/courses', '/my-courses', '/admin', '/token', '/favorites', '/cart'].some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && !isVideoPlayerPage && !isAdminPage && !isTeachingPage && !isNotFoundPage && <Header />}
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
          <Route path="/token" element={
            <ProtectedRoute>
              <TokenPage />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/become-instructor" element={<BecomeInstructor />} />
          {/* Admin routes lồng layout */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/:id" element={<AdminCourseDetail />} />
            <Route path="courses/categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/students" element={<UserManagement />} />
            <Route path="users/instructors" element={<InstructorManagement />} />
            <Route path="slides" element={<SlideManagement />} />
            <Route path="coupons" element={<CouponManagement />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && !isVideoPlayerPage && !isAdminPage && !isTeachingPage && !isNotFoundPage && <Footer />}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
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
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}
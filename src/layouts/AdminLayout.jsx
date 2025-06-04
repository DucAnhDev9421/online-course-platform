import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/admin.css';
import { useUser } from "@clerk/clerk-react";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openCourses, setOpenCourses] = useState(true);
  const [openUsers, setOpenUsers] = useState(true);
  const location = useLocation();
  const { user } = useUser();

  const isCoursesActive = location.pathname.startsWith('/admin/courses');
  const isUsersActive = location.pathname.startsWith('/admin/users');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'} shadow-lg relative`}>
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold text-white ${!isSidebarOpen && 'hidden'} hover:underline focus:outline-none`}>
            Academy
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="sidebar-toggle-btn text-white hover:bg-white/10 p-2 rounded-lg transition-all"
          >
            <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>
        <nav className="mt-4">
          <Link to="/admin/dashboard" className={`nav-link flex items-center px-4 py-2 text-white hover:bg-white/10 ${location.pathname === '/admin/dashboard' ? 'font-bold bg-white/10' : ''}`}>
            <i className="fas fa-home mr-3"></i>
            <span className={!isSidebarOpen && 'hidden'}>Dashboard</span>
          </Link>

          <div>
            <button
              className={`nav-link flex items-center px-4 py-2 w-full text-left text-white hover:bg-white/10 ${isCoursesActive ? 'font-bold bg-white/10' : ''}`}
              onClick={() => setOpenCourses(!openCourses)}
            >
              <i className="fas fa-book mr-3"></i>
              <span className={!isSidebarOpen && 'hidden'}>Khóa học</span>
              <i className={`fas ml-auto transition-transform ${openCourses ? 'fa-chevron-down' : 'fa-chevron-right'} ${!isSidebarOpen && 'hidden'}`}></i>
            </button>
            {openCourses && isSidebarOpen && (
              <div className="ml-8">
                <Link
                  to="/admin/courses"
                  className={`nav-link flex items-center px-4 py-2 text-white hover:bg-white/10 ${location.pathname === '/admin/courses' ? 'font-bold bg-white/20' : ''}`}
                >
                  <span>Quản lý khóa học</span>
                </Link>
                <Link
                  to="/admin/courses/categories"
                  className={`nav-link flex items-center px-4 py-2 text-white hover:bg-white/10 ${location.pathname === '/admin/courses/categories' ? 'font-bold bg-white/20' : ''}`}
                >
                  <span>Quản lý danh mục</span>
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              className={`nav-link flex items-center px-4 py-2 w-full text-left text-white hover:bg-white/10 ${isUsersActive ? 'font-bold bg-white/10' : ''}`}
              onClick={() => setOpenUsers(!openUsers)}
            >
              <i className="fas fa-users mr-3"></i>
              <span className={!isSidebarOpen && 'hidden'}>Người dùng</span>
              <i className={`fas ml-auto transition-transform ${openUsers ? 'fa-chevron-down' : 'fa-chevron-right'} ${!isSidebarOpen && 'hidden'}`}></i>
            </button>
            {openUsers && isSidebarOpen && (
              <div className="ml-8">
                <Link
                  to="/admin/users/students"
                  className={`nav-link flex items-center px-4 py-2 text-white hover:bg-white/10 ${location.pathname === '/admin/users/students' ? 'font-bold bg-white/20' : ''}`}
                >
                  <span>User</span>
                </Link>
                <Link
                  to="/admin/users/instructors"
                  className={`nav-link flex items-center px-4 py-2 text-white hover:bg-white/10 ${location.pathname === '/admin/users/instructors' ? 'font-bold bg-white/20' : ''}`}
                >
                  <span>Instructor</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/admin/coupons" className="nav-link flex items-center px-4 py-2 text-white hover:bg-white/10">
            <i className="fas fa-ticket-alt mr-3"></i>
            <span className={!isSidebarOpen && 'hidden'}>Quản lý coupon</span>
          </Link>
          <Link to="/admin/slides" className="nav-link flex items-center px-4 py-2 text-white hover:bg-white/10">
            <i className="fas fa-images mr-3"></i>
            <span className={!isSidebarOpen && 'hidden'}>Quản lý Slide</span>
          </Link>
        </nav>
      </div>
      {/* Main Content */}
      <div className={`admin-content flex-1 ${isSidebarOpen ? 'expanded' : 'collapsed'} overflow-auto`}>
        {/* Top Navigation */}
        <header className="admin-header">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="sidebar-toggle text-gray-500 hover:text-gray-700 admin-button"
              >
                <i className="fas fa-bars"></i>
              </button>
              <h1 className="text-xl font-semibold gradient-text">Dashboard</h1>
            </div>
            {/* Search Bar */}
            <div className="flex-1 flex justify-center px-4">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  className="admin-input pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tìm kiếm..."
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="notification-button relative admin-button">
                <i className="fas fa-bell text-gray-500 hover:text-gray-700"></i>
                <span className="notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              {user && (
                <div className="relative">
                  <button className="flex items-center text-gray-500 hover:text-gray-700 admin-button">
                    <img
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500"
                      src={user.imageUrl || user.image_url}
                      alt="User avatar"
                    />
                    <span className="ml-2">{user.firstName || user.first_name}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 
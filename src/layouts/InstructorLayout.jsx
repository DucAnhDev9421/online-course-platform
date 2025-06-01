import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function InstructorLayout({ sidebarTab, setSidebarTab, children }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-200 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl border-r-0 flex flex-col py-6 px-4 fixed inset-y-0 left-0 z-20 ${sidebarOpen ? 'w-64' : 'w-20'} overflow-hidden`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="mb-8 flex items-center justify-center">
          <span className="text-2xl font-bold text-white tracking-widest drop-shadow">Academy</span>
        </div>
        <nav className={`flex-1 space-y-2 ${sidebarOpen ? '' : 'flex flex-col items-center'}`}>
          <button
            className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-2 rounded-lg text-left transition-colors ${
              sidebarTab === 'performance'
                ? 'bg-purple-700/80 text-white font-semibold shadow'
                : 'text-gray-200 hover:bg-gray-700/80'
            }`}
            onClick={() => setSidebarTab('performance')}
            title="Hiệu suất"
          >
            <i className="fas fa-chart-line mr-3"></i>
            {sidebarOpen && 'Hiệu suất'}
          </button>
          <button
            className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-2 rounded-lg text-left transition-colors ${
              sidebarTab === 'courses'
                ? 'bg-purple-700/80 text-white font-semibold shadow'
                : 'text-gray-200 hover:bg-gray-700/80'
            }`}
            onClick={() => setSidebarTab('courses')}
            title="Khóa học"
          >
            <i className="fas fa-book mr-3"></i>
            {sidebarOpen && 'Khóa học'}
          </button>
        </nav>
        <div className={`flex-0 mt-auto pt-8 ${sidebarOpen ? '' : 'flex flex-col items-center'}`}>
          <button className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-2 rounded-lg text-gray-400 hover:bg-gray-700/80`} title="Cài đặt">
            <i className="fas fa-cog mr-3"></i>
            {sidebarOpen && 'Cài đặt'}
          </button>
        </div>
      </aside>

      {/* Main content wrapper with header */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} min-h-screen flex flex-col transition-all duration-200 bg-gradient-to-br from-gray-100 via-white to-purple-50`}>
        {/* Header */}
        <header className="bg-white/90 border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-purple-700 font-semibold hover:underline flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>Học viên
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-500 hover:text-purple-700">
              <i className="fas fa-bell text-xl"></i>
              {/* Notification dot */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center space-x-3">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || user.firstName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-purple-700">
                  {user?.firstName?.[0] || 'U'}
                </div>
              )}
              <span className="font-semibold text-gray-700 text-base">
                {user?.fullName || user?.firstName || 'Giảng viên'}
              </span>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}

export default InstructorLayout;
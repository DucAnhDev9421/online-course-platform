// components/Header.jsx
import { useState } from 'react';
import ProfilePage from '../../pages/ProfilePage';
import { useLocation, Link } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const [showCategories, setShowCategories] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Thêm dữ liệu user demo
  const userData = {
    name: "User",
    email: "user@example.com"
  };

  // Danh sách categories và subcategories
  const categories = [
    {
      name: 'Phát triển',
      subcategories: ['Lập trình web', 'Mobile', 'Game', 'Data Science']
    },
    {
      name: 'Kinh doanh',
      subcategories: ['Khởi nghiệp', 'Quản lý', 'Bán hàng', 'Chiến lược']
    },
    {
      name: 'IT và Phần mềm',
      subcategories: ['An ninh mạng', 'Hệ thống', 'DevOps', 'Cloud Computing']
    },
    {
      name: 'Marketing',
      subcategories: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing']
    }
  ];

  // Đóng tất cả dropdown khi click bên ngoài
  const handleOutsideClick = (e) => {
    if (!e.target.closest('.dropdown')) {
      setShowCategories(false);
      setShowProfileMenu(false);
    }
  };


  // Thêm sự kiện click bên ngoài
  useState(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-purple-700">
            Academy
          </Link>

          {/* Thêm link Khóa học */}
          <Link
            to="/courses"
            className="font-medium hover:text-purple-700 hidden md:block"
          >
            Khóa học
          </Link>

          {/* Nút Danh mục */}
          <div
            className="relative hidden md:block dropdown"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <button className="font-medium hover:text-purple-700 flex items-center">
              Danh mục
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showCategories && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                {categories.map((category, index) => (
                  <div key={index} className="group relative">
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex justify-between items-center"
                    >
                      {category.name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>

                    {/* Submenu */}
                    <div className="absolute left-full top-0 ml-1 hidden group-hover:block w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {category.subcategories.map((sub, i) => (
                        <a
                          key={i}
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="hidden md:block relative flex-grow max-w-2xl mx-8">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="absolute right-0 top-0 h-full px-4 bg-purple-700 text-white rounded-r-full hover:bg-purple-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Phần menu bên phải */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="font-medium hover:text-purple-700">
                  Udemy Business
                </a>
                <a href="#" className="font-medium hover:text-purple-700">
                  Giảng dạy trên Udemy
                </a>
              </nav>

              {/* Nút giỏ hàng */}
              <button className="p-2 text-gray-700 hover:text-purple-700 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-purple-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>

              <div className="relative dropdown">
                <button
                  className="flex items-center space-x-1 focus:outline-none"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                    {userData.name.charAt(0)}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-600 transition-transform ${showProfileMenu ? 'transform rotate-180' : ''
                      }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {showProfileMenu && (
                  <ProfilePage
                    userData={userData}
                    onClose={() => setShowProfileMenu(false)}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-purple-700 font-medium hover:text-purple-800"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-purple-700 text-white rounded-md font-medium hover:bg-purple-800"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
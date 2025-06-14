// components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import { FaUser, FaKey, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Header() {
  const location = useLocation();
  const [showCategories, setShowCategories] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [cartCourses, setCartCourses] = useState([]);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const navigate = useNavigate();

  // State to store user role
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Debounce function to limit API calls while typing
  const debounce = (func, delay) => {
    let timeoutId;
    const debounced = (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
    debounced.cancel = () => {
      clearTimeout(timeoutId);
    };
    return debounced;
  };

  // Effect to fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) { // Minimum 2 characters to start searching
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(`https://localhost:7261/api/search/suggestion?q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(response.data?.suggestions || []);
        console.log('Search suggestions API response:', response.data);
        console.log('Suggestions array:', response.data?.suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300); // 300ms debounce delay

    debouncedFetchSuggestions();

    // Cleanup function to clear timeout on unmount or dependency change
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [searchQuery]); // Dependency on searchQuery

  // Load danh sách khóa học yêu thích từ localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteCourses') || '[]');
    setFavoriteCourses(storedFavorites);
  }, []);

  // Cập nhật số lượng khóa học yêu thích trong localStorage
  useEffect(() => {
    localStorage.setItem('favoriteCourses', JSON.stringify(favoriteCourses));
  }, [favoriteCourses]);

  // Load danh sách khóa học trong giỏ từ localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cartCourses') || '[]');
    setCartCourses(stored);
  }, []);

  // Fetch user role when signed in
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isSignedIn || !user?.id) {
        setUserRole(null);
        setLoadingRole(false);
        return;
      }
      setLoadingRole(true);
      try {
        const response = await axios.get(`https://localhost:7261/api/users/${user.id}/role`);
        setUserRole(response.data.role?.toLowerCase()); // Store role in lowercase for case-insensitive comparison
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoadingRole(false);
      }
    };
    fetchUserRole();
  }, [user, isSignedIn]); // Dependencies on user and isSignedIn

  // Gọi API lấy danh mục khi load header
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://localhost:7261/api/categories');
        setCategories(res.data || []);
      } catch (e) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Đóng tất cả dropdown khi click bên ngoài
  const handleOutsideClick = (e) => {
    // Check if the click is inside the search suggestions dropdown
    if (e.target.closest('.search-suggestions-dropdown')) {
      return; // Do nothing if click is inside suggestions dropdown
    }
    // Check if the click is inside any other dropdown
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

  const handleSignOut = () => {
    signOut();
    setShowProfileMenu(false);
  };

  // Thêm hàm kiểm tra role
  const checkInstructorRole = async () => {
    try {
      console.log('Checking role for user ID:', user?.id);
      const response = await axios.get(`https://localhost:7261/api/users/${user?.id}/role`);
      console.log('API Response:', response.data);
      const userRole = response.data.role;
      console.log('User Role:', userRole);
      
      // Kiểm tra chính xác giá trị role
      if (userRole === 'Instructor' || userRole === 'Admin' || 
          userRole === 'instructor' || userRole === 'admin' || 
          userRole.toLowerCase() === 'instructor' || userRole.toLowerCase() === 'admin') {
        console.log('Access granted, navigating to teaching page');
        navigate('/teaching');
      } else {
        console.log('Access denied, redirecting to become-instructor page');
        navigate('/become-instructor');
        toast.info('Bạn cần đăng ký làm giảng viên để truy cập trang này');
      }
    } catch (error) {
      console.error('Error checking role:', error);
      console.error('Error response:', error.response);
      toast.error('Có lỗi xảy ra khi kiểm tra quyền truy cập');
    }
  };

  // Khi hover vào nút yêu thích, gọi API lấy danh sách yêu thích
  const handleShowFavorites = async () => {
    setShowFavorites(true);
    if (!user?.id) {
      setFavoriteCourses([]);
      return;
    }
    setLoadingFavorites(true);
    try {
      const res = await axios.get(`https://localhost:7261/api/users/${user.id}/favorites`);
      setFavoriteCourses(res.data || []);
    } catch (err) {
      setFavoriteCourses([]);
    } finally {
      setLoadingFavorites(false);
    }
  };

  // Khi hover vào nút giỏ hàng, gọi API lấy danh sách giỏ hàng
  const handleShowCart = async () => {
    setShowCart(true);
    if (!isSignedIn) {
      setCartCourses([]);
      return;
    }
    setLoadingCart(true);
    try {
      const token = await getToken();
      const res = await axios.get('https://localhost:7261/api/Cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCartCourses(res.data || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCartCourses([]);
    } finally {
      setLoadingCart(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    console.log('handleSuggestionClick called with:', suggestion);
    setSearchQuery(''); // Clear search query
    setSuggestions([]); // Clear suggestions

    console.log('Suggestion Type:', suggestion.type);
    console.log('Suggestion ID:', suggestion.id);

    if (suggestion.type === 'course') {
      const navigatePath = `/courses/${suggestion.id}`;
      console.log('Navigating to course detail:', navigatePath);
      navigate(navigatePath);
    } else if (suggestion.type === 'category') {
      const navigatePath = `/categories/${suggestion.id}`;
      console.log('Navigating to category detail:', navigatePath);
      navigate(navigatePath);
    }
  };

  // Handle full search when user submits or clicks search button
  const handleSearch = () => {
    if (!searchQuery) return;
    console.log('Performing search for:', searchQuery);
    // TODO: Call the /api/search endpoint and navigate to search results page
    // For now, let's just navigate to a search results page with the query
    navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
    setSuggestions([]); // Close suggestions dropdown after search
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/images/logo.webp"
              alt="Academy Logo"
              className="h-16 w-auto rounded-md"
              style={{ maxHeight: '64px' }}
            />
          </Link>

          {/* Thêm link Khóa học */}
          <Link
            to="/courses"
            className="font-medium hover:text-purple-700 hidden md:block"
          >
            Khám Phá
          </Link>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="hidden md:block relative flex-grow max-w-2xl mx-8">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {/* Suggestions Dropdown - Initial Structure */}
          {searchQuery && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-md shadow-lg z-[100] mt-1 border border-gray-200 max-h-60 overflow-y-auto">
              <div className="search-suggestions-dropdown border border-red-500">
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {console.log('Rendering suggestion:', suggestion)}
                      {suggestion.name} {suggestion.type === 'course' ? '(Khóa học)' : '(Danh mục)'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <button
            onClick={handleSearch}
            className="absolute right-0 top-0 h-full px-4 bg-purple-700 text-white rounded-r-full hover:bg-purple-800"
          >
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
          {isSignedIn ? (
            <>
              <nav className="hidden md:flex space-x-6">
                <Link to="/my-courses" className="font-medium hover:text-purple-700">
                  Học tập
                </Link>
                <button 
                  onClick={checkInstructorRole}
                  className="font-medium hover:text-purple-700"
                >
                  Giảng dạy
                </button>
              </nav>

              {/* Nút khóa học yêu thích */}
              <div
                className="relative"
                onMouseEnter={handleShowFavorites}
                onMouseLeave={() => setShowFavorites(false)}
              >
                <Link to="/favorites" className="p-2 text-gray-700 hover:text-red-500 relative">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Link>
                {showFavorites && (
                  <div className="dropdown-menu absolute right-0 mt-0 w-72 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200 transition-all duration-200 ease-in-out">
                    {loadingFavorites ? (
                      <div className="px-4 py-4 text-center text-gray-500">Đang tải...</div>
                    ) : favoriteCourses.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">Chưa có khóa học yêu thích</div>
                    ) : (
                      <ul>
                        {favoriteCourses.slice(0, 5).map(course => (
                          <li key={course.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => { navigate(`/courses/${course.id}`); setShowFavorites(false); }}>
                            <img src={course.imageUrl} alt={course.name} className="w-10 h-10 rounded object-cover border" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-gray-900 line-clamp-1">{course.name}</div>
                              <div className="text-xs text-gray-500 line-clamp-1">{course.instructorName || 'Giảng viên'}</div>
                              <div className="text-xs font-bold mt-0.5 {course.price === 0 ? 'text-green-600' : 'text-purple-700'}">
                                {course.price === 0 ? 'Miễn phí' : course.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                              </div>
                            </div>
                          </li>
                        ))}
                        {favoriteCourses.length > 5 && (
                          <li className="px-4 py-2 text-center">
                            <Link to="/favorites" className="text-purple-700 font-semibold hover:underline" onClick={() => setShowFavorites(false)}>
                              Xem tất cả ({favoriteCourses.length})
                            </Link>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Nút giỏ hàng */}
              <div
                className="relative"
                onMouseEnter={handleShowCart}
                onMouseLeave={() => setShowCart(false)}
              >
                <Link to="/cart" className="p-2 text-gray-700 hover:text-purple-700 relative">
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
                </Link>
                {showCart && (
                  <div className="dropdown-menu absolute right-0 mt-0 w-72 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200 transition-all duration-200 ease-in-out">
                    {loadingCart ? (
                      <div className="px-4 py-4 text-center text-gray-500">Đang tải giỏ hàng...</div>
                    ) : cartCourses.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">Giỏ hàng trống</div>
                    ) : (
                      <ul>
                        {cartCourses.slice(0, 5).map(item => (
                          <li key={item.cartItemId} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => { navigate(`/courses/${item.courseId}`); setShowCart(false); }}>
                            <img src={item.course.imageUrl || '/default-course.png'} alt={item.course.name} className="w-10 h-10 rounded object-cover border" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-gray-900 line-clamp-1">{item.course.name}</div>
                              <div className="text-xs text-gray-500 line-clamp-1">{item.course.instructor?.name || 'Giảng viên'}</div>
                              <div className="text-xs font-bold mt-0.5 {item.course.price === 0 ? 'text-green-600' : 'text-purple-700'}">
                                {item.course.price === 0 ? 'Miễn phí' : item.course.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                              </div>
                            </div>
                          </li>
                        ))}
                        {cartCourses.length > 5 && (
                          <li className="px-4 py-2 text-center">
                            <Link to="/cart" className="text-purple-700 font-semibold hover:underline" onClick={() => setShowCart(false)}>
                              Xem tất cả ({cartCourses.length})
                            </Link>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Nút thông báo */}
              <div
                className="relative"
                onMouseEnter={() => setShowNotifications(true)}
                onMouseLeave={() => setShowNotifications(false)}
              >
                <button
                  className="p-2 text-gray-700 hover:text-yellow-500 focus:outline-none"
                  aria-label="Thông báo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                {/* Dropdown thông báo */}
                {showNotifications && (
                  <div className="dropdown-menu absolute right-0 mt-0 w-72 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200 transition-all duration-200 ease-in-out">
                    <div className="px-4 py-2 text-gray-500">Không có thông báo</div>
                  </div>
                )}
              </div>

              <div
                className="relative dropdown"
                onMouseEnter={() => setShowProfileMenu(true)}
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <button
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center text-white font-medium">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Avatar"
                        className="w-8 h-8 object-cover"
                      />
                    ) : (
                      user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-600 transition-transform ${showProfileMenu ? 'transform rotate-180' : ''}`}
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
                  <div className="dropdown-menu absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 transition-all duration-200 ease-in-out">
                    <Link
                      to="/profileuser"
                      className="block px-4 py-2 text-gray-800 hover:bg-purple-50 hover:text-purple-700 flex items-center transition-colors duration-200 group"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FaUser className="mr-2 text-gray-500 group-hover:text-purple-700 transition-colors duration-200" />
                      <span className="transition-colors duration-200 group-hover:font-semibold">Hồ sơ của tôi</span>
                    </Link>
                    {userRole === 'admin' && (
                      <>
                        <Link
                          to="/token"
                          className="block px-4 py-2 text-gray-800 hover:bg-purple-50 hover:text-purple-700 flex items-center transition-colors duration-200 group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FaKey className="mr-2 text-gray-500 group-hover:text-purple-700 transition-colors duration-200" />
                          <span className="transition-colors duration-200 group-hover:font-semibold">API Token</span>
                        </Link>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-800 hover:bg-purple-50 hover:text-purple-700 flex items-center transition-colors duration-200 group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FaTachometerAlt className="mr-2 text-gray-500 group-hover:text-purple-700 transition-colors duration-200" />
                          <span className="transition-colors duration-200 group-hover:font-semibold">Dashboard</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-50 hover:text-purple-700 flex items-center transition-colors duration-200 group"
                    >
                      <FaSignOutAlt className="mr-2 text-gray-500 group-hover:text-purple-700 transition-colors duration-200" />
                      <span className="transition-colors duration-200 group-hover:font-semibold">Đăng xuất</span>
                    </button>
                  </div>
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

      {/* Hiệu ứng transition cho dropdown-menu */}
      <style jsx global>{`
        .dropdown-menu {
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .relative:hover .dropdown-menu,
        .dropdown:hover .dropdown-menu {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
      `}</style>
    </header>
  );
}
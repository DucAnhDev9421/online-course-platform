import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import CourseCard from '@components/courses/CourseCard';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [sections, setSections] = useState([]);
  const [showAllSections, setShowAllSections] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const totalLectures = sections.reduce((sum, section) => sum + (section.lessons ? section.lessons.length : 0), 0);
  const totalDurationMinutes = sections.reduce((total, section) => {
    const sectionDuration = (section.lessons || []).reduce((sum, lesson) => {
      const duration = typeof lesson.duration === 'number' ? lesson.duration : 0;
      return sum + duration;
    }, 0);
    return total + sectionDuration;
  }, 0);
  const totalSections = sections.length;
  const [showFullInstructorDesc, setShowFullInstructorDesc] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Helper function to format duration from HH:MM:SS to decimal hours
  const formatDurationToHours = (durationString) => {
    if (!durationString || typeof durationString !== 'string') {
      return '0'; // Default to 0 if duration is not available or invalid
    }
    const parts = durationString.split(':');
    if (parts.length !== 3) {
      return '0'; // Handle unexpected format
    }
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return '0'; // Handle parsing errors
    }

    const totalHours = hours + (minutes / 60) + (seconds / 3600);

    // Format to one decimal place, or integer if it's a whole number
    if (totalHours === Math.floor(totalHours)) {
        return `${totalHours.toFixed(0)}`;
    }
     return `${totalHours.toFixed(1)}`;
  };

  // New state for instructor details
  const [instructorDetails, setInstructorDetails] = useState(null);
  const [loadingInstructor, setLoadingInstructor] = useState(true);
  const [errorInstructor, setErrorInstructor] = useState(null);

  // Tính tổng thời lượng
  const formatTotalDuration = (minutes) => {
    if (minutes === 0) return '0 phút';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) return `${hours} giờ ${remainingMinutes} phút`;
    if (hours > 0) return `${hours} giờ`;
    return `${remainingMinutes} phút`;
  };

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7261/api/courses/${courseId}`);
        const apiSections = (response.data.sections || []).map(section => ({
          ...section,
          expanded: false
        }));
        const courseData = {
          id: response.data.id,
          title: response.data.name,
          price: response.data.price || 0,
          description: response.data.description,
          rating: response.data.averageRating || 0,
          totalRatings: response.data.totalRatings || 0,
          students: response.data.enrollmentCount || 0,
          image: response.data.imageUrl || 'https://almablog-media.s3.ap-south-1.amazonaws.com/medium_React_Fundamentals_56e32fd939.png',
          instructor: response.data.instructor,
          topics: response.data.topics || [],
          duration: response.data.totalDuration || '',
          level: response.data.levelText || '',
          lastUpdated: new Date().toISOString(),
          lessons: [],
          videoDemoUrl: response.data.videoDemoUrl || ''
        };
        setCourse(courseData);
        setSections(apiSections);
        console.log('Course data fetched:', courseData);
        console.log('Total Duration from API:', courseData.totalDuration);
        // Lấy khóa học liên quan
        try {
          const relatedRes = await axios.get(`https://localhost:7261/api/courses/${courseId}/related`);
          setRelatedCourses(relatedRes.data || []);
        } catch (err) {
          setRelatedCourses([]);
        }
      } catch (err) {
        setError('Failed to fetch course details');
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetail();
  }, [courseId]);

  // useEffect to fetch instructor details
  useEffect(() => {
    const fetchInstructorDetails = async () => {
      if (course?.instructor?.id) {
        try {
          setLoadingInstructor(true);
          const response = await axios.get(`https://localhost:7261/api/users/instructor/${course.instructor.id}`);
          setInstructorDetails(response.data);
        } catch (err) {
          setErrorInstructor('Không thể tải thông tin giảng viên');
          console.error('Error fetching instructor details:', err);
          setInstructorDetails(null); // Set to null on error
        } finally {
          setLoadingInstructor(false);
        }
      } else {
         // If no instructor ID in course data, stop loading and set to null
         setLoadingInstructor(false);
         setInstructorDetails(null);
         setErrorInstructor(null);
      }
    };
    fetchInstructorDetails();
  }, [course]); // Dependency on course state

  // Đồng bộ trạng thái yêu thích với server khi load trang hoặc khi course thay đổi
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id || !course) return;
      try {
        const res = await axios.get(`https://localhost:7261/api/users/${user.id}/favorites`);
        setIsFavorite(res.data.some(fav => fav.id === course.id));
      } catch (err) {
        setIsFavorite(false);
      }
    };
    fetchFavorites();
  }, [user, course]);

  // Xử lý thêm/xóa khóa học yêu thích (server)
  const handleToggleFavorite = async () => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để sử dụng chức năng này!');
      return;
    }
    try {
      await axios.patch(`https://localhost:7261/api/users/${user.id}/favorite`, { courseId: course.id });
      // Sau khi PATCH xong, gọi lại GET để đồng bộ trạng thái
      const res = await axios.get(`https://localhost:7261/api/users/${user.id}/favorites`);
      setIsFavorite(res.data.some(fav => fav.id === course.id));
      toast.success(isFavorite ? 'Đã bỏ khỏi danh sách yêu thích!' : 'Đã thêm vào danh sách yêu thích!');
    } catch (error) {
      toast.error('Có lỗi khi cập nhật yêu thích!');
    }
  };

  // Quay lại trang danh sách khóa học
  const handleBackToList = () => {
    navigate('/courses');
  };

  // Xử lý đăng ký khóa học
  const handleEnrollCourse = () => {
    try {
      // Lấy danh sách khóa học đã đăng ký từ localStorage
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      
      // Kiểm tra xem khóa học đã được đăng ký chưa
      const isAlreadyEnrolled = enrolledCourses.some(c => c.id === course.id);
      
      if (isAlreadyEnrolled) {
        alert('Bạn đã đăng ký khóa học này rồi!');
        return;
      }
      
      // Thêm khóa học vào danh sách đã đăng ký
      enrolledCourses.push({
        id: course.id,
        title: course.title,
        thumbnail: course.image,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        lastAccessed: new Date().toISOString()
      });
      
      // Lưu lại vào localStorage
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      
      // Hiển thị thông báo thành công
      alert(`Đã đăng ký thành công khóa học: ${course.title}`);
      
      // Chuyển hướng đến trang học
      navigate(`/courses/${course.id}/learn`);
    } catch (error) {
      console.error('Error enrolling course:', error);
      alert('Có lỗi xảy ra khi đăng ký khóa học. Vui lòng thử lại sau.');
    }
  };

  // Xử lý bắt đầu học
  const handleStartLearning = () => {
    navigate(`/courses/${courseId}/lessons/1`); // Chuyển đến bài học đầu tiên
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      user: 'Người dùng hiện tại',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
  };

  const toggleLessonDetails = (lessonId) => {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);
    } else {
      setExpandedLessonId(lessonId);
    }
  };

  const handleToggleSection = idx => {
    setSections(sections => sections.map((s, i) => i === idx ? { ...s, expanded: !s.expanded } : s));
  };
  const handleExpandAll = () => {
    setSections(sections => sections.map(s => ({ ...s, expanded: true })));
  };

  // Helper: formatTimeAgo
  function formatTimeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = (now - date) / 1000;
    if (diff < 60 * 60 * 24) return 'Hôm nay';
    if (diff < 60 * 60 * 24 * 7) return `${Math.floor(diff / (60 * 60 * 24))} ngày trước`;
    if (diff < 60 * 60 * 24 * 30) return `${Math.floor(diff / (60 * 60 * 24 * 7))} tuần trước`;
    return `${Math.floor(diff / (60 * 60 * 24 * 30))} tháng trước`;
  }

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const token = await getToken(); // Lấy token từ Clerk
      if (!token) {
        toast.error('Vui lòng đăng nhập để thêm khóa học vào giỏ hàng');
        navigate('/login');
        return;
      }

      const response = await axios.post('https://localhost:7261/api/Cart/add', 
        {
          courseId: course.id,
          quantity: 1
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        toast.success('Đã thêm khóa học vào giỏ hàng!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại sau.');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Xử lý áp dụng coupon
  const handleApplyCoupon = async () => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để áp dụng coupon.');
      navigate('/login');
      return;
    }

    if (!couponCode) {
      setCouponError('Vui lòng nhập mã coupon.');
      return;
    }
    if (!course?.id) {
      setCouponError('Không thể áp dụng coupon cho khóa học này.');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);
    setAppliedDiscount(0);

    try {
      const token = await getToken(); // Lấy token từ Clerk
       if (!token) {
         toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
         navigate('/login');
         return;
       }

      const res = await axios.post('https://localhost:7261/api/coupons/validate', {
        code: couponCode,
        courseId: Number(course.id) // Ensure courseId is a number if needed by API
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
      );

      // Assuming API returns discountAmount on success
      // You might need to adjust this based on the actual API response structure
      if (res.data && typeof res.data.discountAmount === 'number') {
        setAppliedDiscount(res.data.discountAmount);
        toast.success(`Áp dụng coupon thành công! Giảm giá ${res.data.discountAmount.toLocaleString('vi-VN')} VNĐ.`);
      } else if (res.data && typeof res.data.discount === 'object' && typeof res.data.discount.discountAmount === 'number') {
         setAppliedDiscount(res.data.discount.discountAmount);
         toast.success(`Áp dụng coupon thành công! Giảm giá ${res.data.discount.discountAmount.toLocaleString('vi-VN')} VNĐ.`);
      }
       else {
        // Handle unexpected successful response structure
         setCouponError('Coupon không hợp lệ hoặc không áp dụng được cho khóa học này.');
         toast.error('Coupon không hợp lệ.');
       }

    } catch (error) {
      console.error('Error applying coupon:', error.response?.data || error.message);
      // Assuming error response contains a message in error.response.data or error.message
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Có lỗi xảy ra khi áp dụng coupon!';
      setCouponError(errorMessage);
      toast.error(errorMessage);
      setAppliedDiscount(0); // Reset discount on error
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">Đang tải thông tin khóa học...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Không tìm thấy khóa học</div>
          <p className="mb-8">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button 
            onClick={handleBackToList}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  const progress = (course.lessons.filter(l => l.completed).length / course.lessons.length) * 100;
  const finalPrice = course.price - appliedDiscount;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header - Dark mode style */}
      <div className="rounded-lg mb-8 p-8" style={{background: '#181822', color: '#fff'}}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{course.title}</h1>
        <div className="text-lg text-gray-200 mb-4" dangerouslySetInnerHTML={{ __html: course.description }} />
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="bg-cyan-700 text-xs px-2 py-1 rounded font-semibold mr-2">Bán chạy nhất</span>
          <button 
            onClick={handleToggleFavorite}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
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
            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
          </button>
          <span className="flex items-center text-yellow-400 font-bold text-base mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {course.rating}
          </span>
          <span className="text-gray-300 text-sm ml-2">{course.students.toLocaleString()} học viên</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-2">
          <span>Được tạo bởi <span className="font-semibold text-white">{course.instructor?.username || 'AI Coding'}</span></span>
          <span className="flex items-center gap-1">
            <i className="fas fa-history"></i>
            Lần cập nhật gần nhất <span className="font-semibold">{course.lastUpdated ? (typeof course.lastUpdated === 'string' ? course.lastUpdated : new Date(course.lastUpdated).toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })) : '5/2025'}</span>
          </span>
        </div>
      </div>
      {/* Main content with sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Khung nội dung bài học */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Nội dung bài học</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-2">
              {(showAllTopics ? course.topics : course.topics.slice(0, 8)).map((topic, idx) => (
                <li key={idx} className="flex items-start text-base text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
            {course.topics.length > 8 && (
              <button
                className="text-purple-700 font-semibold hover:underline mt-2"
                onClick={() => setShowAllTopics(v => !v)}
              >
                {showAllTopics ? 'Ẩn bớt' : 'Xem thêm'}
              </button>
            )}
          </div>
          {/* Nội dung khóa học dạng section */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Nội dung khóa học</h2>
              <button className="text-purple-700 font-semibold hover:underline" onClick={handleExpandAll}>Mở rộng tất cả các phần</button>
            </div>
            <div className="text-gray-600 text-sm mb-4">{totalSections} phần • {totalLectures} bài giảng • {course?.duration || '0 phút'} tổng thời lượng</div>
            <div className="border rounded-lg overflow-hidden">
              {(showAllSections ? sections : sections.slice(0, 10)).map((section, idx) => (
                <div key={section.id || idx} className="border-b last:border-b-0">
                  <button className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left hover:bg-gray-50" onClick={() => handleToggleSection(idx)}>
                    <span>{section.title}</span>
                    <span className="text-sm text-gray-500">{section.lessons?.length || 0} bài giảng</span>
                  </button>
                  {section.expanded && (
                    <div className="px-6 py-3 bg-gray-50 text-gray-700 text-sm">
                      {section.lessons && section.lessons.length > 0 ? (
                        <ul>
                          {section.lessons.map((lesson, lidx) => (
                            <li key={lesson.id || lidx} className="flex items-center justify-between py-1 border-b last:border-b-0 text-gray-700 text-sm">
                              <span>
                                <span className="inline-block w-2 h-2 rounded-full mr-2 bg-gray-400"></span>
                                {lesson.title}
                              </span>
                              {lesson.duration && (
                                <span className="text-gray-500 text-xs">{lesson.duration}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>Chưa có bài giảng</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {sections.length > 10 && (
              <button className="w-full mt-4 border border-purple-600 text-purple-700 py-2 rounded font-semibold hover:bg-purple-50" onClick={() => setShowAllSections(v => !v)}>
                {showAllSections ? 'Ẩn bớt' : `${sections.length - 10} phần nữa`}
              </button>
            )}
          </div>
          {/* Mô tả khóa học */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Mô tả khóa học</h2>
            <div className="text-gray-700 text-base" dangerouslySetInnerHTML={{ __html: course.description }} />
          </div>
          {/* Giảng viên */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Giảng viên</h2>
            {loadingInstructor ? (
              <div>Đang tải thông tin giảng viên...</div>
            ) : errorInstructor ? (
              <div className="text-red-500">{errorInstructor}</div>
            ) : instructorDetails ? (
              <div className="flex items-center mb-4">
                <img src={instructorDetails.imageUrl || 'https://ui-avatars.com/api/?name=GV&background=random'} alt={instructorDetails.username || 'Giảng viên'} className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 mr-6" />
                <div>
                  <a href="#" className="text-xl font-bold text-purple-700 hover:underline">{instructorDetails.username || 'Giảng viên'}</a>
                  <div className="text-gray-500 text-base mb-2">{instructorDetails.jobTitle || 'Senior AI Engineer'}</div>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                    <span className="flex items-center"><i className="fas fa-users mr-1"></i>{instructorDetails.statistics?.totalStudents || 0} học viên</span>
                    <span className="flex items-center"><i className="fas fa-book mr-1"></i>{instructorDetails.statistics?.totalCourses || 0} khóa học</span>
                  </div>
                </div>
              </div>
            ) : (
               <div className="text-gray-500">Không có thông tin giảng viên.</div>
            )}
            {/* Mô tả giảng viên có thể ẩn/hiện */}
            {(() => {
              const desc = instructorDetails?.bio ? [<span key="bio">{instructorDetails.bio}</span>] : [
                <span key="1" className="font-bold">Mình từng học Kỹ sư tài năng tại Đại Học Bách khoa Hà Nội trong 2 năm. Sau đó mình đi du học và tốt nghiệp thạc sĩ vật lý hạt nhân tại trường đại học MEPhI - một trong những ngôi trường tốt nhất tại liên bang Nga.</span>,
                <> Sau đó, mình có cơ hội làm việc trong lĩnh vực công nghệ thông tin, bén duyên với lĩnh vực này và hiện tại <span className="font-bold text-purple-700">mình đang là Senior AI Engineer</span> ❤️❤️❤️</>,
                <><br/><br/>Mình đã có nhiều năm kinh nghiệm làm việc với <span className="font-bold">Python và trí tuệ nhân tạo (AI)</span>. Các lĩnh vực chuyên môn chính của mình bao gồm: thị giác máy tính (<span className="font-bold">Computer Vision</span>), xử lý ngôn ngữ tự nhiên (<span className="font-bold">NLP</span>), truy xuất thông tin RAG, <span className="font-bold">AI Agents</span>, triển khai mô hình AI lên các nền tảng đám mây hoặc thiết bị biên, tối ưu hóa hiệu suất của các mô hình AI, <span className="font-bold">workflow automation với AI</span>.</>,
                <><br/><br/>Mình rất vui khi được gặp gỡ và chia sẻ kiến thức cũng như đồng hành cùng với các bạn. Hãy luôn giữ đam mê và nhiệt huyết, thành công sẽ đến với chúng ta!</>
              ];

              const maxLines = 4;
              const shouldShowToggle = instructorDetails?.bio ? instructorDetails.bio.split('\n').length > maxLines : desc.length > maxLines;

              return (
                <div className="text-gray-800 text-base leading-relaxed mt-2">
                  {shouldShowToggle && !showFullInstructorDesc ? desc.slice(0, maxLines) : desc}
                  {shouldShowToggle && (
                    <button
                      className="block mt-2 text-purple-700 font-semibold hover:underline focus:outline-none"
                      onClick={() => setShowFullInstructorDesc(v => !v)}
                    >
                      {showFullInstructorDesc ? 'Ẩn bớt ︿' : 'Xem thêm ˇ'}
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
          {/* Đánh giá khóa học */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-yellow-600 mr-2">★ {course.rating} xếp hạng khóa học</span>
              <span className="text-lg font-semibold text-gray-700 ml-2">• {reviews.length} xếp hạng</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, idx) => {
                const isLong = review.comment.length > 120;
                const expanded = expandedReviews[review.id];
                return (
                  <div key={review.id} className="border rounded-lg p-5 relative bg-gray-50">
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg text-white mr-3">
                        {review.user.split(' ').map(w => w[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-base">{review.user}</div>
                        <div className="flex items-center text-yellow-500 text-sm">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          <span className="text-gray-500 ml-2 text-xs">{formatTimeAgo(review.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-800 text-base mb-2">
                      {isLong && !expanded ? review.comment.slice(0, 120) + '...' : review.comment}
                      {isLong && (
                        <button
                          className="ml-2 text-purple-700 font-semibold hover:underline text-sm"
                          onClick={() => setExpandedReviews(r => ({ ...r, [review.id]: !expanded }))}
                        >
                          {expanded ? 'Ẩn bớt' : 'Hiện thêm'}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>Bạn thấy hữu ích?</span>
                      <button className="hover:text-purple-700"><i className="far fa-thumbs-up"></i></button>
                      <button className="hover:text-purple-700"><i className="far fa-thumbs-down"></i></button>
                    </div>
                  </div>
                );
              })}
            </div>
            {reviews.length > 3 && (
              <button
                className="mt-6 px-5 py-2 bg-purple-100 text-purple-700 rounded font-semibold hover:bg-purple-200"
                onClick={() => setShowAllReviews(v => !v)}
              >
                {showAllReviews ? 'Ẩn bớt đánh giá' : 'Hiện tất cả đánh giá'}
              </button>
            )}
          </div>
        </div>
        {/* Sidebar bên phải */}
        <aside className="sidebar-udemy w-full lg:w-[340px] flex-shrink-0 -mt-24 z-10 relative">
          <div className="sidebar-udemy-inner bg-white rounded-lg shadow p-6 sticky top-8">
            {/* Video giới thiệu khóa học */}
            <div className="mb-4">
              <iframe
                width="100%"
                height="200"
                src={course.videoDemoUrl}
                title="Giới thiệu khóa học"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md"
              ></iframe>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {finalPrice > 0 ? finalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Miễn phí'}
            </div>
            <div className="flex gap-2 mb-3">
              <button 
                className="flex-1 bg-purple-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isAddingToCart || course.price === 0}
              >
                {isAddingToCart
                  ? (<span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang thêm...
                    </span>)
                  : 'Thêm vào giỏ hàng'}
              </button>
              <button
                onClick={handleToggleFavorite}
                title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                className={`w-12 h-12 flex items-center justify-center border-2 rounded-md transition-colors ${
                  isFavorite
                    ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-gray-300 bg-white text-gray-400 hover:bg-gray-100'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill={isFavorite ? 'currentColor' : 'none'}
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
              </button>
            </div>
            <button className="w-full border-2 border-purple-600 text-purple-700 py-3 rounded-md text-lg font-semibold hover:bg-purple-50 mb-2" onClick={handleStartLearning}>Học ngay</button>
            <div className="text-center text-gray-500 text-sm mb-4">Đảm bảo hoàn tiền trong 30 ngày</div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Khóa học này bao gồm:</div>
              <ul className="text-gray-700 text-sm space-y-1">
                {/* Hiển thị tổng thời lượng từ API */}
                {course.duration && <li>{formatDurationToHours(course.duration)} giờ video theo yêu cầu</li>}
                <li>8 bài viết</li>
                <li>3 tài nguyên để tải xuống</li>
                <li>Truy cập trên thiết bị di động và TV</li>
                <li>Quyền truy cập đầy đủ suốt đời</li>
                <li>Giấy chứng nhận hoàn thành</li>
              </ul>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 cursor-pointer hover:underline">Chia sẻ</span>
              <span className="text-sm text-gray-500 cursor-pointer hover:underline">Tặng khóa học này</span>
            </div>
            <div className="mb-2">
              <div className="text-sm text-gray-500 mb-1">Áp dụng coupon</div>
              <div className="flex gap-2">
                 <input
                   type="text"
                   className={`flex-1 border rounded px-3 py-2 ${couponError ? 'border-red-500' : 'border-gray-300'}`}
                   placeholder="Nhập mã coupon"
                   value={couponCode}
                   onChange={(e) => setCouponCode(e.target.value)}
                 />
                 <button
                   className="bg-purple-100 text-purple-700 py-2 px-4 rounded font-semibold hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                   onClick={handleApplyCoupon}
                   disabled={isApplyingCoupon}
                 >
                    {isApplyingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
                 </button>
              </div>
               {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
            </div>
          </div>
        </aside>
      </div>
      {/* Khóa học tương tự */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Khóa học tương tự</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedCourses.map((related) => (
            <CourseCard
              key={related.id}
              id={related.id}
              title={related.title || related.name}
              instructor={related.instructor}
              price={related.price}
              rating={related.rating}
              students={related.students}
              image={related.image || related.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
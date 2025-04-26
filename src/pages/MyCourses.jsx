import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function MyCourses() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUnenrollConfirm, setShowUnenrollConfirm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    // Load enrolled courses from localStorage
    const loadEnrolledCourses = () => {
      try {
        const savedCourses = localStorage.getItem('enrolledCourses');
        if (savedCourses) {
          setEnrolledCourses(JSON.parse(savedCourses));
        }
      } catch (error) {
        console.error('Error loading enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEnrolledCourses();
  }, []);

  const handleContinueLearning = (courseId) => {
    navigate(`/courses/${courseId}/learn`);
  };

  const handleUnenrollClick = (course) => {
    setSelectedCourse(course);
    setShowUnenrollConfirm(true);
  };

  const handleUnenrollConfirm = () => {
    try {
      // Lọc bỏ khóa học đã chọn
      const updatedCourses = enrolledCourses.filter(c => c.id !== selectedCourse.id);
      
      // Cập nhật localStorage
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
      
      // Cập nhật state
      setEnrolledCourses(updatedCourses);
      
      // Đóng dialog xác nhận
      setShowUnenrollConfirm(false);
      setSelectedCourse(null);
      
      // Hiển thị thông báo thành công
      alert(`Đã hủy đăng ký khóa học: ${selectedCourse.title}`);
    } catch (error) {
      console.error('Error unenrolling course:', error);
      alert('Có lỗi xảy ra khi hủy đăng ký khóa học. Vui lòng thử lại sau.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Khóa học của tôi</h1>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 mb-4">Bạn chưa đăng ký khóa học nào</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
          >
            Khám phá khóa học
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Tiến độ học tập</span>
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Đăng ký: {new Date(course.enrolledAt).toLocaleDateString('vi-VN')}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleContinueLearning(course.id)}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                  >
                    Tiếp tục học
                  </button>
                  <button
                    onClick={() => handleUnenrollClick(course)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                  >
                    Hủy đăng ký
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog xác nhận hủy đăng ký */}
      {showUnenrollConfirm && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Xác nhận hủy đăng ký</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy đăng ký khóa học "{selectedCourse.title}"? 
              Bạn sẽ mất quyền truy cập vào nội dung khóa học này.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowUnenrollConfirm(false);
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Hủy
              </button>
              <button
                onClick={handleUnenrollConfirm}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCourses; 
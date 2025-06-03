import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyCourses() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUnenrollConfirm, setShowUnenrollConfirm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) return;
      
      try {
        const response = await axios.get(`https://localhost:7261/api/Enrollments?userId=${user.id}`);
        if (response.status === 200) {
          // Transform the data to match our component's expected structure
          const transformedCourses = response.data.map(enrollment => ({
            id: enrollment.courseId,
            title: enrollment.course.name,
            description: enrollment.course.description,
            thumbnail: enrollment.course.imageUrl,
            enrolledAt: enrollment.enrolledAt,
            progress: 0 // You might want to fetch this from a separate API endpoint
          }));
          setEnrolledCourses(transformedCourses);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        toast.error('Có lỗi xảy ra khi tải danh sách khóa học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const handleContinueLearning = (courseId) => {
    navigate(`/courses/${courseId}/learn`);
  };

  const handleUnenrollClick = (course) => {
    setSelectedCourse(course);
    setShowUnenrollConfirm(true);
  };

  const handleUnenrollConfirm = async () => {
    if (!selectedCourse || !user) return;

    try {
      const response = await axios.delete('https://localhost:7261/api/Enrollments', {
        data: {
          userId: user.id,
          courseId: parseInt(selectedCourse.id)
        }
      });

      if (response.status === 200) {
        // Update the enrolled courses list by removing the unenrolled course
        const updatedCourses = enrolledCourses.filter(c => c.id !== selectedCourse.id);
        setEnrolledCourses(updatedCourses);
        
        // Close confirmation dialog
        setShowUnenrollConfirm(false);
        setSelectedCourse(null);
        
        // Show success message
        toast.success(`Đã hủy đăng ký khóa học: ${selectedCourse.title}`);
      }
    } catch (error) {
      console.error('Error unenrolling course:', error);
      toast.error('Có lỗi xảy ra khi hủy đăng ký khóa học. Vui lòng thử lại sau.');
    }
  };

  // Hàm xác định trạng thái học
  const getCourseStatus = (progress) => {
    if (progress === 100) return { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-800', border: 'border-green-500' };
    if (progress > 0) return { label: 'Đang học', color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500' };
    return { label: 'Chưa bắt đầu', color: 'bg-gray-100 text-gray-800', border: 'border-gray-400' };
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
      <h1 className="text-3xl font-bold mb-8">Học tập</h1>

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
          {enrolledCourses.map((course) => {
            const status = getCourseStatus(course.progress);
            return (
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
                  {/* Badge trạng thái học */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${status.color} border ${status.border}`}>
                      {status.label}
                    </span>
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
            );
          })}
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
      <ToastContainer />
    </div>
  );
}

export default MyCourses; 
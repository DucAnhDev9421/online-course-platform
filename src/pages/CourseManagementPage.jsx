import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function CourseManagementPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedCourse, setEditedCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Load courses from localStorage
        const savedCourses = localStorage.getItem('teachingCourses');
        if (savedCourses) {
          const courses = JSON.parse(savedCourses);
          const foundCourse = courses.find(c => c.id === courseId);
          if (foundCourse) {
            setCourse(foundCourse);
            setEditedCourse(foundCourse);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleEditCourse = async (e) => {
    e.preventDefault();
    try {
      // Load courses from localStorage
      const savedCourses = localStorage.getItem('teachingCourses');
      if (savedCourses) {
        const courses = JSON.parse(savedCourses);
        
        // Update the course in the array
        const updatedCourses = courses.map(c => 
          c.id === courseId ? editedCourse : c
        );
        
        // Save back to localStorage
        localStorage.setItem('teachingCourses', JSON.stringify(updatedCourses));
        
        // Update local state
        setCourse(editedCourse);
        setShowEditForm(false);
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      // Load courses from localStorage
      const savedCourses = localStorage.getItem('teachingCourses');
      if (savedCourses) {
        const courses = JSON.parse(savedCourses);
        
        // Filter out the course to delete
        const updatedCourses = courses.filter(c => c.id !== courseId);
        
        // Save back to localStorage
        localStorage.setItem('teachingCourses', JSON.stringify(updatedCourses));
        
        // Navigate back to teaching page
        navigate('/teaching');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
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

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl text-gray-600 mb-4">Không tìm thấy khóa học</h2>
          <button
            onClick={() => navigate('/teaching')}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowEditForm(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Xóa khóa học
          </button>
        </div>
      </div>

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa khóa học</h2>
            <form onSubmit={handleEditCourse}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khóa học
                  </label>
                  <input
                    type="text"
                    value={editedCourse.title}
                    onChange={(e) => setEditedCourse({ ...editedCourse, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={editedCourse.description}
                    onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={editedCourse.isFree}
                    onChange={(e) => setEditedCourse({ ...editedCourse, isFree: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                    Khóa học miễn phí
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={editedCourse.price}
                      onChange={(e) => setEditedCourse({ ...editedCourse, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={editedCourse.isFree}
                      required={!editedCourse.isFree}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cấp độ
                    </label>
                    <select
                      value={editedCourse.level}
                      onChange={(e) => setEditedCourse({ ...editedCourse, level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="beginner">Người mới bắt đầu</option>
                      <option value="intermediate">Trung cấp</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh bìa (URL)
                  </label>
                  <input
                    type="url"
                    value={editedCourse.thumbnail}
                    onChange={(e) => setEditedCourse({ ...editedCourse, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={editedCourse.category}
                    onChange={(e) => setEditedCourse({ ...editedCourse, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="development">Phát triển</option>
                    <option value="business">Kinh doanh</option>
                    <option value="it">IT và Phần mềm</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa khóa học "{course.title}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteCourse}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Giá</h3>
              <p className="text-purple-600 font-medium">
                {course.isFree ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cấp độ</h3>
              <p className="text-gray-900">
                {course.level === 'beginner' ? 'Người mới bắt đầu' : 
                 course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Danh mục</h3>
              <p className="text-gray-900">
                {course.category === 'development' ? 'Phát triển' :
                 course.category === 'business' ? 'Kinh doanh' :
                 course.category === 'it' ? 'IT và Phần mềm' : 'Marketing'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
              <p className="text-gray-900">
                {course.status === 'draft' ? 'Bản nháp' : 'Đã xuất bản'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseManagementPage; 
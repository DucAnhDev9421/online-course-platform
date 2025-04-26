import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

function TeachingPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    isFree: false,
    thumbnail: '',
    category: '',
    level: 'beginner'
  });

  // Load courses from localStorage when component mounts
  useEffect(() => {
    const savedCourses = localStorage.getItem('teachingCourses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teachingCourses', JSON.stringify(courses));
  }, [courses]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      // Create course data
      const courseData = {
        ...newCourse,
        price: newCourse.isFree ? 0 : newCourse.price,
        instructor: user.id,
        instructorName: user.firstName || 'Giảng viên',
        createdAt: new Date().toISOString(),
        status: 'draft',
        id: Date.now().toString()
      };
      
      // Add to courses list
      setCourses([...courses, courseData]);
      
      // Reset form
      setNewCourse({
        title: '',
        description: '',
        price: '',
        isFree: false,
        thumbnail: '',
        category: '',
        level: 'beginner'
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
        >
          Tạo khóa học mới
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Tạo khóa học mới</h2>
            <form onSubmit={handleCreateCourse}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khóa học
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={newCourse.isFree}
                    onChange={(e) => setNewCourse({ ...newCourse, isFree: e.target.checked })}
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
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={newCourse.isFree}
                      required={!newCourse.isFree}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cấp độ
                    </label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
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
                    value={newCourse.thumbnail}
                    onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
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
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
                >
                  Tạo khóa học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-purple-600 font-medium">
                  {course.isFree ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                </span>
                <Link
                  to={`/teaching/courses/${course.id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Quản lý
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 mb-4">Bạn chưa có khóa học nào.</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
          >
            Tạo khóa học đầu tiên
          </button>
        </div>
      )}
    </div>
  );
}

export default TeachingPage; 
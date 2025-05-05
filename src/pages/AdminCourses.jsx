import React, { useState } from 'react';
import '../assets/css/admin.css';
import AdminLayout from '../layouts/AdminLayout';

const initialCategories = [
  { id: 1, name: 'Lập trình', description: 'Các khóa học về lập trình' },
  { id: 2, name: 'Thiết kế', description: 'Các khóa học về thiết kế' },
  { id: 3, name: 'Kinh doanh', description: 'Các khóa học về kinh doanh' },
];

const initialCourses = [
  { id: 1, name: 'ReactJS Cơ bản', description: 'Khóa học ReactJS cho người mới bắt đầu', categoryId: 1 },
  { id: 2, name: 'Thiết kế UI/UX', description: 'Khóa học thiết kế giao diện người dùng', categoryId: 2 },
  { id: 3, name: 'Khởi nghiệp 101', description: 'Những điều cần biết khi khởi nghiệp', categoryId: 3 },
];

const AdminCourses = () => {
  // Danh mục
  const [categories, setCategories] = useState(initialCategories);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  // Khóa học
  const [courses, setCourses] = useState(initialCourses);
  const [courseName, setCourseName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  // Thông báo
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  // Tìm kiếm
  const [search, setSearch] = useState('');

  // Thêm danh mục
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setMessage('Vui lòng nhập tên danh mục!');
      setMessageType('error');
      return;
    }
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: categoryName,
        description: categoryDesc,
      },
    ]);
    setMessage('Thêm danh mục thành công!');
    setMessageType('success');
    setCategoryName('');
    setCategoryDesc('');
    setTimeout(() => setMessage(''), 2000);
  };

  // Xóa danh mục
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setCourses(courses.filter((c) => c.categoryId !== id)); // Xóa luôn các khóa học thuộc danh mục này
    setMessage('Đã xóa danh mục!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  // Thêm khóa học
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!courseName.trim() || !courseCategory) {
      setMessage('Vui lòng nhập đầy đủ thông tin khóa học!');
      setMessageType('error');
      return;
    }
    setCourses([
      ...courses,
      {
        id: Date.now(),
        name: courseName,
        description: courseDesc,
        categoryId: Number(courseCategory),
      },
    ]);
    setMessage('Thêm khóa học thành công!');
    setMessageType('success');
    setCourseName('');
    setCourseDesc('');
    setCourseCategory('');
    setTimeout(() => setMessage(''), 2000);
  };

  // Xóa khóa học
  const handleDeleteCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
    setMessage('Đã xóa khóa học!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  // Lọc khóa học theo tìm kiếm
  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Quản lý Khóa học & Danh mục</h2>
        {/* Thông báo */}
        {message && (
          <div className={`mb-6 text-center py-2 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
        )}
        {/* Form thêm danh mục */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 gradient-text">Thêm danh mục</h3>
          <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <input
                type="text"
                className="admin-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tên danh mục..."
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <textarea
                className="admin-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả (không bắt buộc)"
                value={categoryDesc}
                onChange={e => setCategoryDesc(e.target.value)}
                rows={1}
              />
            </div>
            <button type="submit" className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all min-w-[150px]">
              <i className="fas fa-plus mr-2"></i> Thêm danh mục
            </button>
          </form>
        </div>
        {/* Bảng danh sách danh mục */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h4 className="mb-4 font-semibold text-blue-700 text-lg">Danh sách danh mục</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên danh mục</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-400 italic py-4">Chưa có danh mục nào</td>
                  </tr>
                )}
                {categories.map(cat => (
                  <tr key={cat.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-gray-800">{cat.name}</td>
                    <td className="px-4 py-2 text-gray-500 text-sm">{cat.description || <span className="italic text-gray-300">(Không có)</span>}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all" title="Xóa danh mục">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Form thêm khóa học */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 gradient-text">Thêm khóa học</h3>
          <form onSubmit={handleAddCourse} className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <input
                type="text"
                className="admin-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tên khóa học..."
                value={courseName}
                onChange={e => setCourseName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <textarea
                className="admin-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả khóa học (không bắt buộc)"
                value={courseDesc}
                onChange={e => setCourseDesc(e.target.value)}
                rows={1}
              />
            </div>
            <div className="flex-1">
              <select
                className="admin-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={courseCategory}
                onChange={e => setCourseCategory(e.target.value)}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="py-2 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-teal-700 transition-all min-w-[150px]">
              <i className="fas fa-plus mr-2"></i> Thêm khóa học
            </button>
          </form>
        </div>
        {/* Bảng danh sách khóa học */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <h4 className="font-semibold text-green-700 text-lg flex-1">Danh sách khóa học</h4>
            <div className="flex items-center">
              <input
                type="text"
                className="admin-input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm kiếm khóa học..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="ml-2 text-gray-400"><i className="fas fa-search"></i></span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên khóa học</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Danh mục</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-400 italic py-4">Không tìm thấy khóa học</td>
                  </tr>
                )}
                {filteredCourses.map(course => (
                  <tr key={course.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-gray-800">{course.name}</td>
                    <td className="px-4 py-2 text-gray-600">{categories.find(c => c.id === course.categoryId)?.name || 'Không rõ danh mục'}</td>
                    <td className="px-4 py-2 text-gray-500 text-sm">{course.description || <span className="italic text-gray-300">(Không có)</span>}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all" title="Xóa khóa học">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCourses; 
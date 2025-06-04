import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InstructorManagement = () => {
  const { user } = useUser();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [instructorsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    bio: '',
    status: 'Active',
    rating: 0,
    totalCourses: 0
  });

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://localhost:7261/api/users');
        // Lọc instructor từ danh sách user
        const instructors = res.data.filter(
          u => u.role === 'Instructor' || u.role === 'Giảng viên'
        );
        setInstructors(instructors);
      } catch (err) {
        setError('Không thể tải danh sách instructor');
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const filteredInstructors = instructors.filter(i =>
    i.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    i.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = filteredInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);
  const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7261/api/instructors', formData);
      toast.success('Thêm giảng viên thành công');
      setShowAddModal(false);
      fetchInstructors();
      resetForm();
    } catch (error) {
      console.error('Error adding instructor:', error);
      toast.error('Có lỗi xảy ra khi thêm giảng viên');
    }
  };

  const handleEditInstructor = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7261/api/instructors/${selectedInstructor.id}`, formData);
      toast.success('Cập nhật giảng viên thành công');
      setShowEditModal(false);
      fetchInstructors();
      resetForm();
    } catch (error) {
      console.error('Error updating instructor:', error);
      toast.error('Có lỗi xảy ra khi cập nhật giảng viên');
    }
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) {
      try {
        await axios.delete(`https://localhost:7261/api/instructors/${instructorId}`);
        toast.success('Xóa giảng viên thành công');
        fetchInstructors();
      } catch (error) {
        console.error('Error deleting instructor:', error);
        toast.error('Có lỗi xảy ra khi xóa giảng viên');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      specialization: '',
      bio: '',
      status: 'Active',
      rating: 0,
      totalCourses: 0
    });
    setSelectedInstructor(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Quản lý Giảng viên</h1>
            <p className="text-gray-600 mt-1">Quản lý và theo dõi thông tin giảng viên</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            <span>Thêm Giảng viên</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Tổng số giảng viên</p>
                <h3 className="text-2xl font-bold mt-1">{instructors.length}</h3>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <i className="fas fa-chalkboard-teacher text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Tổng số khóa học</p>
                <h3 className="text-2xl font-bold mt-1">
                  {instructors.reduce((sum, i) => sum + (i.courses?.total || 0), 0)}
                </h3>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <i className="fas fa-book text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Tổng số học viên</p>
                <h3 className="text-2xl font-bold mt-1">
                  {instructors.reduce((sum, i) => sum + (i.courses?.students || 0), 0)}
                </h3>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <i className="fas fa-users text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm giảng viên..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>

        {/* Instructors Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách giảng viên...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-2">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảng viên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa học</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Học viên</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInstructors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <i className="fas fa-user-graduate text-4xl text-gray-400 mb-3"></i>
                          <p>Không tìm thấy giảng viên nào</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentInstructors.map((instructor) => (
                      <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={instructor.imageUrl || 'https://via.placeholder.com/40'}
                                alt={instructor.firstName}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {instructor.firstName} {instructor.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{instructor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Ngày tham gia</div>
                          <div className="text-sm text-gray-500">
                            {new Date(instructor.joinedAt).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {instructor.courses?.total || 0} khóa học
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {instructor.courses?.students?.toLocaleString() || 0} học viên
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <span className="text-yellow-400 mr-1">
                              <i className="fas fa-star"></i>
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {instructor.courses?.rating?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedInstructor(instructor);
                              setFormData({
                                firstName: instructor.firstName,
                                lastName: instructor.lastName,
                                email: instructor.email,
                                specialization: instructor.specialization || '',
                                bio: instructor.bio || '',
                                status: instructor.status || 'Active',
                                rating: instructor.courses?.rating || 0,
                                totalCourses: instructor.courses?.total || 0
                              });
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteInstructor(instructor.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Add Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Thêm Giảng viên</h2>
            <form onSubmit={handleAddInstructor}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tên</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Họ</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Chuyên môn</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tiểu sử</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Instructor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Sửa Giảng viên</h2>
            <form onSubmit={handleEditInstructor}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tên</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Họ</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Chuyên môn</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tiểu sử</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default InstructorManagement; 
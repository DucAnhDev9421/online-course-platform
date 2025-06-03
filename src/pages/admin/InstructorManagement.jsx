import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InstructorManagement = () => {
  const { user } = useUser();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7261/api/instructors');
      setInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách giảng viên');
    } finally {
      setLoading(false);
    }
  };

  // Filter instructors based on search query
  const filteredInstructors = instructors.filter(instructor =>
    instructor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold gradient-text">Quản lý Giảng viên</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm Giảng viên
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm giảng viên..."
          className="w-full p-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Instructors Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách giảng viên...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên môn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa học</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentInstructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={instructor.imageUrl || 'https://via.placeholder.com/40'}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {instructor.firstName} {instructor.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{instructor.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{instructor.specialization}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm text-gray-900">{instructor.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{instructor.totalCourses}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      instructor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {instructor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedInstructor(instructor);
                        setFormData({
                          firstName: instructor.firstName,
                          lastName: instructor.lastName,
                          email: instructor.email,
                          specialization: instructor.specialization,
                          bio: instructor.bio,
                          status: instructor.status,
                          rating: instructor.rating,
                          totalCourses: instructor.totalCourses
                        });
                        setShowEditModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteInstructor(instructor.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </nav>
        </div>
      )}

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
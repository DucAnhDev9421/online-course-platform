import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/admin.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDesc, setEditCategoryDesc] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tách hàm fetchCategories ra khỏi useEffect để có thể gọi lại
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('https://localhost:7261/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách danh mục:', error);
      setMessage('Lỗi lấy danh sách danh mục!');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load danh sách danh mục khi trang được mở
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setMessage('Vui lòng nhập tên danh mục!');
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('https://localhost:7261/api/categories', {
        name: categoryName,
        description: categoryDesc
      });
      setMessage('Thêm danh mục thành công!');
      setMessageType('success');
      setCategoryName('');
      setCategoryDesc('');
      // Gọi lại fetchCategories để cập nhật danh sách
      await fetchCategories();
    } catch (error) {
      console.error('Lỗi thêm danh mục:', error);
      setMessage('Lỗi thêm danh mục!');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDeleteCategory = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://localhost:7261/api/categories/${id}`);
      setMessage('Đã xóa danh mục!');
      setMessageType('success');
      // Gọi lại fetchCategories để cập nhật danh sách
      await fetchCategories();
    } catch (error) {
      console.error('Lỗi xóa danh mục:', error);
      setMessage('Lỗi xóa danh mục!');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
    setTimeout(() => setMessage(''), 2000);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
    setEditCategoryDesc(category.description);
  };

  const handleSaveEdit = async (id) => {
    if (!editCategoryName.trim()) {
      setMessage('Vui lòng nhập tên danh mục!');
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    try {
      await axios.put(`https://localhost:7261/api/categories/${id}`, {
        name: editCategoryName,
        description: editCategoryDesc
      });
      setMessage('Cập nhật danh mục thành công!');
      setMessageType('success');
      setEditingCategory(null);
      // Gọi lại fetchCategories để cập nhật danh sách
      await fetchCategories();
    } catch (error) {
      console.error('Lỗi cập nhật danh mục:', error);
      setMessage('Lỗi cập nhật danh mục!');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
    setTimeout(() => setMessage(''), 2000);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName('');
    setEditCategoryDesc('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Quản lý Danh mục</h2>
      {message && (
        <div className={`mb-6 text-center py-2 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
      )}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Thêm danh mục</h3>
        <form onSubmit={handleAddCategory} className="flex flex-row gap-4">
          <input
            type="text"
            className="admin-input flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tên danh mục..."
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
            disabled={isLoading}
          />
          <textarea
            className="admin-input flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mô tả (không bắt buộc)"
            value={categoryDesc}
            onChange={e => setCategoryDesc(e.target.value)}
            rows={1}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </div>
            ) : (
              <>
                <i className="fas fa-plus mr-2"></i> Thêm danh mục
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="mb-4 font-semibold text-blue-700 text-lg">Danh sách danh mục</h4>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên danh mục</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-400 italic py-4">Chưa có danh mục nào</td>
                  </tr>
                ) : categories.map(cat => (
                  <tr key={cat.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {editingCategory === cat.id ? (
                        <input
                          type="text"
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          disabled={isLoading}
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-500 text-sm">
                      {editingCategory === cat.id ? (
                        <textarea
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={editCategoryDesc}
                          onChange={(e) => setEditCategoryDesc(e.target.value)}
                          rows={1}
                          disabled={isLoading}
                        />
                      ) : (
                        cat.description || <span className="italic text-gray-300">(Không có)</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {editingCategory === cat.id ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleSaveEdit(cat.id)}
                            className="text-green-500 hover:text-green-700 px-2 py-1 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Lưu thay đổi"
                            disabled={isLoading}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Hủy"
                            disabled={isLoading}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditCategory(cat)}
                            className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Sửa danh mục"
                            disabled={isLoading}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xóa danh mục"
                            disabled={isLoading}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories; 
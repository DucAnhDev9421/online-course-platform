import React, { useState } from 'react';
import '../assets/css/admin.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Lập trình', description: 'Các khóa học về lập trình' },
    { id: 2, name: 'Thiết kế', description: 'Các khóa học về thiết kế' },
    { id: 3, name: 'Kinh doanh', description: 'Các khóa học về kinh doanh' },
  ]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDesc, setEditCategoryDesc] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setMessage('Đã xóa danh mục!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
    setEditCategoryDesc(category.description);
  };

  const handleSaveEdit = (id) => {
    if (!editCategoryName.trim()) {
      setMessage('Vui lòng nhập tên danh mục!');
      setMessageType('error');
      return;
    }
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { ...cat, name: editCategoryName, description: editCategoryDesc }
        : cat
    ));
    setMessage('Cập nhật danh mục thành công!');
    setMessageType('success');
    setEditingCategory(null);
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
          />
          <textarea
            className="admin-input flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mô tả (không bắt buộc)"
            value={categoryDesc}
            onChange={e => setCategoryDesc(e.target.value)}
            rows={1}
          />
          <button type="submit" className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all min-w-[150px]">
            <i className="fas fa-plus mr-2"></i> Thêm danh mục
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
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
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {editingCategory === cat.id ? (
                      <input
                        type="text"
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
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
                          className="text-green-500 hover:text-green-700 px-2 py-1 rounded transition-all"
                          title="Lưu thay đổi"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-all"
                          title="Hủy"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition-all"
                          title="Sửa danh mục"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all"
                          title="Xóa danh mục"
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
        </div>
      </div>
    </div>
  );
};

export default AdminCategories; 
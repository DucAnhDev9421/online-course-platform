import React, { useState } from 'react';

const initialUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Học viên' },
  { id: 2, name: 'Trần Thị B', email: 'b@example.com', role: 'Giảng viên' },
  { id: 3, name: 'Lê Văn C', email: 'c@example.com', role: 'Quản trị viên' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    setMessage('Đã xóa người dùng!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Quản lý Người dùng</h2>
      {message && (
        <div className={`mb-6 text-center py-2 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
      )}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <h4 className="font-semibold text-blue-700 text-lg flex-1">Danh sách người dùng</h4>
          <div className="flex items-center">
            <input
              type="text"
              className="admin-input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm theo tên hoặc email..."
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
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Vai trò</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 italic py-4">Không tìm thấy người dùng</td>
                </tr>
              )}
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 font-medium text-gray-800">{user.name}</td>
                  <td className="px-4 py-2 text-gray-600">{user.email}</td>
                  <td className="px-4 py-2 text-gray-500 text-sm">{user.role}</td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all" title="Xóa người dùng">
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
  );
};

export default AdminUsers; 
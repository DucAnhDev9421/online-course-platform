import React, { useState } from 'react';

const initialUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Học viên', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', courses: 6, joined: '7 July, 2020' },
  { id: 2, name: 'Trần Thị B', email: 'b@example.com', role: 'Giảng viên', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', courses: 6, joined: '7 July, 2020', students: 50274, rating: 4.5 },
  { id: 3, name: 'Lê Văn C', email: 'c@example.com', role: 'Quản trị viên' },
  { id: 4, name: 'Guy Hawkins', email: 'guy@example.com', role: 'Giảng viên', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', courses: 6, joined: '7 July, 2020', students: 50274, rating: 4.5 },
  { id: 5, name: 'Dianna Smiley', email: 'dianna@example.com', role: 'Giảng viên', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', courses: 3, joined: '6 July, 2020', students: 26060, rating: 4.5 },
  { id: 6, name: 'Nia Sikhone', email: 'nia@example.com', role: 'Giảng viên', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', courses: 12, joined: '12 June, 2020', students: 8234, rating: 4.5 },
  { id: 7, name: 'Jacob Jones', email: 'jacob@example.com', role: 'Học viên', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', courses: 7, joined: '12 Aug, 2020' },
  { id: 8, name: 'Dianna Smiley', email: 'dianna.student@example.com', role: 'Học viên', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', courses: 3, joined: '15 Aug, 2020' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [userTab, setUserTab] = useState('student'); // 'student' hoặc 'teacher'

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    setMessage('Đã xóa người dùng!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  // Lọc theo tab
  const filteredUsers = users.filter(u =>
    (userTab === 'student' ? u.role === 'Học viên' : u.role === 'Giảng viên') &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
     u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Quản lý Người dùng</h2>
      {message && (
        <div className={`mb-6 text-center py-2 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
      )}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {/* Tabs chuyển đổi */}
        <div className="flex mb-4">
          <button
            className={`px-4 py-2 font-semibold rounded-l ${userTab === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setUserTab('student')}
          >
            Học viên
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-r ${userTab === 'teacher' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setUserTab('teacher')}
          >
            Giảng viên
          </button>
        </div>
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
          {userTab === 'teacher' ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Tên</th>
                  <th className="px-4 py-2 text-center">Số khóa học</th>
                  <th className="px-4 py-2 text-center">Ngày tham gia</th>
                  <th className="px-4 py-2 text-center">Số học viên</th>
                  <th className="px-4 py-2 text-center">Đánh giá</th>
                  <th className="px-4 py-2 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-400 italic py-4">Không có giảng viên nào</td>
                  </tr>
                )}
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="font-semibold">{user.name}</span>
                    </td>
                    <td className="px-4 py-2 text-center">{user.courses} khóa học</td>
                    <td className="px-4 py-2 text-center">{user.joined}</td>
                    <td className="px-4 py-2 text-center">{user.students.toLocaleString()}</td>
                    <td className="px-4 py-2 text-center">{user.rating} <i className="fas fa-star text-yellow-400"></i></td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all" title="Xóa người dùng">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Tên</th>
                  <th className="px-4 py-2 text-center">Khóa học đã đăng ký</th>
                  <th className="px-4 py-2 text-center">Ngày tham gia</th>
                  <th className="px-4 py-2 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-400 italic py-4">Không có học viên nào</td>
                  </tr>
                )}
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="font-semibold">{user.name}</span>
                    </td>
                    <td className="px-4 py-2 text-center">{user.courses} khóa học</td>
                    <td className="px-4 py-2 text-center">{user.joined}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all" title="Xóa người dùng">
                        <i className="fas fa-trash"></i>
                      </button>
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

export default AdminUsers; 
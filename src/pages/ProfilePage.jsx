//ProfilePage.jsx
import { useNavigate } from 'react-router-dom';

export default function ProfilePage({ userData, onClose }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profileuser'); // Điều hướng đến trang ProfileUser
  };
  const handleLogout = () => {
    // Xóa thông tin người dùng (nếu cần)
    // Ví dụ: localStorage.removeItem('userToken');
    navigate('/login'); // Điều hướng về trang chủ
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
      <div className="px-4 py-2 border-b border-gray-200">
        <p className="text-sm font-medium">Xin chào, {userData.name}</p>
        <p className="text-xs text-gray-500">{userData.email}</p>
      </div>
      <button
        onClick={handleProfileClick}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Hồ sơ của tôi
      </button>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Khóa học của tôi</a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Danh sách yêu thích</a>
      <div className="border-t border-gray-200"></div>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cài đặt</a>
      <button
        onClick={handleLogout} // Thêm sự kiện onClick
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Đăng xuất
      </button>
    </div>
  );
}
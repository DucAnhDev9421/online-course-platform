//ProfilePage.jsx
// eslint-disable-next-line no-unused-vars
export default function ProfilePage({ userData, onClose }) {
    return (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
        <div className="px-4 py-2 border-b border-gray-200">
          <p className="text-sm font-medium">Xin chào, {userData.name}</p>
          <p className="text-xs text-gray-500">{userData.email}</p>
        </div>
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ sơ của tôi</a>
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Khóa học của tôi</a>
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Danh sách yêu thích</a>
        <div className="border-t border-gray-200"></div>
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cài đặt</a>
        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng xuất</a>
      </div>
    );
  }
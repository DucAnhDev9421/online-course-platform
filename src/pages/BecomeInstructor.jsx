import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function BecomeInstructor() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!user?.id) {
      toast.error('Bạn cần đăng nhập để đăng ký làm giảng viên!');
      return;
    }
    setLoading(true);
    try {
      // Gọi API PUT để cấp quyền Instructor
      await axios.put(`https://localhost:7261/api/users/${user.id}/role`, { role: 'Instructor' });
      toast.success('Đăng ký làm giảng viên thành công!');
      setTimeout(() => {
        navigate('/teaching');
      }, 1500);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-blue-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full border border-purple-100">
        <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">Đăng ký làm Giảng viên</h1>
        <p className="text-gray-600 mb-6 text-center">
          Trở thành giảng viên để chia sẻ kiến thức, xây dựng thương hiệu cá nhân và kiếm thêm thu nhập từ các khóa học của bạn!
        </p>
        <ul className="mb-8 space-y-2 text-gray-700">
          <li>✅ Tạo và quản lý khóa học của riêng bạn</li>
          <li>✅ Nhận thu nhập từ học viên đăng ký</li>
          <li>✅ Hỗ trợ xây dựng thương hiệu cá nhân</li>
          <li>✅ Tham gia cộng đồng giảng viên chuyên nghiệp</li>
        </ul>
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <span className="loader border-white border-t-purple-600 mr-2"></span>}
          Đăng ký làm giảng viên
        </button>
        <style>{`
          .loader {
            border: 3px solid #fff;
            border-top: 3px solid #a78bfa;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
} 
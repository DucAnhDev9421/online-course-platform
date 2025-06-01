import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

export default function Cart() {
  const [cartCourses, setCartCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          alert('Vui lòng đăng nhập để xem giỏ hàng');
          navigate('/login');
          return;
        }
        const response = await axios.get('https://localhost:7261/api/Cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setCartCourses(response.data);
      } catch (error) {
        console.error('Lỗi lấy giỏ hàng:', error);
        setCartCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [getToken, navigate]);

  if (loading) {
    return <div>Đang tải giỏ hàng...</div>;
  }

  const handleGoToCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleRemove = async (courseId) => {
    try {
      const token = await getToken();
      await axios.delete(`https://localhost:7261/api/Cart/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCartCourses(cartCourses.filter(item => item.courseId !== courseId));
      toast.success('Đã xóa khóa học khỏi giỏ hàng!');
    } catch (error) {
      toast.error('Lỗi khi xóa khóa học khỏi giỏ hàng!');
      console.error(error);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
    try {
      const token = await getToken();
      await axios.delete('https://localhost:7261/api/Cart/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCartCourses([]);
      toast.success('Đã xóa toàn bộ giỏ hàng!');
    } catch (error) {
      toast.error('Lỗi khi xóa toàn bộ giỏ hàng!');
      console.error(error);
    }
  };

  // Calculate total price
  const totalPrice = cartCourses.reduce((sum, item) => sum + (item.course.price || 0), 0);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-white to-purple-50 py-12 px-2">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-left text-gray-800">Giỏ hàng</h1>
        {cartCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl shadow-lg">
            <svg className="mb-6 w-24 h-24 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="text-lg text-gray-500 mb-2 font-medium">Giỏ hàng của bạn đang trống.</div>
            <Link to="/courses" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition font-semibold">Khám phá khóa học</Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* LEFT: Course List */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-gray-700 text-base font-semibold">
                  {cartCourses.length} khóa học trong giỏ hàng
                </div>
              </div>
              <ul className="divide-y divide-gray-100">
                {cartCourses.map(item => (
                  <li key={item.cartItemId} className="flex flex-row items-center gap-6 py-6">
                    <img src={item.course.imageUrl || '/default-course.png'} alt={item.course.name} className="w-28 h-20 object-cover rounded-lg shadow border" />
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-bold text-lg text-gray-800 cursor-pointer hover:text-purple-700 transition" onClick={() => handleGoToCourse(item.courseId)}>{item.course.name}</div>
                          <div className="flex items-center gap-2 mt-1 mb-1">
                            <span className="text-sm text-gray-500">Bởi {item.course.instructor.name}</span>
                            {/* Badge bán chạy nhất */}
                            <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Bán chạy nhất</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-yellow-500 font-bold text-base flex items-center">
                              {item.course.rating > 0 ? (
                                <>
                                  {item.course.rating.toFixed(1)}
                                  <span className="ml-1">★</span>
                                </>
                              ) : 'Chưa có đánh giá'}
                            </span>
                            {item.course.totalRatings > 0 && (
                              <span className="text-xs text-gray-500">({item.course.totalRatings.toLocaleString('vi-VN')} xếp hạng)</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>Tổng số {Math.round(item.course.totalDuration / 60 * 10) / 10} giờ</span>
                            <span>•</span>
                            <span>{item.course.totalLessons} bài giảng</span>
                            <span>•</span>
                            <span>{item.course.level}</span>
                          </div>
                          <div className="flex gap-4 mt-2">
                            <button className="text-purple-600 text-sm hover:underline">Lưu để mua sau</button>
                            <button className="text-purple-600 text-sm hover:underline">Chuyển vào danh sách mong ước</button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                          <button onClick={() => handleRemove(item.courseId)} className="text-purple-600 text-sm hover:underline">Xóa</button>
                          <div className="text-xl font-bold text-purple-700 flex items-center gap-1">
                            {item.course.price === 0 ? 'Miễn phí' : item.course.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            <span className="ml-1">{item.course.price > 0 && <span className="inline-block align-middle">🏷️</span>}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* RIGHT: Total & Checkout */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-start">
                <div className="text-lg font-semibold text-gray-700 mb-2">Tổng:</div>
                <div className="text-3xl font-extrabold text-gray-900 mb-6">{totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                <button className="w-full bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-purple-800 transition mb-2 flex items-center justify-center gap-2">
                  Tiến hành thanh toán <span className="text-2xl">→</span>
                </button>
                <div className="text-xs text-gray-500 mt-1">Bạn sẽ không bị tính phí ngay bây giờ</div>
                <button onClick={handleClearCart} className="w-full mt-4 bg-red-100 text-red-600 px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-red-200 transition border border-red-200">Xóa giỏ hàng</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
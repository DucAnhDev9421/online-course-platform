import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

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
    } catch (error) {
      alert('Lỗi khi xóa khóa học khỏi giỏ hàng!');
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
    } catch (error) {
      alert('Lỗi khi xóa toàn bộ giỏ hàng!');
      console.error(error);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-white to-purple-50 py-12 px-2">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-700 drop-shadow">Giỏ hàng</h1>
        {cartCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl shadow-lg">
            <svg className="mb-6 w-24 h-24 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="text-lg text-gray-500 mb-2 font-medium">Giỏ hàng của bạn đang trống.</div>
            <Link to="/courses" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition font-semibold">Khám phá khóa học</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-gray-700 text-lg font-semibold">Tổng số khóa học: <span className="text-purple-700">{cartCourses.length}</span></div>
              <Link to="/courses" className="text-purple-600 hover:underline text-sm">+ Thêm khóa học khác</Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {cartCourses.map(item => (
                <li key={item.cartItemId} className="flex flex-col sm:flex-row items-center gap-4 py-6">
                  <img src={item.course.imageUrl || '/default-course.png'} alt={item.course.name} className="w-28 h-20 object-cover rounded-lg shadow" />
                  <div className="flex-1 w-full">
                    <div className="font-bold text-lg text-gray-800 cursor-pointer hover:text-purple-700 transition" onClick={() => handleGoToCourse(item.courseId)}>{item.course.name}</div>
                    <div className="text-gray-500 text-sm mb-1">{item.course.category}</div>
                    <div className="text-purple-600 font-semibold text-base">
                      {item.course.price === 0 ? 'Miễn phí' : item.course.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                  </div>
                  <button onClick={() => handleRemove(item.courseId)} className="ml-0 sm:ml-4 px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition font-semibold">Xóa</button>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
              <button className="bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-purple-800 transition">Thanh toán</button>
              <button onClick={handleClearCart} className="bg-red-100 text-red-600 px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-red-200 transition border border-red-200">Xóa giỏ hàng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
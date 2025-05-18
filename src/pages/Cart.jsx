import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartCourses, setCartCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('cartCourses');
    setCartCourses(stored ? JSON.parse(stored) : []);
  }, []);

  const handleRemove = (id) => {
    const updated = cartCourses.filter(c => c.id !== id);
    setCartCourses(updated);
    localStorage.setItem('cartCourses', JSON.stringify(updated));
  };

  const handleGoToCourse = (id) => {
    navigate(`/courses/${id}`);
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
              {cartCourses.map(course => (
                <li key={course.id} className="flex flex-col sm:flex-row items-center gap-4 py-6">
                  <img src={course.thumbnail || '/default-course.png'} alt={course.title} className="w-28 h-20 object-cover rounded-lg shadow" />
                  <div className="flex-1 w-full">
                    <div className="font-bold text-lg text-gray-800 cursor-pointer hover:text-purple-700 transition" onClick={() => handleGoToCourse(course.id)}>{course.title}</div>
                    <div className="text-gray-500 text-sm mb-1">{course.category}</div>
                    <div className="text-purple-600 font-semibold text-base">
                      {course.price === 0 ? 'Miễn phí' : course.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                  </div>
                  <button onClick={() => handleRemove(course.id)} className="ml-0 sm:ml-4 px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition font-semibold">Xóa</button>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
              <button className="bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-purple-800 transition">Thanh toán</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
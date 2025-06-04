import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setFavoriteCourses([]);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`https://localhost:7261/api/users/${user.id}/favorites`);
        setFavoriteCourses(res.data || []);
      } catch (err) {
        setFavoriteCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  // Xóa khỏi danh sách yêu thích (chỉ xóa khỏi state, không gọi API)
  const handleRemoveFavorite = (courseId) => {
    setFavoriteCourses(favoriteCourses.filter(course => course.id !== courseId));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">Đang tải danh sách yêu thích...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Khóa học yêu thích</h1>
          <span className="text-gray-600">{favoriteCourses.length} khóa học</span>
        </div>

        {favoriteCourses.length === 0 ? (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có khóa học yêu thích</h3>
            <p className="text-gray-500 mb-4">Hãy khám phá và thêm các khóa học bạn yêu thích vào đây</p>
            <button
              onClick={() => navigate('/courses')}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
            >
              Khám phá khóa học
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCourses.map(course => (
              <div key={course.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={course.imageUrl} 
                    alt={course.name} 
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  />
                  {course.price === 0 && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Miễn phí
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveFavorite(course.id)}
                    className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500 group-hover:text-red-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 
                    className="font-bold text-lg mb-2 cursor-pointer hover:text-blue-700"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    {course.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="text-yellow-500 font-semibold mr-1">★ {course.averageRating}</span>
                    <span className="ml-2">{course.enrollmentCount} học viên</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-purple-700">
                      {course.price === 0 ? 'Miễn phí' : course.price.toLocaleString('vi-VN', {style:'currency', currency:'VND'})}
                    </span>
                    <button 
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 
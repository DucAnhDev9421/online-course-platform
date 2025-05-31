// components/CourseCard.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function CourseCard({
  title, instructor, price, rating, students, image, id,
  description = "Khóa học này sẽ giúp bạn nắm vững kiến thức cơ bản về lĩnh vực này.",
  duration = 10, // tổng số giờ hoặc chuỗi thời lượng
  level = "Sơ cấp" // trình độ
}) {
  const [showPopover, setShowPopover] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // instructor có thể là string hoặc object
  let avatarUrl = '';
  let instructorName = '';
  if (typeof instructor === 'object' && instructor !== null) {
    avatarUrl = instructor.imageUrl || instructor.profileImageUrl || instructor.image_url || instructor.profile_image_url || 'https://ui-avatars.com/api/?name=GV&background=random';
    instructorName = instructor.username || instructor.first_name || instructor.firstName || instructor.name || 'Giảng viên';
  } else {
    instructorName = instructor || 'Giảng viên';
    avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(instructorName) + '&background=random';
  }

  // Dữ liệu topic mẫu
  const topics = [
    "Giới thiệu về AWS Cloud",
    "Các dịch vụ cơ bản của AWS",
    "Thực hành triển khai ứng dụng"
  ];

  // Fetch chi tiết khi hover
  const handleMouseEnter = async () => {
    setShowPopover(true);
    if (!detail) {
      setLoading(true);
      try {
        const res = await axios.get(`https://localhost:7261/api/courses/${id}`);
        setDetail(res.data);
      } catch (e) {
        // fallback: không làm gì, dùng prop mặc định
      }
      setLoading(false);
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowPopover(false)}
    >
      <Link to={`/courses/${id}`} className="block">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border border-gray-100">
          <div className="relative">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            {price === 0 && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Miễn phí
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors duration-200">{title}</h3>
            <div className="flex items-center mb-3">
              <img
                src={avatarUrl}
                alt={instructorName}
                className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-white shadow-sm"
              />
              <span className="text-gray-600 text-sm font-medium">{instructorName}</span>
            </div>
            <div className="flex items-center mb-3">
              <span className="text-yellow-500 font-bold mr-1">{rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-sm ml-1">({students})</span>
            </div>
            <div className="font-bold text-lg text-purple-700">
              {price === 0 ? <span className="text-green-600">Miễn phí</span> : price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </div>
          </div>
        </div>
      </Link>
      {/* Popover */}
      {showPopover && (
        <div className="absolute z-50 left-full top-1/2 -translate-y-1/2 ml-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 animate-fade-in">
          {loading ? (
            <div className="text-gray-500">Đang tải...</div>
          ) : (
            <>
              <h3 className="font-bold text-lg mb-2">{detail?.name || title}</h3>
              <div className="flex gap-4 mb-2 text-sm text-gray-600">
                <span>🕒 {detail?.totalDuration || duration}</span>
                <span>•</span>
                <span>Trình độ: {detail?.levelText || level}</span>
              </div>
              <div className="text-gray-700 mb-3" dangerouslySetInnerHTML={{ __html: detail?.description || description }} />
              <ul className="list-disc pl-5 mb-2 text-sm text-gray-700">
                {topics.map((topic, idx) => <li key={idx}>{topic}</li>)}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
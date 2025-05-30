// components/CourseCard.jsx
import { Link } from 'react-router-dom';

export default function CourseCard({ title, instructor, price, rating, students, image, id }) {
  // instructor có thể là string hoặc object
  let avatarUrl = '';
  let instructorName = '';
  if (typeof instructor === 'object' && instructor !== null) {
    avatarUrl = instructor.image_url || instructor.profile_image_url || 'https://ui-avatars.com/api/?name=GV&background=random';
    instructorName = instructor.username || instructor.first_name || instructor.firstName || instructor.name || 'Giảng viên';
  } else {
    instructorName = instructor || 'Giảng viên';
    avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(instructorName) + '&background=random';
  }

  return (
    <Link to={`/courses/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div>
          <img src={image} alt={title} className="w-full h-40 object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{title}</h3>
          <div className="flex items-center mb-2">
            <img
              src={avatarUrl}
              alt={instructorName}
              className="w-7 h-7 rounded-full object-cover mr-2 border border-gray-200"
            />
            <span className="text-gray-600 text-sm">{instructorName}</span>
          </div>
          <div className="flex items-center mb-2">
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
          <div className="font-bold text-lg">
            {price === 0 ? <span className="text-red-600">Miễn phí</span> : price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </div>
        </div>
      </div>
    </Link>
  )
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
  const navigate = useNavigate();
  // Sample course data
  const [courses, setCourses] = useState([
    { id: 1, title: 'React Fundamentals', category: 'Frontend', price: 49.99, rating: 4.5, students: 1200, image: 'https://via.placeholder.com/300x200' },
    { id: 2, title: 'Node.js Advanced', category: 'Backend', price: 59.99, rating: 4.7, students: 850, image: 'https://via.placeholder.com/300x200' },
    { id: 3, title: 'UI/UX Design', category: 'Design', price: 39.99, rating: 4.3, students: 1500, image: 'https://via.placeholder.com/300x200' },
    { id: 4, title: 'Python for Beginners', category: 'Programming', price: 29.99, rating: 4.8, students: 2000, image: 'https://via.placeholder.com/300x200' },
    { id: 5, title: 'DevOps Essentials', category: 'DevOps', price: 69.99, rating: 4.6, students: 700, image: 'https://via.placeholder.com/300x200' },
    { id: 6, title: 'Mobile App Development', category: 'Mobile', price: 54.99, rating: 4.4, students: 950, image: 'https://via.placeholder.com/300x200' },
  ]);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  // Get unique categories
  const categories = ['All', ...new Set(courses.map(course => course.category))];

  // Filter courses based on filters
  const filteredCourses = courses.filter(course => {
    return (
      (categoryFilter === 'All' || course.category === categoryFilter) &&
      (priceFilter === 'All' || 
        (priceFilter === 'Free' ? course.price === 0 : 
         priceFilter === '<50' ? course.price < 50 :
         priceFilter === '50-100' ? course.price >= 50 && course.price <= 100 :
         course.price > 100)) &&
      course.rating >= ratingFilter &&
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, priceFilter, ratingFilter, searchQuery]);

  // Xử lý khi click vào nút xem chi tiết
  const handleViewDetail = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Danh sách khóa học</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <input
              type="text"
              placeholder="Tên khóa học..."
              className="w-full p-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              className="w-full p-2 border rounded-md"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
            <select
              className="w-full p-2 border rounded-md"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="All">Tất cả</option>
              <option value="Free">Miễn phí</option>
              <option value="<50">Dưới $50</option>
              <option value="50-100">$50 - $100</option>
              <option value=">100">Trên $100</option>
            </select>
          </div>
          
          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá từ {ratingFilter}★</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              className="w-full"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      {/* Course List - Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {currentCourses.length > 0 ? (
          currentCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{course.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{course.category}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">★ {course.rating}</span>
                  <span className="text-gray-500 text-sm ml-2">({course.students} học viên)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${course.price}</span>
                  <button 
                    onClick={() => handleViewDetail(course.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Không tìm thấy khóa học phù hợp</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredCourses.length > coursesPerPage && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow">
            {Array.from({ length: Math.ceil(filteredCourses.length / coursesPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {index + 1}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default CourseList;
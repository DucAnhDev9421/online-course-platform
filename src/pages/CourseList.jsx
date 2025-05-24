import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LEVELS = [
  { value: 'beginner', label: 'Sơ cấp' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'expert', label: 'Chuyên gia' },
];

const DURATIONS = [
  { value: '<2', label: 'Dưới 2 giờ' },
  { value: '2-10', label: '2 - 10 giờ' },
  { value: '10-20', label: '10 - 20 giờ' },
  { value: '>20', label: 'Trên 20 giờ' },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
];


const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [showFilter, setShowFilter] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState([]);
  const [durationFilter, setDurationFilter] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [openAccordion, setOpenAccordion] = useState({ rating: true, duration: false, level: false, price: false, category: false });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  // Get unique categories
  const categories = ['All', ...new Set(courses.map(course => course.category))];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://localhost:7261/api/courses');
        const mappedCourses = response.data.map(course => ({
          id: course.id,
          title: course.name,
          price: course.price,
          description: course.description,
          level: course.levelText.toLowerCase(),
          category: course.categoryName,
          rating: 4.5, // Default value since not provided by API
          students: 0, // Default value since not provided by API
          image: 'https://almablog-media.s3.ap-south-1.amazonaws.com/medium_React_Fundamentals_56e32fd939.png', // Default image
          duration: 10 // Default value since not provided by API
        }));
        setCourses(mappedCourses);
      } catch (err) {
        setError('Failed to fetch courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter logic
  let filteredCourses = courses.filter(course => {
    const matchCategory = categoryFilter === 'All' || course.category === categoryFilter;
    const matchPrice = priceFilter === 'All' || (priceFilter === 'free' ? course.price === 0 : course.price > 0);
    const matchRating = course.rating >= ratingFilter;
    const matchLevel = levelFilter.length === 0 || levelFilter.includes(course.level);
    let matchDuration = true;
    if (durationFilter) {
      if (durationFilter === '<2') matchDuration = course.duration < 2;
      else if (durationFilter === '2-10') matchDuration = course.duration >= 2 && course.duration <= 10;
      else if (durationFilter === '10-20') matchDuration = course.duration > 10 && course.duration <= 20;
      else if (durationFilter === '>20') matchDuration = course.duration > 20;
    }
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchPrice && matchRating && matchLevel && matchDuration && matchSearch;
  });

  // Sort logic
  if (sortOption === 'price-asc') filteredCourses.sort((a, b) => a.price - b.price);
  if (sortOption === 'price-desc') filteredCourses.sort((a, b) => b.price - a.price);
  if (sortOption === 'newest') filteredCourses.sort((a, b) => b.id - a.id);
  if (sortOption === 'popular') filteredCourses.sort((a, b) => b.students - a.students);

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  useEffect(() => { 
    setCurrentPage(1); 
  }, [categoryFilter, priceFilter, ratingFilter, searchQuery, levelFilter, durationFilter]);

  const handleViewDetail = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const toggleAccordion = (key) => setOpenAccordion(prev => ({ ...prev, [key]: !prev[key] }));

  const handleLevelChange = (level) => {
    setLevelFilter(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setEnrolledCourses(stored);
  }, []);

  const handleEnrollClick = (course) => {
    const isAlreadyEnrolled = enrolledCourses.some(c => c.id === course.id);
    if (isAlreadyEnrolled) {
      alert('Bạn đã đăng ký khóa học này rồi!');
      return;
    }
    setSelectedCourse(course);
    setShowConfirmModal(true);
  };

  const handleConfirmEnroll = () => {
    if (!selectedCourse) return;

    const newEnrolled = [
      ...enrolledCourses,
      {
        id: selectedCourse.id,
        title: selectedCourse.title,
        thumbnail: selectedCourse.image,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        lastAccessed: new Date().toISOString()
      }
    ];
    localStorage.setItem('enrolledCourses', JSON.stringify(newEnrolled));
    setEnrolledCourses(newEnrolled);
    setShowConfirmModal(false);
    setSelectedCourse(null);
    alert(`Đăng ký thành công khóa học: ${selectedCourse.title}`);
    navigate(`/courses/${selectedCourse.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách khóa học...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      ) : (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilter(v => !v)} className="border px-4 py-2 rounded-md font-semibold bg-white shadow hover:bg-gray-50">
            <i className="fas fa-filter mr-2"></i> Bộ lọc
          </button>
          <span className="text-gray-500 text-sm">{filteredCourses.length} kết quả</span>
        </div>
        <div>
          <label className="mr-2 font-medium">Sắp xếp theo</label>
          <select
            className="border px-3 py-2 rounded-md"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      )}
      <div className="flex gap-8">
        {/* Sidebar filter */}
        {showFilter && (
          <aside className="w-72 bg-white rounded-lg shadow p-4 h-fit sticky top-8 self-start min-w-[260px]">
            {/* Danh mục */}
            <div className="mb-4">
              <button className="w-full flex justify-between items-center font-semibold text-left" onClick={() => toggleAccordion('category')}>
                Danh mục <i className={`fas fa-chevron-${openAccordion.category ? 'up' : 'down'} text-xs`}></i>
              </button>
              {openAccordion.category && (
                <div className="mt-2 space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        className="mr-2"
                        checked={categoryFilter === category}
                        onChange={() => setCategoryFilter(category)}
                      />
                      <span className="text-gray-700 text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* Xếp hạng */}
            <div className="mb-4">
              <button className="w-full flex justify-between items-center font-semibold text-left" onClick={() => toggleAccordion('rating')}>
                Xếp hạng <i className={`fas fa-chevron-${openAccordion.rating ? 'up' : 'down'} text-xs`}></i>
              </button>
              {openAccordion.rating && (
                <div className="mt-2 space-y-2">
                  {[4.5, 4, 3.5, 3].map((star, idx) => (
                    <label key={star} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        className="mr-2"
                        checked={ratingFilter === star}
                        onChange={() => setRatingFilter(star)}
                      />
                      <span className="text-yellow-500 mr-1">{'★'.repeat(Math.round(star))}</span>
                      <span className="text-gray-700 text-sm">Từ {star} trở lên</span>
                    </label>
                  ))}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="mr-2"
                      checked={ratingFilter === 0}
                      onChange={() => setRatingFilter(0)}
                    />
                    <span className="text-gray-700 text-sm">Tất cả</span>
                  </label>
                </div>
              )}
            </div>
            {/* Thời lượng video */}
            <div className="mb-4">
              <button className="w-full flex justify-between items-center font-semibold text-left" onClick={() => toggleAccordion('duration')}>
                Thời lượng video <i className={`fas fa-chevron-${openAccordion.duration ? 'up' : 'down'} text-xs`}></i>
              </button>
              {openAccordion.duration && (
                <div className="mt-2 space-y-2">
                  {DURATIONS.map(d => (
                    <label key={d.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="duration"
                        className="mr-2"
                        checked={durationFilter === d.value}
                        onChange={() => setDurationFilter(d.value)}
                      />
                      <span className="text-gray-700 text-sm">{d.label}</span>
                    </label>
                  ))}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="duration"
                      className="mr-2"
                      checked={durationFilter === ''}
                      onChange={() => setDurationFilter('')}
                    />
                    <span className="text-gray-700 text-sm">Tất cả</span>
                  </label>
                </div>
              )}
            </div>
            {/* Cấp độ */}
            <div className="mb-4">
              <button className="w-full flex justify-between items-center font-semibold text-left" onClick={() => toggleAccordion('level')}>
                Cấp độ <i className={`fas fa-chevron-${openAccordion.level ? 'up' : 'down'} text-xs`}></i>
              </button>
              {openAccordion.level && (
                <div className="mt-2 space-y-2">
                  {LEVELS.map(lv => (
                    <label key={lv.value} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={levelFilter.includes(lv.value)}
                        onChange={() => handleLevelChange(lv.value)}
                      />
                      <span className="text-gray-700 text-sm">{lv.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* Giá */}
            <div className="mb-4">
              <button className="w-full flex justify-between items-center font-semibold text-left" onClick={() => toggleAccordion('price')}>
                Giá <i className={`fas fa-chevron-${openAccordion.price ? 'up' : 'down'} text-xs`}></i>
              </button>
              {openAccordion.price && (
                <div className="mt-2 space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      className="mr-2"
                      checked={priceFilter === 'All'}
                      onChange={() => setPriceFilter('All')}
                    />
                    <span className="text-gray-700 text-sm">Tất cả</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      className="mr-2"
                      checked={priceFilter === 'free'}
                      onChange={() => setPriceFilter('free')}
                    />
                    <span className="text-gray-700 text-sm">Miễn phí</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      className="mr-2"
                      checked={priceFilter === 'paid'}
                      onChange={() => setPriceFilter('paid')}
                    />
                    <span className="text-gray-700 text-sm">Có phí</span>
                  </label>
                </div>
              )}
            </div>
          </aside>
        )}
        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${showFilter ? '' : 'w-full'}`}>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm tên khóa học..."
              className="w-full p-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Course List - List View */}
          <div className="space-y-6">
            {currentCourses.length > 0 ? (
              currentCourses.map(course => {
                const isEnrolled = enrolledCourses.some(c => c.id === course.id);
                return (
                  <div key={course.id} className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div 
                      className="w-56 h-36 flex-shrink-0 cursor-pointer bg-gray-100 flex items-center justify-center relative"
                      onClick={() => handleViewDetail(course.id)}
                    >
                      <img src={course.image} alt={course.title} className="object-cover w-full h-full" />
                      <div className="absolute top-2 right-2 flex flex-col gap-2">
                        {course.price === 0 && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Miễn phí
                          </span>
                        )}
                        {course.id <= 2 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Mới
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-1 cursor-pointer hover:text-blue-700" onClick={() => handleViewDetail(course.id)}>{course.title}</h3>
                        <div className="text-gray-600 text-sm mb-1">{course.category}</div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <span className="text-yellow-500 font-semibold mr-1">★ {course.rating}</span>
                          <span className="ml-2">{course.students} học viên</span>
                          <span className="ml-2">• {course.duration} giờ</span>
                          <span className="ml-2">• {LEVELS.find(l=>l.value===course.level)?.label}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-lg text-purple-700">{course.price === 0 ? 'Miễn phí' : course.price.toLocaleString('vi-VN', {style:'currency', currency:'VND'})}</span>
                        {isEnrolled ? (
                          <button disabled className="bg-gray-400 text-white px-4 py-2 rounded font-semibold cursor-not-allowed">Đã đăng ký</button>
                        ) : (
                          <button onClick={() => handleEnrollClick(course)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">Đăng ký</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500">Không tìm thấy khóa học phù hợp</div>
            )}
          </div>
          {/* Pagination */}
          {filteredCourses.length > coursesPerPage && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                {Array.from({ length: Math.ceil(filteredCourses.length / coursesPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
      {/* Modal xác nhận đăng ký */}
      {showConfirmModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Xác nhận đăng ký</h3>
            <p className="mb-6">Bạn có chắc chắn muốn đăng ký khóa học "{selectedCourse.title}"?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmEnroll}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
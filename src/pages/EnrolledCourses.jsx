import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {
  const navigate = useNavigate();
  
  // Dữ liệu mẫu cho các khóa học đã đăng ký
  const [enrolledCourses] = useState([
    {
      id: 1,
      title: 'React Fundamentals',
      thumbnail: '/api/placeholder/300/200',
      progress: 75,
      lastAccessed: '2024-02-20',
      totalLessons: 20,
      completedLessons: 15,
      instructor: 'John Doe',
      category: 'Frontend'
    },
    {
      id: 2,
      title: 'Node.js Advanced',
      thumbnail: '/api/placeholder/300/200',
      progress: 30,
      lastAccessed: '2024-02-18',
      totalLessons: 15,
      completedLessons: 5,
      instructor: 'Jane Smith',
      category: 'Backend'
    },
    {
      id: 3,
      title: 'UI/UX Design',
      thumbnail: '/api/placeholder/300/200',
      progress: 100,
      lastAccessed: '2024-02-15',
      totalLessons: 12,
      completedLessons: 12,
      instructor: 'Alex Johnson',
      category: 'Design'
    }
  ]);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Khóa học của tôi</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <div 
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCourseClick(course.id)}
          >
            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {course.category}
                </span>
              </div>
              {course.progress === 100 && (
                <div className="absolute top-2 right-2">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Hoàn thành
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4">Giảng viên: {course.instructor}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tiến độ</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{course.completedLessons}/{course.totalLessons} bài học</span>
                <span>Lần học cuối: {course.lastAccessed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {enrolledCourses.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Chưa có khóa học nào</h3>
          <p className="mt-1 text-gray-500">Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học mới!</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/courses')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Khám phá khóa học
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses; 
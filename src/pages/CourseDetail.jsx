import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [expandedLessonId, setExpandedLessonId] = useState(null);

  // Dữ liệu mẫu cho khóa học (trong thực tế, bạn sẽ fetch từ API)
  const coursesData = [
    {
      id: 1,
      title: 'React Fundamentals',
      category: 'Frontend',
      price: 49.99,
      rating: 4.5,
      students: 1200,
      image: '/api/placeholder/600/400',
      instructor: 'John Doe',
      description: 'Khóa học này sẽ dạy bạn tất cả những kiến thức cơ bản về React, hooks, state management và xử lý API.',
      topics: [
        'Giới thiệu về JSX và Components',
        'Hiểu về Props và State',
        'React Hooks (useState, useEffect, useContext)',
        'Xử lý Forms trong React',
        'Routing với React Router',
        'State Management với Context API và Redux',
        'Tối ưu hiệu suất React'
      ],
      duration: '12 giờ',
      level: 'Trung cấp',
      lastUpdated: '2025-02-15',
      lessons: [
        { 
          id: 1, 
          title: 'Giới thiệu về React', 
          duration: '15:30', 
          completed: true,
          description: 'Trong bài học này, bạn sẽ được tìm hiểu về React là gì, tại sao nên sử dụng React và cách React hoạt động. Chúng ta sẽ đi qua các khái niệm cơ bản như Virtual DOM, JSX và Components.',
          resources: [
            { title: 'Slide bài giảng', url: 'https://example.com/react-intro-slides.pdf' },
            { title: 'Tài liệu tham khảo', url: 'https://example.com/react-docs.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 2, 
          title: 'Cài đặt môi trường', 
          duration: '20:15', 
          completed: true,
          description: 'Hướng dẫn chi tiết cách cài đặt Node.js, npm và các công cụ cần thiết để bắt đầu phát triển ứng dụng React. Bạn sẽ học cách tạo dự án React mới bằng Create React App và cấu trúc thư mục của một dự án React.',
          resources: [
            { title: 'Hướng dẫn cài đặt', url: 'https://example.com/setup-guide.pdf' },
            { title: 'Cấu trúc dự án', url: 'https://example.com/project-structure.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 3, 
          title: 'Components và Props', 
          duration: '25:45', 
          completed: false,
          description: 'Tìm hiểu sâu về Components trong React, cách tạo và sử dụng Functional Components, Class Components. Học cách truyền dữ liệu giữa các components thông qua Props và cách xử lý Props validation.',
          resources: [
            { title: 'Components Guide', url: 'https://example.com/components-guide.pdf' },
            { title: 'Props Examples', url: 'https://example.com/props-examples.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 4, 
          title: 'State và Lifecycle', 
          duration: '18:20', 
          completed: false,
          description: 'Khám phá cách quản lý state trong React components, sự khác biệt giữa state và props. Tìm hiểu về lifecycle methods trong Class Components và cách sử dụng useEffect hook trong Functional Components.',
          resources: [
            { title: 'State Management', url: 'https://example.com/state-management.pdf' },
            { title: 'Lifecycle Methods', url: 'https://example.com/lifecycle-methods.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    },
    {
      id: 2,
      title: 'Node.js Advanced',
      category: 'Backend',
      price: 59.99,
      rating: 4.7,
      students: 850,
      image: '/api/placeholder/600/400',
      instructor: 'Jane Smith',
      description: 'Học các kỹ thuật nâng cao trong Node.js để xây dựng API mạnh mẽ và hệ thống backend có khả năng mở rộng.',
      topics: [
        'Kiến trúc ứng dụng Node.js',
        'Express.js nâng cao',
        'Authentication và Authorization',
        'RESTful API design',
        'Xử lý lỗi và logging',
        'Streaming và xử lý file',
        'Tối ưu hiệu suất và scaling'
      ],
      duration: '15 giờ',
      level: 'Nâng cao',
      lastUpdated: '2025-01-20',
      lessons: [
        { 
          id: 1, 
          title: 'Giới thiệu Node.js nâng cao', 
          duration: '20:00', 
          completed: false,
          description: 'Tổng quan về Node.js và các khái niệm nâng cao. Tìm hiểu về Event Loop, Asynchronous Programming, và cách Node.js xử lý các tác vụ đồng thời.',
          resources: [
            { title: 'Node.js Architecture', url: 'https://example.com/node-architecture.pdf' },
            { title: 'Event Loop Guide', url: 'https://example.com/event-loop.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 2, 
          title: 'Express.js và Middleware', 
          duration: '25:30', 
          completed: false,
          description: 'Khám phá sâu về Express.js framework, cách tạo và sử dụng middleware, routing, và xử lý request/response. Học cách tối ưu hóa hiệu suất của ứng dụng Express.',
          resources: [
            { title: 'Express.js Guide', url: 'https://example.com/express-guide.pdf' },
            { title: 'Middleware Patterns', url: 'https://example.com/middleware-patterns.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 3, 
          title: 'Authentication với JWT', 
          duration: '30:15', 
          completed: false,
          description: 'Học cách triển khai hệ thống xác thực và phân quyền sử dụng JWT (JSON Web Tokens). Tìm hiểu về các best practices trong bảo mật và cách bảo vệ API của bạn.',
          resources: [
            { title: 'JWT Implementation', url: 'https://example.com/jwt-implementation.pdf' },
            { title: 'Security Best Practices', url: 'https://example.com/security-practices.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 4, 
          title: 'RESTful API Design', 
          duration: '22:45', 
          completed: false,
          description: 'Học cách thiết kế và triển khai RESTful API theo các tiêu chuẩn quốc tế. Tìm hiểu về versioning, documentation, và cách tối ưu hóa API cho hiệu suất tốt nhất.',
          resources: [
            { title: 'RESTful Design', url: 'https://example.com/restful-design.pdf' },
            { title: 'API Documentation', url: 'https://example.com/api-docs.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    },
    {
      id: 3,
      title: 'UI/UX Design',
      category: 'Design',
      price: 39.99,
      rating: 4.3,
      students: 1500,
      image: '/api/placeholder/600/400',
      instructor: 'Alex Johnson',
      description: 'Học cách thiết kế giao diện người dùng đẹp mắt và trải nghiệm người dùng trực quan.',
      topics: [
        'Nguyên tắc thiết kế UI/UX',
        'Nghiên cứu người dùng',
        'Wireframing và Prototyping',
        'Thiết kế tương tác',
        'Thiết kế responsive',
        'Kiểm thử người dùng',
        'Figma và công cụ thiết kế'
      ],
      duration: '10 giờ',
      level: 'Cơ bản',
      lastUpdated: '2025-03-05',
      lessons: [
        { 
          id: 1, 
          title: 'Nguyên tắc thiết kế cơ bản', 
          duration: '18:20', 
          completed: false,
          description: 'Tìm hiểu về các nguyên tắc cơ bản trong thiết kế UI/UX như hierarchy, contrast, balance, và consistency. Học cách áp dụng các nguyên tắc này vào thiết kế của bạn.',
          resources: [
            { title: 'Design Principles', url: 'https://example.com/design-principles.pdf' },
            { title: 'Visual Hierarchy', url: 'https://example.com/visual-hierarchy.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 2, 
          title: 'Nghiên cứu người dùng', 
          duration: '22:10', 
          completed: false,
          description: 'Học cách tiến hành nghiên cứu người dùng hiệu quả, phân tích dữ liệu, và sử dụng insights để cải thiện thiết kế. Tìm hiểu về các phương pháp nghiên cứu khác nhau và khi nào nên sử dụng chúng.',
          resources: [
            { title: 'User Research Methods', url: 'https://example.com/research-methods.pdf' },
            { title: 'Data Analysis', url: 'https://example.com/data-analysis.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 3, 
          title: 'Wireframing với Figma', 
          duration: '25:40', 
          completed: false,
          description: 'Học cách sử dụng Figma để tạo wireframes và prototypes. Tìm hiểu về các tính năng nâng cao của Figma như components, styles, và animations.',
          resources: [
            { title: 'Figma Tutorial', url: 'https://example.com/figma-tutorial.pdf' },
            { title: 'Wireframing Guide', url: 'https://example.com/wireframing-guide.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 4, 
          title: 'Prototyping và Testing', 
          duration: '20:30', 
          completed: false,
          description: 'Học cách tạo prototypes tương tác và tiến hành kiểm thử người dùng. Tìm hiểu về các phương pháp kiểm thử khác nhau và cách thu thập phản hồi hiệu quả.',
          resources: [
            { title: 'Prototyping Guide', url: 'https://example.com/prototyping-guide.pdf' },
            { title: 'User Testing', url: 'https://example.com/user-testing.pdf' }
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    },
    {
      id: 4,
      title: 'Python for Beginners',
      category: 'Programming',
      price: 29.99,
      rating: 4.8,
      students: 2000,
      image: '/api/placeholder/600/400',
      instructor: 'Maria Garcia',
      description: 'Khóa học Python từ cơ bản đến nâng cao dành cho người mới bắt đầu lập trình.',
      topics: [
        'Cú pháp Python cơ bản',
        'Cấu trúc dữ liệu và thuật toán',
        'Object-Oriented Programming',
        'Xử lý file và exceptions',
        'Thư viện Python phổ biến',
        'Automation với Python',
        'Dự án thực tế'
      ],
      duration: '18 giờ',
      level: 'Cơ bản',
      lastUpdated: '2025-01-10',
      lessons: [
        { id: 1, title: 'Cài đặt Python và IDE', duration: '15:00', completed: false },
        { id: 2, title: 'Cú pháp cơ bản Python', duration: '30:00', completed: false },
        { id: 3, title: 'Cấu trúc dữ liệu', duration: '25:00', completed: false },
        { id: 4, title: 'OOP trong Python', duration: '35:00', completed: false }
      ]
    },
    {
      id: 5,
      title: 'DevOps Essentials',
      category: 'DevOps',
      price: 69.99,
      rating: 4.6,
      students: 700,
      image: '/api/placeholder/600/400',
      instructor: 'Robert Chen',
      description: 'Học các nguyên tắc và công cụ DevOps cần thiết để tối ưu hóa quy trình phát triển phần mềm.',
      topics: [
        'CI/CD Pipelines',
        'Docker và Containerization',
        'Kubernetes',
        'Infrastructure as Code',
        'Monitoring và Logging',
        'Cloud Platforms (AWS, Azure, GCP)',
        'Security trong DevOps'
      ],
      duration: '20 giờ',
      level: 'Nâng cao',
      lastUpdated: '2025-02-28',
      lessons: [
        { id: 1, title: 'Giới thiệu về DevOps', duration: '20:00', completed: false },
        { id: 2, title: 'Docker cơ bản', duration: '25:00', completed: false },
        { id: 3, title: 'Kubernetes cơ bản', duration: '30:00', completed: false },
        { id: 4, title: 'CI/CD với GitHub Actions', duration: '25:00', completed: false }
      ]
    },
    {
      id: 6,
      title: 'Mobile App Development',
      category: 'Mobile',
      price: 54.99,
      rating: 4.4,
      students: 950,
      image: '/api/placeholder/600/400',
      instructor: 'Lisa Wang',
      description: 'Phát triển ứng dụng di động đa nền tảng với React Native, từ cơ bản đến triển khai.',
      topics: [
        'React Native fundamentals',
        'State Management trong React Native',
        'Navigation và Routing',
        'Styling và UI Components',
        'Tích hợp Native Modules',
        'Animation và Gestures',
        'Publishing ứng dụng lên App Store và Google Play'
      ],
      duration: '16 giờ',
      level: 'Trung cấp',
      lastUpdated: '2025-03-12',
      lessons: [
        { id: 1, title: 'Giới thiệu React Native', duration: '20:00', completed: false },
        { id: 2, title: 'Cài đặt môi trường', duration: '15:00', completed: false },
        { id: 3, title: 'Components và Styling', duration: '25:00', completed: false },
        { id: 4, title: 'Navigation và State', duration: '30:00', completed: false }
      ]
    }
  ];

  // Dữ liệu mẫu cho đánh giá
  const sampleReviews = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Khóa học rất hay và bổ ích. Giảng viên giải thích rất dễ hiểu.',
      date: '2024-02-15'
    },
    {
      id: 2,
      user: 'Trần Thị B',
      rating: 4,
      comment: 'Nội dung tốt nhưng có một số phần hơi khó hiểu.',
      date: '2024-02-10'
    }
  ];

  useEffect(() => {
    // Giả lập việc gọi API để lấy dữ liệu khóa học
    setLoading(true);
    
    // Tìm khóa học theo id
    const foundCourse = coursesData.find(c => c.id === parseInt(courseId));
    
    // Giả lập độ trễ khi gọi API
    setTimeout(() => {
      if (foundCourse) {
        setCourse(foundCourse);
        setReviews(sampleReviews);
      }
      setLoading(false);
    }, 500);
  }, [courseId]);

  // Quay lại trang danh sách khóa học
  const handleBackToList = () => {
    navigate('/courses');
  };

  // Xử lý đăng ký khóa học
  const handleEnrollCourse = () => {
    try {
      // Lấy danh sách khóa học đã đăng ký từ localStorage
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      
      // Kiểm tra xem khóa học đã được đăng ký chưa
      const isAlreadyEnrolled = enrolledCourses.some(c => c.id === course.id);
      
      if (isAlreadyEnrolled) {
        alert('Bạn đã đăng ký khóa học này rồi!');
        return;
      }
      
      // Thêm khóa học vào danh sách đã đăng ký
      enrolledCourses.push({
        id: course.id,
        title: course.title,
        thumbnail: course.image,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        lastAccessed: new Date().toISOString()
      });
      
      // Lưu lại vào localStorage
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      
      // Hiển thị thông báo thành công
      alert(`Đã đăng ký thành công khóa học: ${course.title}`);
      
      // Chuyển hướng đến trang học
      navigate(`/courses/${course.id}/learn`);
    } catch (error) {
      console.error('Error enrolling course:', error);
      alert('Có lỗi xảy ra khi đăng ký khóa học. Vui lòng thử lại sau.');
    }
  };

  // Xử lý bắt đầu học
  const handleStartLearning = () => {
    navigate(`/courses/${courseId}/lessons/1`); // Chuyển đến bài học đầu tiên
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      user: 'Người dùng hiện tại',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
  };

  const toggleLessonDetails = (lessonId) => {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);
    } else {
      setExpandedLessonId(lessonId);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">Đang tải thông tin khóa học...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Không tìm thấy khóa học</div>
          <p className="mb-8">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button 
            onClick={handleBackToList}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  const progress = (course.lessons.filter(l => l.completed).length / course.lessons.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBackToList}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Danh sách khóa học
        </button>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{course.title}</span>
      </div>
      
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3">{course.category}</span>
              <span className="text-yellow-500 flex items-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1">{course.rating}</span>
              </span>
              <span className="text-gray-600">{course.students} học viên</span>
            </div>
            <p className="text-gray-600 mb-4">
              Giảng viên: <span className="font-medium">{course.instructor}</span>
            </p>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <div className="flex flex-wrap">
              <div className="mr-6 mb-4">
                <div className="text-sm text-gray-500">Thời lượng</div>
                <div className="text-md font-medium">{course.duration}</div>
              </div>
              <div className="mr-6 mb-4">
                <div className="text-sm text-gray-500">Cập nhật</div>
                <div className="text-md font-medium">{course.lastUpdated}</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-500">Trình độ</div>
                <div className="text-md font-medium">{course.level}</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col justify-between">
            <div>
              <img src={course.image} alt={course.title} className="w-full rounded-md mb-6" />
              <div className="text-3xl font-bold mb-6">${course.price}</div>
              <button 
                onClick={handleStartLearning}
                className="w-full bg-green-600 text-white py-3 rounded-md text-lg font-medium hover:bg-green-700 mb-4"
              >
                Bắt đầu học
              </button>
              <button 
                onClick={handleEnrollCourse}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700"
              >
                Đăng ký khóa học
              </button>
              <p className="text-center text-gray-500 text-sm mt-4">Đảm bảo hoàn tiền trong 30 ngày</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'lessons'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bài học
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đánh giá
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
              <ul className="divide-y">
                {course.topics.map((topic, index) => (
                  <li key={index} className="py-3 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Tiến độ học tập</span>
                  <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-4">
                {course.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col bg-gray-50 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        {lesson.completed ? (
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-3">{lesson.duration}</span>
                        <button 
                          onClick={() => toggleLessonDetails(lesson.id)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {expandedLessonId === lesson.id ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {expandedLessonId === lesson.id && (
                      <div className="bg-white p-4 border-t border-gray-200">
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Nội dung bài học</h4>
                          <p className="text-gray-600">{lesson.description || 'Chưa có mô tả chi tiết cho bài học này.'}</p>
                        </div>
                        
                        {lesson.resources && lesson.resources.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Tài liệu</h4>
                            <ul className="space-y-2">
                              {lesson.resources.map((resource, index) => (
                                <li key={index} className="flex items-center text-purple-600 hover:text-purple-800">
                                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {resource.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {lesson.videoUrl && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Video bài giảng</h4>
                            <div className="aspect-w-16 aspect-h-9">
                              <iframe 
                                src={lesson.videoUrl} 
                                title={lesson.title}
                                className="w-full h-64 rounded-md"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                          >
                            Bắt đầu học
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Viết đánh giá</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="text-yellow-400 hover:text-yellow-500"
                        >
                          <svg
                            className={`w-6 h-6 ${star <= newReview.rating ? 'fill-current' : 'fill-none'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bình luận</label>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Chia sẻ trải nghiệm của bạn về khóa học..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Gửi đánh giá
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium">{review.user}</span>
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
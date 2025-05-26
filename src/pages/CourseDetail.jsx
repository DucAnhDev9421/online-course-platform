import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [sections, setSections] = useState([]);
  const [showAllSections, setShowAllSections] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const totalLectures = sections.reduce((sum, s) => sum + s.lectures, 0);
  const totalDuration = sections.reduce((sum, s) => sum + s.duration, 0);
  const totalSections = sections.length;
  const [showFullInstructorDesc, setShowFullInstructorDesc] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});

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

  // Dữ liệu mẫu cho nội dung khóa học dạng section
  const sampleSections = [
    {
      title: 'Introduction',
      lectures: 3,
      duration: 7,
      expanded: false,
    },
    {
      title: 'Cài đặt môi trường lập trình Python',
      lectures: 5,
      duration: 31,
      expanded: false,
    },
    {
      title: 'Biến và Kiểu dữ liệu (Variables and Data types)',
      lectures: 2,
      duration: 11,
      expanded: false,
    },
    {
      title: 'Các phép toán số học (Arithmetic operators)',
      lectures: 3,
      duration: 13,
      expanded: false,
    },
    {
      title: 'Chuỗi (string) trong Python',
      lectures: 5,
      duration: 21,
      expanded: false,
    },
    {
      title: 'Các phép toán so sánh và logic (comparison and logical operators)',
      lectures: 3,
      duration: 12,
      expanded: false,
    },
    {
      title: 'Kiểu dữ liệu List - Danh Sách',
      lectures: 6,
      duration: 30,
      expanded: false,
    },
    {
      title: 'Kiểu dữ liệu Tuple',
      lectures: 3,
      duration: 17,
      expanded: false,
    },
    {
      title: 'Kiểu dữ liệu Dictionary - Từ điển',
      lectures: 2,
      duration: 11,
      expanded: false,
    },
    {
      title: 'Kiểu dữ liệu Set - Tập hợp',
      lectures: 2,
      duration: 11,
      expanded: false,
    },
    // ... có thể thêm nhiều phần nữa để test ...
  ];

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
    setLoading(true);
        const response = await axios.get(`https://localhost:7261/api/courses/${courseId}`);
        const courseData = {
          id: parseInt(courseId),
          title: response.data.name,
          price: response.data.price,
          description: response.data.description,
          rating: 4.5, // Default value
          students: 1200, // Default value
          image: 'https://almablog-media.s3.ap-south-1.amazonaws.com/medium_React_Fundamentals_56e32fd939.png', // Default image
          instructor: 'AI Coding', // Default value
          topics: [
            'Giới thiệu về JSX và Components',
            'Hiểu về Props và State',
            'React Hooks (useState, useEffect, useContext)',
            'Xử lý Forms trong React',
            'Routing với React Router',
            'State Management với Context API và Redux',
            'Tối ưu hiệu suất React'
          ], // Default topics
          duration: '12 giờ', // Default value
          level: 'Trung cấp', // Default value
          lastUpdated: new Date().toISOString(),
          lessons: [
            { 
              id: 1, 
              title: 'Giới thiệu về React', 
              duration: '15:30', 
              completed: false,
              description: 'Trong bài học này, bạn sẽ được tìm hiểu về React.',
              resources: [],
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            }
          ], // Default lessons
          videoDemoUrl: response.data.videoDemoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Add videoDemoUrl from API
        };
        setCourse(courseData);
        setReviews([]); // Reset reviews
        setSections([]); // Reset sections
      } catch (err) {
        setError('Failed to fetch course details');
        console.error('Error fetching course details:', err);
      } finally {
      setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  // Kiểm tra và cập nhật trạng thái yêu thích
  useEffect(() => {
    if (course) {
      const favoriteCourses = JSON.parse(localStorage.getItem('favoriteCourses') || '[]');
      setIsFavorite(favoriteCourses.some(fc => fc.id === course.id));
    }
  }, [course]);

  // Xử lý thêm/xóa khóa học yêu thích
  const handleToggleFavorite = () => {
    const favoriteCourses = JSON.parse(localStorage.getItem('favoriteCourses') || '[]');
    
    if (isFavorite) {
      // Xóa khỏi danh sách yêu thích
      const updatedFavorites = favoriteCourses.filter(fc => fc.id !== course.id);
      localStorage.setItem('favoriteCourses', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // Thêm vào danh sách yêu thích
      const newFavorite = {
        id: course.id,
        title: course.title,
        image: course.image,
        price: course.price,
        rating: course.rating,
        students: course.students,
        addedAt: new Date().toISOString()
      };
      favoriteCourses.push(newFavorite);
      localStorage.setItem('favoriteCourses', JSON.stringify(favoriteCourses));
      setIsFavorite(true);
    }
  };

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

  const handleToggleSection = idx => {
    setSections(sections => sections.map((s, i) => i === idx ? { ...s, expanded: !s.expanded } : s));
  };
  const handleExpandAll = () => {
    setSections(sections => sections.map(s => ({ ...s, expanded: true })));
  };

  // Helper: formatTimeAgo
  function formatTimeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = (now - date) / 1000;
    if (diff < 60 * 60 * 24) return 'Hôm nay';
    if (diff < 60 * 60 * 24 * 7) return `${Math.floor(diff / (60 * 60 * 24))} ngày trước`;
    if (diff < 60 * 60 * 24 * 30) return `${Math.floor(diff / (60 * 60 * 24 * 7))} tuần trước`;
    return `${Math.floor(diff / (60 * 60 * 24 * 30))} tháng trước`;
  }

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const token = await getToken(); // Lấy token từ Clerk
      if (!token) {
        alert('Vui lòng đăng nhập để thêm khóa học vào giỏ hàng');
        navigate('/login');
        return;
      }

      const response = await axios.post('https://localhost:7261/api/Cart/add', 
        {
          courseId: course.id,
          quantity: 1
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert('Đã thêm khóa học vào giỏ hàng!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        alert('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại sau.');
      }
    } finally {
      setIsAddingToCart(false);
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
      {/* Course Header - Dark mode style */}
      <div className="rounded-lg mb-8 p-8" style={{background: '#181822', color: '#fff'}}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{course.title}</h1>
        <div className="text-lg text-gray-200 mb-4">{course.description}</div>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="bg-cyan-700 text-xs px-2 py-1 rounded font-semibold mr-2">Bán chạy nhất</span>
          <button 
            onClick={handleToggleFavorite}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
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
            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
          </button>
          <span className="flex items-center text-yellow-400 font-bold text-base mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {course.rating}
          </span>
          <span className="text-blue-400 underline cursor-pointer text-sm">(637 xếp hạng)</span>
          <span className="text-gray-300 text-sm ml-2">{course.students.toLocaleString()} học viên</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-2">
          <span>Được tạo bởi <span className="font-semibold text-white">{course.instructor || 'AI Coding'}</span></span>
          <span className="flex items-center gap-1">
            <i className="fas fa-history"></i>
            Lần cập nhật gần nhất <span className="font-semibold">{course.lastUpdated ? (typeof course.lastUpdated === 'string' ? course.lastUpdated : new Date(course.lastUpdated).toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })) : '5/2025'}</span>
          </span>
        </div>
      </div>
      {/* Main content with sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Khung nội dung bài học */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Nội dung bài học</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-2">
              {(showAllTopics ? course.topics : course.topics.slice(0, 8)).map((topic, idx) => (
                <li key={idx} className="flex items-start text-base text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
            {course.topics.length > 8 && (
              <button
                className="text-purple-700 font-semibold hover:underline mt-2"
                onClick={() => setShowAllTopics(v => !v)}
              >
                {showAllTopics ? 'Ẩn bớt' : 'Xem thêm'}
              </button>
            )}
          </div>
          {/* Nội dung khóa học dạng section */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Nội dung khóa học</h2>
              <button className="text-purple-700 font-semibold hover:underline" onClick={handleExpandAll}>Mở rộng tất cả các phần</button>
            </div>
            <div className="text-gray-600 text-sm mb-4">{totalSections} phần • {totalLectures} bài giảng • {totalDuration} phút tổng thời lượng</div>
            <div className="border rounded-lg overflow-hidden">
              {(showAllSections ? sections : sections.slice(0, 10)).map((section, idx) => (
                <div key={idx} className="border-b last:border-b-0">
                  <button className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left hover:bg-gray-50" onClick={() => handleToggleSection(idx)}>
                    <span>{section.title}</span>
                    <span className="text-sm text-gray-500">{section.lectures} bài giảng • {section.duration} phút</span>
                  </button>
                  {section.expanded && (
                    <div className="px-6 py-3 bg-gray-50 text-gray-700 text-sm">Nội dung chi tiết phần này...</div>
                  )}
                </div>
              ))}
            </div>
            {sections.length > 10 && (
              <button className="w-full mt-4 border border-purple-600 text-purple-700 py-2 rounded font-semibold hover:bg-purple-50" onClick={() => setShowAllSections(v => !v)}>
                {showAllSections ? 'Ẩn bớt' : `${sections.length - 10} phần nữa`}
              </button>
            )}
          </div>
          {/* Mô tả khóa học */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Mô tả khóa học</h2>
            <div className="text-gray-700 text-base whitespace-pre-line">{course.description}</div>
          </div>
          {/* Giảng viên */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Giảng viên</h2>
            <div className="flex items-center mb-4">
              <img src="https://i.imgur.com/1bX5QH6.png" alt="AI Coding" className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 mr-6" />
              <div>
                <a href="#" className="text-xl font-bold text-purple-700 hover:underline">AI Coding</a>
                <div className="text-gray-500 text-base mb-2">Senior AI Engineer</div>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                  <span className="flex items-center"><i className="fas fa-star text-yellow-500 mr-1"></i>4,8 xếp hạng giảng viên</span>
                  <span className="flex items-center"><i className="fas fa-user-check mr-1"></i>637 đánh giá</span>
                  <span className="flex items-center"><i className="fas fa-users mr-1"></i>8755 học viên</span>
                  <span className="flex items-center"><i className="fas fa-book mr-1"></i>1 khóa học</span>
                </div>
              </div>
            </div>
            {/* Mô tả giảng viên có thể ẩn/hiện */}
            {(() => {
              const desc = [
                <span key="1" className="font-bold">Mình từng học Kỹ sư tài năng tại Đại Học Bách khoa Hà Nội trong 2 năm. Sau đó mình đi du học và tốt nghiệp thạc sĩ vật lý hạt nhân tại trường đại học MEPhI - một trong những ngôi trường tốt nhất tại liên bang Nga.</span>,
                <> Sau đó, mình có cơ hội làm việc trong lĩnh vực công nghệ thông tin, bén duyên với lĩnh vực này và hiện tại <span className="font-bold text-purple-700">mình đang là Senior AI Engineer</span> ❤️❤️❤️</>,
                <><br/><br/>Mình đã có nhiều năm kinh nghiệm làm việc với <span className="font-bold">Python và trí tuệ nhân tạo (AI)</span>. Các lĩnh vực chuyên môn chính của mình bao gồm: thị giác máy tính (<span className="font-bold">Computer Vision</span>), xử lý ngôn ngữ tự nhiên (<span className="font-bold">NLP</span>), truy xuất thông tin RAG, <span className="font-bold">AI Agents</span>, triển khai mô hình AI lên các nền tảng đám mây hoặc thiết bị biên, tối ưu hóa hiệu suất của các mô hình AI, <span className="font-bold">workflow automation với AI</span>.</>,
                <><br/><br/>Ngôn ngữ: Tiếng Anh, Tiếng Nga</>,
                <><br/><br/>Mình rất vui khi được gặp gỡ và chia sẻ kiến thức cũng như đồng hành cùng với các bạn. Hãy luôn giữ đam mê và nhiệt huyết, thành công sẽ đến với chúng ta!</>
              ];
              const maxLines = 4;
              return (
                <div className="text-gray-800 text-base leading-relaxed mt-2">
                  {showFullInstructorDesc ? desc : desc.slice(0, maxLines)}
                  {desc.length > maxLines && (
                    <button
                      className="block mt-2 text-purple-700 font-semibold hover:underline focus:outline-none"
                      onClick={() => setShowFullInstructorDesc(v => !v)}
                    >
                      {showFullInstructorDesc ? 'Ẩn bớt ︿' : 'Xem thêm ˇ'}
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
          {/* Đánh giá khóa học */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-yellow-600 mr-2">★ {course.rating} xếp hạng khóa học</span>
              <span className="text-lg font-semibold text-gray-700 ml-2">• {reviews.length} xếp hạng</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, idx) => {
                const isLong = review.comment.length > 120;
                const expanded = expandedReviews[review.id];
                return (
                  <div key={review.id} className="border rounded-lg p-5 relative bg-gray-50">
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg text-white mr-3">
                        {review.user.split(' ').map(w => w[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-base">{review.user}</div>
                        <div className="flex items-center text-yellow-500 text-sm">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          <span className="text-gray-500 ml-2 text-xs">{formatTimeAgo(review.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-800 text-base mb-2">
                      {isLong && !expanded ? review.comment.slice(0, 120) + '...' : review.comment}
                      {isLong && (
                        <button
                          className="ml-2 text-purple-700 font-semibold hover:underline text-sm"
                          onClick={() => setExpandedReviews(r => ({ ...r, [review.id]: !expanded }))}
                        >
                          {expanded ? 'Ẩn bớt' : 'Hiện thêm'}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>Bạn thấy hữu ích?</span>
                      <button className="hover:text-purple-700"><i className="far fa-thumbs-up"></i></button>
                      <button className="hover:text-purple-700"><i className="far fa-thumbs-down"></i></button>
                    </div>
                  </div>
                );
              })}
            </div>
            {reviews.length > 3 && (
              <button
                className="mt-6 px-5 py-2 bg-purple-100 text-purple-700 rounded font-semibold hover:bg-purple-200"
                onClick={() => setShowAllReviews(v => !v)}
              >
                {showAllReviews ? 'Ẩn bớt đánh giá' : 'Hiện tất cả đánh giá'}
              </button>
            )}
          </div>
        </div>
        {/* Sidebar bên phải */}
        <aside className="sidebar-udemy w-full lg:w-[340px] flex-shrink-0 -mt-24 z-10 relative">
          <div className="sidebar-udemy-inner bg-white rounded-lg shadow p-6 sticky top-8">
            {/* Video giới thiệu khóa học */}
            <div className="mb-4">
              <iframe
                width="100%"
                height="200"
                src={course.videoDemoUrl}
                title="Giới thiệu khóa học"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md"
              ></iframe>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">{course.price ? course.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Miễn phí'}</div>
            <div className="flex gap-2 mb-3">
              <button 
                className="flex-1 bg-purple-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang thêm...
                  </span>
                ) : 'Thêm vào giỏ hàng'}
              </button>
              <button
                onClick={handleToggleFavorite}
                title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                className={`w-12 h-12 flex items-center justify-center border-2 rounded-md transition-colors ${
                  isFavorite
                    ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-gray-300 bg-white text-gray-400 hover:bg-gray-100'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill={isFavorite ? 'currentColor' : 'none'}
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
            <button className="w-full border-2 border-purple-600 text-purple-700 py-3 rounded-md text-lg font-semibold hover:bg-purple-50 mb-2" onClick={handleStartLearning}>Học ngay</button>
            <div className="text-center text-gray-500 text-sm mb-4">Đảm bảo hoàn tiền trong 30 ngày</div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Khóa học này bao gồm:</div>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>15 giờ video theo yêu cầu</li>
                <li>8 bài viết</li>
                <li>3 tài nguyên để tải xuống</li>
                <li>Truy cập trên thiết bị di động và TV</li>
                <li>Quyền truy cập đầy đủ suốt đời</li>
                <li>Giấy chứng nhận hoàn thành</li>
              </ul>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 cursor-pointer hover:underline">Chia sẻ</span>
              <span className="text-sm text-gray-500 cursor-pointer hover:underline">Tặng khóa học này</span>
            </div>
            <div className="mb-2">
              <div className="text-sm text-gray-500 mb-1">Áp dụng coupon</div>
              <input type="text" className="w-full border rounded px-3 py-2 mb-2" placeholder="Nhập coupon" />
              <button className="w-full bg-purple-100 text-purple-700 py-2 rounded font-semibold hover:bg-purple-200">Áp dụng</button>
            </div>
          </div>
        </aside>
      </div>
      {/* Khóa học tương tự */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Khóa học tương tự</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData
            .filter(c => c.id !== course.id && (c.category === course.category || c.level === course.level))
            .slice(0, 3)
            .map(similarCourse => (
              <div key={similarCourse.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={similarCourse.image} 
                    alt={similarCourse.title} 
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/courses/${similarCourse.id}`)}
                  />
                  {similarCourse.price === 0 && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Miễn phí
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 
                    className="font-bold text-lg mb-2 cursor-pointer hover:text-blue-700"
                    onClick={() => navigate(`/courses/${similarCourse.id}`)}
                  >
                    {similarCourse.title}
                  </h3>
                  <div className="text-gray-600 text-sm mb-2">{similarCourse.category}</div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="text-yellow-500 font-semibold mr-1">★ {similarCourse.rating}</span>
                    <span className="ml-2">{similarCourse.students} học viên</span>
                    <span className="ml-2">• {similarCourse.duration} giờ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-purple-700">
                      {similarCourse.price === 0 ? 'Miễn phí' : similarCourse.price.toLocaleString('vi-VN', {style:'currency', currency:'VND'})}
                    </span>
                    <button 
                      onClick={() => navigate(`/courses/${similarCourse.id}`)}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
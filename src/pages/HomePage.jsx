// src/components/Homepage.jsx
import { useEffect, useState } from 'react';
import Slider from '../components/Slider';
import Categories from '@components/Categories';
import CourseCard from '@components/courses/CourseCard';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import SkeletonCourseCard from '@components/courses/SkeletonCourseCard';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [jobTitle, setJobTitle] = useState('');

  // State for top-rated courses
  const [topRatedCourses, setTopRatedCourses] = useState([]);
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [errorTopRated, setErrorTopRated] = useState(null);

  // State for popular courses
  const [popularCourses, setPopularCourses] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true); // Set to true to show loader initially
  const [errorPopular, setErrorPopular] = useState(null);

  useEffect(() => {
    const fetchFreeCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://localhost:7261/api/courses');
        // Lọc các khóa học miễn phí và đã được duyệt
        const freeCourses = response.data
          .filter(course => course.price === 0 && course.status === 1)
          .map(course => ({
            id: course.id,
            title: course.name,
            instructor: course.instructor, // Lấy thông tin instructor từ response chung
            price: course.price,
            rating: course.averageRating || 0, // Sử dụng averageRating từ API /api/courses
            image: course.imageUrl || 'https://almablog-media.s3.ap-south-1.amazonaws.com/medium_React_Fundamentals_56e32fd939.png',
          }));
        // Thêm delay 1200ms để tạo hiệu ứng loading lâu hơn
        await new Promise(resolve => setTimeout(resolve, 1200));
        setCourses(freeCourses.slice(0, 8));
      } catch (err) {
        setError('Không thể tải danh sách khóa học miễn phí');
        console.error('Error fetching free courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFreeCourses();
  }, []);

  // useEffect to fetch top-rated courses
  useEffect(() => {
    const fetchTopRatedCourses = async () => {
      try {
        setLoadingTopRated(true);
        const response = await axios.get('https://localhost:7261/api/courses/top-rated?limit=4');
        
        // Fetch full details for each top-rated course - Still needed as /top-rated doesn't provide instructor/image directly in the summary
        const detailedCoursesPromises = response.data.map(async (courseSummary) => {
          try {
            const detailRes = await axios.get(`https://localhost:7261/api/courses/${courseSummary.courseId}`);
            const courseDetail = detailRes.data;
            // Combine summary data with detailed data
            return {
              id: courseDetail.id,
              title: courseDetail.name, // Use name from detail API
              instructor: courseDetail.instructor, // Use instructor from detail API
              price: courseDetail.price || 0,
              rating: courseDetail.averageRating || courseSummary.averageRating || 0, // Prefer detail rating, fallback to summary
              image: courseDetail.imageUrl || 'https://almablog-media.s3.ap-south-1.amazonaws.com/medium_React_Fundamentals_56e32fd939.png', // Use image from detail API
              // Include other fields from summary if needed, using original names
              courseId: courseSummary.courseId,
              courseName: courseSummary.courseName,
              description: courseSummary.description,
              averageRating: courseSummary.averageRating,
              totalRatings: courseSummary.totalRatings,
              totalStudents: courseSummary.totalStudents,
              enrollmentCount: courseDetail.enrollmentCount // Add enrollmentCount from detail
            };
          } catch (detailErr) {
            console.error(`Error fetching detail for course ${courseSummary.courseId}:`, detailErr);
            // Return summary data as fallback if detail fetch fails
            return {
               id: courseSummary.courseId,
               title: courseSummary.courseName,
               instructor: null, // Instructor unknown if detail fetch failed
               price: courseSummary.price || 0,
               rating: courseSummary.averageRating || 0,
               image: 'https://almablog-media.s3.ap-south-1.amazonaws.com/medium_React_Fundamentals_56e32fd939.png', // Default image
               ...courseSummary // Include all original summary fields
            };
          }
        });

        const detailedCourses = await Promise.all(detailedCoursesPromises);
        setTopRatedCourses(detailedCourses);
      } catch (err) {
        setErrorTopRated('Không thể tải danh sách khóa học đánh giá cao nhất');
        console.error('Error fetching top-rated courses summary:', err);
        setTopRatedCourses([]); // Set empty array on error
      } finally {
        setLoadingTopRated(false);
      }
    };
    fetchTopRatedCourses();
  }, []); // Empty dependency array means this runs once on mount

   // New useEffect to fetch popular courses
   useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        setLoadingPopular(true);
        const response = await axios.get('https://localhost:7261/api/courses/popular?page=1&pageSize=8');
        // The popular courses API returns the full course object structure directly
        const formattedPopularCourses = response.data.courses.map(course => ({
            id: course.id,
            title: course.name,
            instructor: course.instructor, // Provided directly in popular API response
            price: course.price || 0,
            rating: course.averageRating || 0, // Provided directly in popular API response
            image: course.imageUrl || 'https://almablog-media.s3.ap-south-1.amazonaws.com/medium_React_Fundamentals_56e32fd939.png', // Provided directly in popular API response
        }));
        setPopularCourses(formattedPopularCourses);
      } catch (err) {
        setErrorPopular('Không thể tải danh sách khóa học phổ biến');
        console.error('Error fetching popular courses:', err);
        setPopularCourses([]); // Set empty array on error
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopularCourses();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const fetchJobTitle = async () => {
      if (user && user.id) {
        try {
          const res = await axios.get(`https://localhost:7261/api/users/${user.id}`);
          setJobTitle(res.data.jobTitle || '');
        } catch (err) {
          setJobTitle('');
        }
      }
    };
    fetchJobTitle();
  }, [user]);

  return (
    <div className="container mx-auto px-4">
      {user && (
        <div className="flex flex-row items-center gap-4 p-6">
          <img
            src={user.imageUrl}
            alt={user.fullName}
            className="w-16 h-16 rounded-full border-2 border-gray-200 shadow"
          />
          <div>
            <h2 className="text-2xl font-bold">Chào mừng {user.firstName || 'bạn'} trở lại!</h2>
            <p className="text-gray-600">{jobTitle}</p>
          </div>
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto">
        <Slider />
      </div>

      {/* Top-rated Courses Section */}
      <section className="py-12 bg-white">
        <h2 className="text-2xl font-bold mb-8 text-center sm:text-left">
          Các khóa học đánh giá cao nhất
        </h2>
        {loadingTopRated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCourseCard key={idx} />
            ))}
          </div>
        ) : errorTopRated ? (
          <div className="text-center py-8 text-red-500">{errorTopRated}</div>
        ) : (topRatedCourses.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">Hiện chưa có khóa học đánh giá cao nhất nào.</div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topRatedCourses.map((course, index) => (
              <CourseCard key={course.id || index} {...course} />
            ))
            }
          </div>
           )
        )}
      </section>

      {/* Recommended Courses Section (Free Courses) */}
      <section className="py-12 bg-white">
        <h2 className="text-2xl font-bold mb-8 text-center sm:text-left">
          Các khóa học miễn phí
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCourseCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (courses.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">Hiện chưa có khóa học miễn phí nào.</div>
            ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={course.id || index} {...course} />
            ))
            }
          </div>
           )
        )}
      </section>

      {/* Popular Courses Section */}
      <section className="py-12 bg-white">
        <h2 className="text-2xl font-bold mb-8 text-center sm:text-left">
          Các khóa học phổ biến
        </h2>
        {loadingPopular ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCourseCard key={idx} />
            ))}
          </div>
        ) : errorPopular ? (
          <div className="text-center py-8 text-red-500">{errorPopular}</div>
        ) : (popularCourses.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">Hiện chưa có khóa học phổ biến nào.</div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularCourses.map((course, index) => (
              <CourseCard key={course.id || index} {...course} />
            ))
            }
          </div>
           )
        )}
      </section>

      {/* Categories Section */}
      
    </div>
  );
};

export default HomePage;
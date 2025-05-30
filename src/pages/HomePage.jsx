// src/components/Homepage.jsx
import { useEffect, useState } from 'react';
import Slider from '../components/Slider';
import Categories from '@components/Categories';
import CourseCard from '@components/courses/CourseCard';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://localhost:7261/api/courses');
        // Lọc các khóa học miễn phí
        const freeCourses = response.data
          .filter(course => course.price === 0)
          .map(course => ({
            id: course.id,
            title: course.name,
            instructor: course.instructor?.username || course.instructor?.firstName || 'Giảng viên',
            price: course.price,
            rating: 4.5, // hoặc course.rating nếu có
            students: 0, // hoặc course.students nếu có
            image: course.imageUrl || 'https://almablog-media.s3.ap-south-1.amazonaws.com/medium_React_Fundamentals_56e32fd939.png',
          }));
        setCourses(freeCourses);
      } catch (err) {
        setError('Không thể tải danh sách khóa học miễn phí');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

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
    <div>
      {user && (
        <div className="flex items-center gap-4 p-6">
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
      <Slider />
      {/* Recommended Courses Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center sm:text-left">
            Các khóa học miễn phí
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {courses.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">Hiện chưa có khóa học miễn phí nào.</div>
              ) : (
                courses.map((course, index) => (
                  <CourseCard key={course.id || index} {...course} />
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <Categories />
    </div>
  );
};

export default HomePage;
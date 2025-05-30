import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import InstructorLayout from '../layouts/InstructorLayout';
import DashboardTeacher from './DashboardTeacher';
import CourseWizardForm from '../components/course/CourseWizardForm';

// Danh mục mẫu, bạn có thể thay bằng API hoặc props động
const categoriesSample = [
  { id: 1, name: 'Lập trình' },
  { id: 2, name: 'Thiết kế' },
  { id: 3, name: 'Kinh doanh' },
  { id: 4, name: 'Marketing' },
];

function TeachingPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('performance');

  // Load courses from localStorage when component mounts
  useEffect(() => {
    const savedCourses = localStorage.getItem('teachingCourses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teachingCourses', JSON.stringify(courses));
  }, [courses]);

  // Xử lý khi hoàn tất form multi-step
  const handleCreateCourse = (form) => {
    const courseData = {
      ...form,
      price: form.price || 0,
      instructor: user.id,
      instructorName: user.firstName || 'Giảng viên',
      createdAt: new Date().toISOString(),
      status: 'draft',
      id: Date.now().toString(),
      thumbnail: form.image,
      description: form.description,
      title: form.title,
      category: form.category,
      level: form.level,
      sections: form.sections,
    };
    setCourses([...courses, courseData]);
    setShowCreateForm(false);
  };

  return (
    <InstructorLayout sidebarTab={sidebarTab} setSidebarTab={setSidebarTab}>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-10">
        <div className="container mx-auto px-6 py-8 bg-white/90 rounded-2xl shadow-2xl border border-gray-200">
          {sidebarTab === 'performance' && <DashboardTeacher courses={courses} />}

          {sidebarTab === 'courses' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
                {!showCreateForm && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 shadow-md transition"
                  >
                    Tạo khóa học mới
                  </button>
                )}
              </div>

              {showCreateForm ? (
                <CourseWizardForm
                  categories={categoriesSample}
                  onSubmit={handleCreateCourse}
                  onCancel={() => setShowCreateForm(false)}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                          <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-600 font-medium">
                              {course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                            </span>
                            <Link
                              to={`/teaching/courses/${course.id}`}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Quản lý
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {courses.length === 0 && (
                    <div className="flex items-center justify-between bg-white rounded-lg shadow p-8 mt-8" style={{ minHeight: 120 }}>
                      <div className="text-xl font-medium text-gray-700">
                        Bắt đầu tạo khóa học
                      </div>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-purple-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors shadow-md"
                      >
                        Tạo khóa học của bạn
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </InstructorLayout>
  );
}

export default TeachingPage; 
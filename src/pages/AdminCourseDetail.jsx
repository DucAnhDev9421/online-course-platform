import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useUserInfo } from '../contexts/UserContext';

const statusColor = {
  approved: 'text-green-600',
  pending: 'text-yellow-600',
  rejected: 'text-red-600',
};

const AdminCourseDetail = () => {
  const { userInfo } = useUserInfo();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra quyền truy cập
  if (!userInfo || userInfo.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7261/api/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        setError('Không thể tải chi tiết khóa học');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="p-8">Đang tải chi tiết khóa học...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!course) return <div className="p-8">Không tìm thấy khóa học</div>;

  // Helper
  const getStatus = (status) => {
    if (status === 1 || status === 'approved') return <span className="text-green-600 font-semibold">Đã duyệt</span>;
    if (status === 0 || status === 'pending') return <span className="text-yellow-600 font-semibold">Chờ duyệt</span>;
    if (status === 2 || status === 'rejected') return <span className="text-red-600 font-semibold">Từ chối</span>;
    return <span className="text-gray-600 font-semibold">Không xác định</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow-lg mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Ảnh và video */}
        <div className="flex-shrink-0 w-full md:w-64 flex flex-col items-center gap-4">
          <img
            src={course.imageUrl || course.image || 'https://placehold.co/300x200/8b5cf6/fff?text=Course'}
            alt={course.name}
            className="w-64 h-40 object-cover rounded shadow border mb-2"
          />
          {course.videoDemoUrl && (
            <div className="w-full">
              <div className="text-sm text-gray-500 mb-1">Video demo:</div>
              <div className="aspect-video w-full rounded overflow-hidden border">
                <iframe
                  src={course.videoDemoUrl}
                  title="Video demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-40"
                ></iframe>
              </div>
            </div>
          )}
        </div>
        {/* Thông tin chính */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-purple-700">{course.name}</h1>
          <div className="mb-2 text-gray-600">ID: <span className="font-mono text-xs">{course.id}</span></div>
          <div className="mb-2"><b>Trạng thái:</b> {getStatus(course.status)}</div>
          <div className="mb-2"><b>Giá:</b> <span className="text-lg font-semibold text-green-700">{course.price?.toLocaleString()} VNĐ</span></div>
          <div className="mb-2"><b>Danh mục:</b> {course.categoryName || 'Chưa có'}</div>
          <div className="mb-2"><b>Trình độ:</b> {course.levelText || course.level || 'Không xác định'}</div>
          <div className="mb-2"><b>Ngày tạo:</b> {course.createdAt ? new Date(course.createdAt).toLocaleString() : ''}</div>
          <div className="mb-2"><b>Ngày cập nhật:</b> {course.updatedAt ? new Date(course.updatedAt).toLocaleString() : ''}</div>
          <div className="mb-2"><b>Mô tả:</b>
            <div className="bg-gray-50 rounded p-3 mt-1 text-gray-800 whitespace-pre-line" style={{maxHeight: 200, overflowY: 'auto'}}>
              {course.description || 'Không có mô tả'}
            </div>
          </div>
          {/* Giảng viên */}
          <div className="mb-2 flex items-center gap-2">
            <b>Giảng viên:</b>
            {course.instructor ? (
              <>
                <img
                  src={course.instructor.imageUrl || course.instructor.profileImageUrl || 'https://placehold.co/32x32/8b5cf6/fff?text=U'}
                  alt={course.instructor.username || 'Instructor'}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span className="font-semibold">{course.instructor.username || course.instructor.fullName || course.instructor.firstName || 'Giảng viên'}</span>
              </>
            ) : (
              <span className="italic text-gray-500">Chưa có giảng viên</span>
            )}
          </div>
        </div>
      </div>
      {/* Section/Bài học */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Chương trình học</h2>
        {course.sections && course.sections.length > 0 ? (
          <div className="space-y-6">
            {course.sections.map((section, idx) => (
              <div key={section.id || idx} className="bg-purple-50 rounded-lg p-4 shadow-sm">
                <div className="font-semibold text-lg mb-2 text-purple-800">{section.title}</div>
                {section.lessons && section.lessons.length > 0 ? (
                  <ul className="list-decimal ml-6 space-y-1">
                    {section.lessons.map((lesson, lidx) => (
                      <li key={lesson.id || lidx} className="text-gray-800 mb-4">
                        <span className="font-medium">{lesson.title}</span>
                        {lesson.type === 0 && <span className="ml-2 text-xs text-blue-600">[Video]</span>}
                        {lesson.type === 1 && <span className="ml-2 text-xs text-green-600">[Kết hợp]</span>}
                        {lesson.type === 2 && <span className="ml-2 text-xs text-gray-600">[Bài viết]</span>}
                        {lesson.content && <span className="ml-2 text-xs text-gray-500">{lesson.content.slice(0, 40)}...</span>}
                        {lesson.content && (
                          <div className="mt-2">
                            <iframe
                              src={lesson.content}
                              title={`Video bài học: ${lesson.title}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full max-w-xl h-56 rounded border"
                            ></iframe>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 italic">Chưa có bài học</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">Chưa có chương trình học</div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseDetail; 
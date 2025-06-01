import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function CourseManagementPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedCourse, setEditedCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`https://localhost:7261/api/courses/${courseId}`);
        setCourse(response.data);
        setEditedCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://localhost:7261/api/categories');
        setCategories(response.data || []);
      } catch (error) {
        setCategories([]);
      }
    };
    if (courseId) {
      fetchCourse();
      fetchCategories();
    }
  }, [courseId]);

  const handleEditCourse = async (e) => {
    e.preventDefault();
    // Kiểm tra bắt buộc
    const name = editedCourse.title || editedCourse.name || '';
    const imageUrl = editedCourse.imageUrl || editedCourse.thumbnail || '';
    if (!name.trim() || !imageUrl.trim()) {
      alert('Vui lòng nhập đầy đủ tên khóa học và ảnh bìa!');
      return;
    }
    try {
      // Chuẩn bị dữ liệu gửi lên API
      const body = {
        id: editedCourse.id,
        name,
        price: Number(editedCourse.price) || 0,
        description: editedCourse.description,
        imageUrl,
        videoDemoUrl: editedCourse.videoDemoUrl || '',
        status: (editedCourse.status === 'published' ? 1 : 0),
        level: Number(editedCourse.level) || 0,
        categoryId: editedCourse.categoryId || editedCourse.category || 0,
        instructorId: user?.id || '',
        sections: (editedCourse.sections || []).map(section => ({
          id: section.id,
          title: section.title,
          courseId: editedCourse.id,
          lessons: (section.lessons || []).map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            type: lesson.type ?? 0,
            sectionId: section.id,
            content: lesson.content || '',
            duration: lesson.duration || ''
          }))
        }))
      };
      await axios.put(`https://localhost:7261/api/courses/${editedCourse.id}`, body, {
        headers: { 'Content-Type': 'application/json' }
      });
      // Sau khi cập nhật thành công, reload lại dữ liệu
      setCourse({ ...course, ...editedCourse });
      setShowEditForm(false);
      // Có thể thêm thông báo thành công ở đây
    } catch (error) {
      console.error('Error updating course:', error);
      // Có thể thêm thông báo lỗi ở đây
    }
  };

  const handleDeleteCourse = async () => {
    try {
      // Load courses from localStorage
      const savedCourses = localStorage.getItem('teachingCourses');
      if (savedCourses) {
        const courses = JSON.parse(savedCourses);
        
        // Filter out the course to delete
        const updatedCourses = courses.filter(c => c.id !== courseId);
        
        // Save back to localStorage
        localStorage.setItem('teachingCourses', JSON.stringify(updatedCourses));
        
        // Navigate back to teaching page
        navigate('/teaching');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl text-gray-600 mb-4">Không tìm thấy khóa học</h2>
          <button
            onClick={() => navigate('/teaching')}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/teaching')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md shadow-sm border border-gray-300 font-semibold"
        >
          <i className="fas fa-arrow-left"></i>
          Quay lại trang giảng viên
        </button>
        <div className="flex-1 flex justify-between items-center ml-4">
          <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
          <div className="flex space-x-4">
            {!showEditForm && (
              <button
                onClick={() => setShowEditForm(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
              >
                Chỉnh sửa
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
            >
              Xóa khóa học
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa khóa học "{course.title}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteCourse}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
        <div className="md:w-1/3 flex flex-col items-center p-8 bg-gradient-to-b from-purple-50 to-white">
          <img
            src={showEditForm ? (editedCourse.imageUrl || editedCourse.thumbnail || 'https://placehold.co/400x250/8b5cf6/fff?text=Course') : (course.imageUrl || course.thumbnail || 'https://placehold.co/400x250/8b5cf6/fff?text=Course')}
            alt={course.title || course.name}
            className="w-full h-64 object-cover rounded-xl border mb-6 shadow-md"
          />
          {showEditForm && (
            <input
              type="url"
              value={editedCourse.imageUrl || editedCourse.thumbnail || ''}
              onChange={e => setEditedCourse({ ...editedCourse, imageUrl: e.target.value, thumbnail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
              placeholder="URL ảnh bìa"
            />
          )}
          {course.videoDemoUrl && (
            <div className="w-full mt-2">
              <div className="text-sm text-gray-500 mb-1 font-semibold">Video demo:</div>
              <div className="aspect-video w-full rounded-xl overflow-hidden border shadow">
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
        <div className="md:w-2/3 p-8 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold mb-2 text-purple-700 flex items-center gap-2">
            <i className="fas fa-book-open text-purple-400"></i>
            {showEditForm ? (
              <input
                type="text"
                value={editedCourse.title || editedCourse.name || ''}
                onChange={e => setEditedCourse({ ...editedCourse, title: e.target.value, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-2xl"
                placeholder="Tên khóa học"
              />
            ) : (
              course.title || course.name
            )}
          </h2>
          <div className="mb-2 text-gray-500 text-sm">ID: <span className="font-mono text-xs">{course.id}</span></div>
          <div className="mb-2">
            <b className="text-gray-700">Mô tả:</b>
            {showEditForm ? (
              <textarea
                value={editedCourse.description || ''}
                onChange={e => setEditedCourse({ ...editedCourse, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
                rows={4}
                placeholder="Mô tả khóa học"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 mt-1 text-gray-800 whitespace-pre-line shadow-inner border" style={{maxHeight: 200, overflowY: 'auto'}}
                dangerouslySetInnerHTML={{ __html: course.description || '' }}
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Giá</h3>
              {showEditForm ? (
                <input
                  type="number"
                  value={editedCourse.price}
                  onChange={e => setEditedCourse({ ...editedCourse, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Giá khóa học"
                />
              ) : (
                <p className="text-lg font-bold text-purple-600">
                  {course.isFree || course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Cấp độ</h3>
              {showEditForm ? (
                <select
                  value={Number(editedCourse.level) || ''}
                  onChange={e => setEditedCourse({ ...editedCourse, level: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={1}>Cơ bản</option>
                  <option value={2}>Trung cấp</option>
                  <option value={3}>Nâng cao</option>
                </select>
              ) : (
                <p className="text-base font-semibold text-gray-900">
                  {course.level === 1 ? 'Người mới bắt đầu' :
                   course.level === 2 ? 'Trung cấp' :
                   course.level === 3 ? 'Nâng cao' : 'Không xác định'}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Danh mục</h3>
              {showEditForm ? (
                <select
                  value={editedCourse.categoryId || editedCourse.category || ''}
                  onChange={e => setEditedCourse({ ...editedCourse, categoryId: e.target.value, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-semibold text-gray-900">
                  {categories.find(cat => String(cat.id) === String(course.categoryId))?.name || 'Không xác định'}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Trạng thái</h3>
              <p className="text-base font-bold">
                {course.status === 0 ? 'Chờ duyệt' :
                 course.status === 1 ? 'Đã duyệt' :
                 course.status === 2 ? 'Từ chối' :
                 course.status === 3 ? 'Ẩn' : 'Không xác định'}
              </p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-purple-700 flex items-center gap-2">
              <i className="fas fa-list-ul text-purple-400"></i> Chương trình học
            </h2>
            {showEditForm ? (
              <DragDropContext onDragEnd={result => {
                if (!result.destination) return;
                // Kéo thả section
                if (result.type === 'section') {
                  const reordered = Array.from(editedCourse.sections || []);
                  const [removed] = reordered.splice(result.source.index, 1);
                  reordered.splice(result.destination.index, 0, removed);
                  setEditedCourse({ ...editedCourse, sections: reordered });
                }
                // Kéo thả lesson trong section
                if (result.type === 'lesson') {
                  const sectionId = result.source.droppableId;
                  const destSectionId = result.destination.droppableId;
                  if (sectionId === destSectionId) {
                    const sectionIdx = (editedCourse.sections || []).findIndex(s => String(s.id) === String(sectionId));
                    if (sectionIdx === -1) return;
                    const section = editedCourse.sections[sectionIdx];
                    const reorderedLessons = Array.from(section.lessons || []);
                    const [removed] = reorderedLessons.splice(result.source.index, 1);
                    reorderedLessons.splice(result.destination.index, 0, removed);
                    const newSections = [...editedCourse.sections];
                    newSections[sectionIdx] = { ...section, lessons: reorderedLessons };
                    setEditedCourse({ ...editedCourse, sections: newSections });
                  }
                }
              }}>
                <Droppable droppableId="sections" type="section">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
                      {(editedCourse.sections || []).map((section, idx) => (
                        <Draggable key={section.id || idx} draggableId={String(section.id || idx)} index={idx}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className="bg-white border border-purple-100 rounded-xl p-4 shadow flex flex-col gap-2">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="cursor-move text-gray-400" {...provided.dragHandleProps}><i className="fas fa-grip-vertical"></i></span>
                                <span className="font-semibold text-lg text-purple-800 flex items-center gap-2"><i className="fas fa-layer-group"></i> {section.title}</span>
                              </div>
                              <Droppable droppableId={String(section.id)} type="lesson">
                                {(provided) => (
                                  <ul ref={provided.innerRef} {...provided.droppableProps} className="list-none ml-0 space-y-2">
                                    {(section.lessons || []).map((lesson, lidx) => (
                                      <Draggable key={lesson.id || lidx} draggableId={String(lesson.id || lidx)} index={lidx}>
                                        {(provided) => (
                                          <li ref={provided.innerRef} {...provided.draggableProps} className="flex items-start gap-3 bg-purple-50 rounded-lg px-3 py-2 shadow-sm border border-purple-100">
                                            <span className="mt-1 text-purple-400" {...provided.dragHandleProps}>
                                              {lesson.type === 0 ? <i className="fas fa-play-circle"></i> : lesson.type === 1 ? <i className="fas fa-magic"></i> : <i className="fas fa-file-alt"></i>}
                                            </span>
                                            <div className="flex-1">
                                              <div className="font-medium text-gray-900">{lesson.title}</div>
                                              <div className="flex flex-wrap gap-4 text-xs mt-1">
                                                <span>Loại: {lesson.type === 0 ? 'Video' : lesson.type === 1 ? 'Kết hợp' : 'Bài viết'}</span>
                                                {lesson.duration && <span>Thời lượng: {lesson.duration}</span>}
                                              </div>
                                              {lesson.content && (
                                                <div className="mt-2 text-xs text-gray-600 break-all">Nội dung: {lesson.content}</div>
                                              )}
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
                                            </div>
                                          </li>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </ul>
                                )}
                              </Droppable>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              course.sections && course.sections.length > 0 ? (
                <div className="space-y-6">
                  {course.sections.map((section, idx) => (
                    <div key={section.id || idx} className="bg-white border border-purple-100 rounded-xl p-4 shadow flex flex-col gap-2">
                      <div className="font-semibold text-lg mb-2 text-purple-800 flex items-center gap-2">
                        <i className="fas fa-layer-group"></i> {section.title}
                      </div>
                      {section.course && (
                        <div className="text-xs text-gray-500 mb-2">Course: {section.course}</div>
                      )}
                      {section.lessons && section.lessons.length > 0 ? (
                        <ul className="list-none ml-0 space-y-2">
                          {section.lessons.map((lesson, lidx) => (
                            <li key={lesson.id || lidx} className="flex items-start gap-3 bg-purple-50 rounded-lg px-3 py-2 shadow-sm border border-purple-100">
                              <span className="mt-1 text-purple-400">
                                {lesson.type === 0 ? <i className="fas fa-play-circle"></i> : lesson.type === 1 ? <i className="fas fa-magic"></i> : <i className="fas fa-file-alt"></i>}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{lesson.title}</div>
                                {lesson.section && (
                                  <div className="text-xs text-gray-500">Section: {lesson.section}</div>
                                )}
                                <div className="flex flex-wrap gap-4 text-xs mt-1">
                                  <span>Loại: {lesson.type === 0 ? 'Video' : lesson.type === 1 ? 'Kết hợp' : 'Bài viết'}</span>
                                  {lesson.duration && <span>Thời lượng: {lesson.duration}</span>}
                                </div>
                                {lesson.content && (
                                  <div className="mt-2 text-xs text-gray-600 break-all">Nội dung: {lesson.content}</div>
                                )}
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
                              </div>
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
              )
            )}
          </div>
          {showEditForm && (
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-6 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleEditCourse}
                className="bg-purple-600 text-white px-8 py-2 rounded-md hover:bg-purple-700 font-semibold"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseManagementPage; 
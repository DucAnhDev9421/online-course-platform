import React, { useState } from 'react';
import '../assets/css/admin.css';
import AdminLayout from '../layouts/AdminLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Component quản lý danh mục
const AdminCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Lập trình', description: 'Các khóa học về lập trình' },
    { id: 2, name: 'Thiết kế', description: 'Các khóa học về thiết kế' },
    { id: 3, name: 'Kinh doanh', description: 'Các khóa học về kinh doanh' },
  ]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDesc, setEditCategoryDesc] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setMessage('Vui lòng nhập tên danh mục!');
      setMessageType('error');
      return;
    }
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: categoryName,
        description: categoryDesc,
      },
    ]);
    setMessage('Thêm danh mục thành công!');
    setMessageType('success');
    setCategoryName('');
    setCategoryDesc('');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setMessage('Đã xóa danh mục!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
    setEditCategoryDesc(category.description);
  };

  const handleSaveEdit = (id) => {
    if (!editCategoryName.trim()) {
      setMessage('Vui lòng nhập tên danh mục!');
      setMessageType('error');
      return;
    }
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { ...cat, name: editCategoryName, description: editCategoryDesc }
        : cat
    ));
    setMessage('Cập nhật danh mục thành công!');
    setMessageType('success');
    setEditingCategory(null);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName('');
    setEditCategoryDesc('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Quản lý Danh mục</h2>
      {message && (
        <div className={`mb-6 text-center py-2 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
      )}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Thêm danh mục</h3>
        <form onSubmit={handleAddCategory} className="flex flex-row gap-4">
          <input
            type="text"
            className="admin-input flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tên danh mục..."
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
          <textarea
            className="admin-input flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mô tả (không bắt buộc)"
            value={categoryDesc}
            onChange={e => setCategoryDesc(e.target.value)}
            rows={1}
          />
          <button type="submit" className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all min-w-[150px]">
            <i className="fas fa-plus mr-2"></i> Thêm danh mục
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="mb-4 font-semibold text-blue-700 text-lg">Danh sách danh mục</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên danh mục</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-gray-400 italic py-4">Chưa có danh mục nào</td>
                </tr>
              )}
              {categories.map(cat => (
                <tr key={cat.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {editingCategory === cat.id ? (
                      <input
                        type="text"
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-sm">
                    {editingCategory === cat.id ? (
                      <textarea
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editCategoryDesc}
                        onChange={(e) => setEditCategoryDesc(e.target.value)}
                        rows={1}
                      />
                    ) : (
                      cat.description || <span className="italic text-gray-300">(Không có)</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editingCategory === cat.id ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          className="text-green-500 hover:text-green-700 px-2 py-1 rounded transition-all"
                          title="Lưu thay đổi"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-all"
                          title="Hủy"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition-all"
                          title="Sửa danh mục"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all"
                          title="Xóa danh mục"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const COURSE_LEVELS = [
  { value: '', label: 'Chọn trình độ' },
  { value: 'beginner', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' },
];

const STEPS = [
  'Thông tin cơ bản',
  'Phương tiện khóa học',
  'Chương trình học',
  'Cài đặt',
];

// Component quản lý khóa học
const AdminCourses = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'ReactJS Cơ bản', description: 'Khóa học ReactJS cho người mới bắt đầu', categoryId: 1, status: 'approved' },
    { id: 2, name: 'Thiết kế UI/UX', description: 'Khóa học thiết kế giao diện người dùng', categoryId: 2, status: 'pending' },
    { id: 3, name: 'Khởi nghiệp 101', description: 'Những điều cần biết khi khởi nghiệp', categoryId: 3, status: 'rejected' },
  ]);
  const [categories] = useState([
    { id: 1, name: 'Lập trình', description: 'Các khóa học về lập trình' },
    { id: 2, name: 'Thiết kế', description: 'Các khóa học về thiết kế' },
    { id: 3, name: 'Kinh doanh', description: 'Các khóa học về kinh doanh' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [step, setStep] = useState(0);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseLevel, setCourseLevel] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseVideo, setCourseVideo] = useState('');
  const [courseImage, setCourseImage] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sections, setSections] = useState([
    {
      id: Date.now(),
      title: 'Chương 1: Giới thiệu',
      lectures: [
        { id: Date.now() + 1, title: 'Giới thiệu khóa học' },
        { id: Date.now() + 2, title: 'Cài đặt phần mềm' },
      ],
    },
  ]);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');
  const [newLectureTitle, setNewLectureTitle] = useState({}); // {sectionId: value}
  const [editingLecture, setEditingLecture] = useState({ id: null, sectionId: null, title: '' });

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseCategory) {
      setMessage('Vui lòng nhập đầy đủ thông tin khóa học!');
      setMessageType('error');
      return;
    }
    setCourses([
      ...courses,
      {
        id: Date.now(),
        name: courseTitle,
        description: courseDesc,
        categoryId: Number(courseCategory),
        level: courseLevel,
        status: 'pending',
        video: courseVideo,
        image: courseImage,
        price: coursePrice,
      },
    ]);
    setMessage('Thêm khóa học thành công!');
    setMessageType('success');
    setCourseTitle('');
    setCourseDesc('');
    setCourseCategory('');
    setCourseLevel('');
    setCourseVideo('');
    setCourseImage('');
    setCoursePrice('');
    setShowAddForm(false);
    setStep(0);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
    setMessage('Đã xóa khóa học!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleEditCourse = (course) => {
    // TODO: Implement edit functionality
    console.log('Edit course:', course);
  };

  const handleStatusChange = (courseId, newStatus) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: newStatus }
        : course
    ));
    setMessage(`Đã cập nhật trạng thái khóa học!`);
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { text: 'Đã duyệt', icon: 'fa-check-circle' },
      pending: { text: 'Chờ duyệt', icon: 'fa-clock' },
      rejected: { text: 'Từ chối', icon: 'fa-times-circle' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${status}`}>
        <i className={`fas ${config.icon} mr-1`}></i>
        {config.text}
      </span>
    );
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const tableElement = document.querySelector('.courses-table');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stepper UI
  const renderStepper = () => (
    <div className="flex items-center justify-between bg-white rounded-lg px-6 py-4 mb-8 shadow">
      {STEPS.map((label, idx) => (
        <div key={label} className="flex-1 flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${step === idx ? 'bg-purple-600' : 'bg-gray-300'}`}>{idx + 1}</div>
          <div className={`ml-3 font-semibold ${step === idx ? 'text-purple-600' : 'text-gray-500'}`}>{label}</div>
          {idx < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 mx-3" />}
        </div>
      ))}
    </div>
  );

  // Step 1: Basic Information
  const renderStep1 = () => (
    <form onSubmit={e => { e.preventDefault(); setStep(1); }} className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">Thông tin cơ bản</h3>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Tên khóa học</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nhập tên khóa học"
          value={courseTitle}
          onChange={e => setCourseTitle(e.target.value)}
          maxLength={60}
        />
        <div className="text-xs text-gray-400 mt-1">Nhập tiêu đề tối đa 60 ký tự.</div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Danh mục khóa học</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={courseCategory}
          onChange={e => setCourseCategory(e.target.value)}
        >
          <option value="">Chọn danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <div className="text-xs text-gray-400 mt-1">Chọn danh mục phù hợp cho khóa học của bạn.</div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Trình độ khóa học</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={courseLevel}
          onChange={e => setCourseLevel(e.target.value)}
        >
          {COURSE_LEVELS.map(lv => (
            <option key={lv.value} value={lv.value}>{lv.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Mô tả khóa học</label>
        <ReactQuill theme="snow" value={courseDesc} onChange={setCourseDesc} className="bg-white" />
        <div className="text-xs text-gray-400 mt-1">Tóm tắt ngắn gọn về khóa học.</div>
      </div>
      <div className="flex justify-end mt-6">
        <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Tiếp theo</button>
      </div>
    </form>
  );

  // Step 2: Courses Media
  const renderStep2 = () => (
    <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">Phương tiện khóa học</h3>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Video giới thiệu (YouTube, Vimeo, ... hoặc file)</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nhập link video giới thiệu"
          value={courseVideo}
          onChange={e => setCourseVideo(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Ảnh bìa (URL hoặc file)</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nhập link ảnh bìa"
          value={courseImage}
          onChange={e => setCourseImage(e.target.value)}
        />
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" onClick={() => setStep(0)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">Quay lại</button>
        <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Tiếp theo</button>
      </div>
    </form>
  );

  // Step 3: Curriculum (placeholder)
  const renderStep3 = () => (
    <form onSubmit={e => { e.preventDefault(); setStep(3); }} className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">Chương trình học</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
              {sections.map((section, sIdx) => (
                <Draggable key={section.id} draggableId={section.id.toString()} index={sIdx}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="bg-gray-50 rounded-lg p-4 shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2" {...provided.dragHandleProps}>
                          <span className="cursor-move text-gray-400"><i className="fas fa-grip-vertical"></i></span>
                          {editingSectionId === section.id ? (
                            <input
                              className="border px-2 py-1 rounded"
                              value={editingSectionTitle}
                              onChange={e => setEditingSectionTitle(e.target.value)}
                            />
                          ) : (
                            <span className="font-semibold text-lg">{section.title}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {editingSectionId === section.id ? (
                            <>
                              <button type="button" onClick={() => handleSaveEditSection(section.id)} className="text-green-600"><i className="fas fa-check"></i></button>
                              <button type="button" onClick={() => setEditingSectionId(null)} className="text-gray-500"><i className="fas fa-times"></i></button>
                            </>
                          ) : (
                            <>
                              <button type="button" onClick={() => handleEditSection(section.id, section.title)} className="text-blue-500"><i className="fas fa-edit"></i></button>
                              <button type="button" onClick={() => handleDeleteSection(section.id)} className="text-red-500"><i className="fas fa-trash"></i></button>
                            </>
                          )}
                        </div>
                      </div>
                      {/* Lectures */}
                      <Droppable droppableId={section.id.toString()} type="lecture">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                            {section.lectures.map((lecture, lIdx) => (
                              <Draggable key={lecture.id} draggableId={lecture.id.toString()} index={lIdx}>
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center justify-between bg-white rounded px-3 py-2 shadow-sm">
                                    <div className="flex items-center gap-2" {...provided.dragHandleProps}>
                                      <span className="cursor-move text-gray-400"><i className="fas fa-grip-vertical"></i></span>
                                      {editingLecture.id === lecture.id && editingLecture.sectionId === section.id ? (
                                        <input
                                          className="border px-2 py-1 rounded"
                                          value={editingLecture.title}
                                          onChange={e => setEditingLecture({ ...editingLecture, title: e.target.value })}
                                        />
                                      ) : (
                                        <span>{lecture.title}</span>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      {editingLecture.id === lecture.id && editingLecture.sectionId === section.id ? (
                                        <>
                                          <button type="button" onClick={handleSaveEditLecture} className="text-green-600"><i className="fas fa-check"></i></button>
                                          <button type="button" onClick={() => setEditingLecture({ id: null, sectionId: null, title: '' })} className="text-gray-500"><i className="fas fa-times"></i></button>
                                        </>
                                      ) : (
                                        <>
                                          <button type="button" onClick={() => handleEditLecture(section.id, lecture)} className="text-blue-500"><i className="fas fa-edit"></i></button>
                                          <button type="button" onClick={() => handleDeleteLecture(section.id, lecture.id)} className="text-red-500"><i className="fas fa-trash"></i></button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      {/* Add Lecture */}
                      <div className="flex gap-2 mt-3">
                        <input
                          className="flex-1 border px-2 py-1 rounded"
                          placeholder="Tên bài học mới..."
                          value={newLectureTitle[section.id] || ''}
                          onChange={e => setNewLectureTitle({ ...newLectureTitle, [section.id]: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddLecture(section.id))}
                        />
                        <button type="button" onClick={() => handleAddLecture(section.id)} className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 font-semibold">Thêm bài học</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/* Add Section */}
      <div className="flex gap-2 mt-6">
        <input
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Tên chương mới..."
          value={newSectionTitle}
          onChange={e => setNewSectionTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSection())}
        />
        <button type="button" onClick={handleAddSection} className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold">Thêm chương</button>
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={() => setStep(1)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">Quay lại</button>
        <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Tiếp theo</button>
      </div>
    </form>
  );

  // Step 4: Settings
  const renderStep4 = () => (
    <form onSubmit={handleAddCourse} className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">Cài đặt</h3>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Giá khóa học (VNĐ)</label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nhập giá khóa học"
          value={coursePrice}
          onChange={e => setCoursePrice(e.target.value)}
          min="0"
        />
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" onClick={() => setStep(2)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">Quay lại</button>
        <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Lưu</button>
      </div>
    </form>
  );

  // Thêm Section
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    setSections([
      ...sections,
      { id: Date.now(), title: newSectionTitle, lectures: [] },
    ]);
    setNewSectionTitle('');
  };
  // Sửa Section
  const handleEditSection = (id, title) => {
    setEditingSectionId(id);
    setEditingSectionTitle(title);
  };
  const handleSaveEditSection = (id) => {
    setSections(sections.map(s => s.id === id ? { ...s, title: editingSectionTitle } : s));
    setEditingSectionId(null);
    setEditingSectionTitle('');
  };
  const handleDeleteSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };
  // Thêm Lecture
  const handleAddLecture = (sectionId) => {
    if (!newLectureTitle[sectionId] || !newLectureTitle[sectionId].trim()) return;
    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, lectures: [...s.lectures, { id: Date.now(), title: newLectureTitle[sectionId] }] }
        : s
    ));
    setNewLectureTitle({ ...newLectureTitle, [sectionId]: '' });
  };
  // Sửa Lecture
  const handleEditLecture = (sectionId, lecture) => {
    setEditingLecture({ id: lecture.id, sectionId, title: lecture.title });
  };
  const handleSaveEditLecture = () => {
    setSections(sections.map(s =>
      s.id === editingLecture.sectionId
        ? { ...s, lectures: s.lectures.map(l => l.id === editingLecture.id ? { ...l, title: editingLecture.title } : l) }
        : s
    ));
    setEditingLecture({ id: null, sectionId: null, title: '' });
  };
  const handleDeleteLecture = (sectionId, lectureId) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, lectures: s.lectures.filter(l => l.id !== lectureId) }
        : s
    ));
  };
  // Kéo thả Section và Lecture
  const onDragEnd = (result) => {
    if (!result.destination) return;
    // Kéo thả Section
    if (result.type === 'section') {
      const reordered = Array.from(sections);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setSections(reordered);
    }
    // Kéo thả Lecture trong Section
    if (result.type === 'lecture') {
      const sectionId = parseInt(result.source.droppableId);
      const destSectionId = parseInt(result.destination.droppableId);
      if (sectionId === destSectionId) {
        const section = sections.find(s => s.id === sectionId);
        const reorderedLectures = Array.from(section.lectures);
        const [removed] = reorderedLectures.splice(result.source.index, 1);
        reorderedLectures.splice(result.destination.index, 0, removed);
        setSections(sections.map(s =>
          s.id === sectionId ? { ...s, lectures: reorderedLectures } : s
        ));
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Quản lý Khóa học</h2>
      {message && (
        <div className={`mb-6 text-center py-2 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
      )}
      {!showAddForm && (
        <div className="flex justify-end mb-4">
          <button
            className="py-2 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-teal-700 transition-all"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus mr-2"></i> Thêm khóa học
          </button>
        </div>
      )}
      {showAddForm ? (
        <>
          {renderStepper()}
          {step === 0 && renderStep1()}
          {step === 1 && renderStep2()}
          {step === 2 && renderStep3()}
          {step === 3 && renderStep4()}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-green-700 text-lg">Danh sách khóa học</h4>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  className="admin-input pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tìm kiếm khóa học..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCourses.length)} của {filteredCourses.length} khóa học
              </div>
            </div>
          </div>
          <div className="overflow-x-auto courses-table">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tên khóa học</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Danh mục</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <i className="fas fa-search text-4xl mb-2"></i>
                        <p>Không tìm thấy khóa học nào</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map(course => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{course.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {categories.find(c => c.id === course.categoryId)?.name || 'Không rõ danh mục'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {course.description || <span className="italic text-gray-300">(Không có)</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {getStatusBadge(course.status)}
                          <div className="status-dropdown">
                            <button className="status-dropdown-button">
                              <i className="fas fa-chevron-down text-xs"></i>
                            </button>
                            <div className="status-dropdown-menu">
                              <button
                                onClick={() => handleStatusChange(course.id, 'approved')}
                                className="status-dropdown-item approved"
                              >
                                <i className="fas fa-check-circle"></i>
                                Đã duyệt
                              </button>
                              <button
                                onClick={() => handleStatusChange(course.id, 'pending')}
                                className="status-dropdown-item pending"
                              >
                                <i className="fas fa-clock"></i>
                                Chờ duyệt
                              </button>
                              <button
                                onClick={() => handleStatusChange(course.id, 'rejected')}
                                className="status-dropdown-item rejected"
                              >
                                <i className="fas fa-times-circle"></i>
                                Từ chối
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition-all"
                            title="Chỉnh sửa khóa học"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all"
                            title="Xóa khóa học"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Trang {currentPage} của {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component chính để quản lý cả hai
const AdminCoursesManagement = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <AdminLayout>
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'courses'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Quản lý Khóa học
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'categories'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Quản lý Danh mục
            </button>
          </div>
        </div>
        {activeTab === 'courses' ? <AdminCourses /> : <AdminCategories />}
      </div>
    </AdminLayout>
  );
};

export default AdminCoursesManagement; 
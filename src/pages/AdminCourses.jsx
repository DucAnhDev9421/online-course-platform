import React, { useState, useEffect } from 'react';
import '../assets/css/admin.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';

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

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'approved', label: 'Đã duyệt' },
  { key: 'pending', label: 'Chờ duyệt' },
];

const AdminCourses = () => {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
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
  const [newLectureTitle, setNewLectureTitle] = useState({});
  const [editingLecture, setEditingLecture] = useState({ id: null, sectionId: null, title: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Thêm useEffect để lấy danh sách danh mục khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await axios.get('https://localhost:7261/api/categories');
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setMessage('Có lỗi xảy ra khi tải danh mục!');
        setMessageType('error');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Thêm useEffect để lấy danh sách khóa học khi component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://localhost:7261/api/courses');
        if (response.data) {
          // Chuyển đổi dữ liệu từ API sang định dạng phù hợp với UI
          const formattedCourses = response.data.map(course => ({
            id: course.id,
            name: course.name,
            date: new Date().toISOString().split('T')[0], // Tạm thời dùng ngày hiện tại
            instructor: 'Chưa có giảng viên', // Tạm thời
            instructorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg', // Tạm thời
            status: course.status === 0 ? 'pending' : course.status === 1 ? 'approved' : 'rejected',
            statusText: course.statusText,
            level: course.level,
            levelText: course.levelText,
            categoryId: course.categoryId,
            categoryName: course.categoryName,
            price: course.price,
            description: course.description,
            image: course.imageUrl || 'https://placehold.co/80x80/8b5cf6/fff?text=Course',
          }));
          setCourses(formattedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setMessage('Có lỗi xảy ra khi tải danh sách khóa học!');
        setMessageType('error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseCategory) {
      setMessage('Vui lòng nhập đầy đủ thông tin khóa học!');
      setMessageType('error');
      return;
    }

    try {
      // Chuyển đổi level từ string sang number
      const levelMap = {
        'beginner': 0,
        'intermediate': 1,
        'advanced': 2
      };

      // Chuẩn bị dữ liệu gửi lên API
      const courseData = {
        name: courseTitle,
        price: Number(coursePrice) || 0,
        description: courseDesc,
        imageUrl: courseImage,
        status: 0, // pending
        level: levelMap[courseLevel] || 0,
        categoryId: Number(courseCategory),
        sections: sections.map(section => ({
          title: section.title,
          lessons: section.lectures.map(lecture => ({
            title: lecture.title,
            type: lecture.contentType === 'video' ? 0 : 
                  lecture.contentType === 'mixed' ? 1 : 2,
            content: lecture.contentType === 'video' ? lecture.videoUrl : ''
          }))
        }))
      };

      // Gọi API tạo khóa học
      const response = await axios.post('https://localhost:7261/api/courses', courseData);

      if (response.data) {
        // Thêm khóa học mới vào danh sách
        const newCourse = {
          id: response.data.id,
          name: response.data.name,
          date: new Date().toISOString().split('T')[0],
          instructor: 'Chưa có giảng viên',
          instructorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          status: 'pending',
          statusText: 'Pending',
          level: response.data.level,
          levelText: response.data.levelText,
          categoryId: response.data.categoryId,
          categoryName: response.data.categoryName,
          price: response.data.price,
          description: response.data.description,
          image: response.data.imageUrl || 'https://placehold.co/80x80/8b5cf6/fff?text=Course',
        };
        setCourses([...courses, newCourse]);

        setMessage('Thêm khóa học thành công!');
        setMessageType('success');
        
        // Reset form
        setCourseTitle('');
        setCourseDesc('');
        setCourseCategory('');
        setCourseLevel('');
        setCourseVideo('');
        setCourseImage('');
        setCoursePrice('');
        setSections([{
          id: Date.now(),
          title: 'Chương 1: Giới thiệu',
          lectures: [
            { id: Date.now() + 1, title: 'Giới thiệu khóa học' },
            { id: Date.now() + 2, title: 'Cài đặt phần mềm' },
          ],
        }]);
        setShowAddForm(false);
        setStep(0);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setMessage('Có lỗi xảy ra khi thêm khóa học!');
      setMessageType('error');
    }

    setTimeout(() => setMessage(''), 2000);
  };

  const handleDeleteCourse = async (id) => {
    try {
      const response = await axios.delete(`https://localhost:7261/api/courses/${id}`);
      if (response.status === 200) {
        setCourses(courses.filter((c) => c.id !== id));
        setMessage('Đã xóa khóa học!');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      setMessage('Có lỗi xảy ra khi xóa khóa học!');
      setMessageType('error');
    }
    setTimeout(() => setMessage(''), 2000);
  };

  const handleEditCourse = (course) => {
    // TODO: Implement edit functionality
    console.log('Edit course:', course);
  };

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      const statusMap = {
        'pending': 0,
        'approved': 1,
        'rejected': 2
      };
      await axios.patch(
        `https://localhost:7261/api/courses/${courseId}/status`,
        statusMap[newStatus],
        { headers: { 'Content-Type': 'application/json' } }
      );
      setCourses(courses.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              status: newStatus,
              statusText: newStatus === 'pending' ? 'Pending' : 
                         newStatus === 'approved' ? 'Approved' : 'Rejected'
            }
          : course
      ));
      setMessage(`Đã cập nhật trạng thái khóa học!`);
      setMessageType('success');
    } catch (error) {
      console.error('Error updating course status:', error);
      setMessage('Có lỗi xảy ra khi cập nhật trạng thái khóa học!');
      setMessageType('error');
    }
    setTimeout(() => setMessage(''), 2000);
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="flex items-center text-green-600"><span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>Đã duyệt</span>;
    if (status === 'pending') return <span className="flex items-center text-yellow-600"><span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>Chờ duyệt</span>;
    if (status === 'rejected') return <span className="flex items-center text-red-600"><span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>Từ chối</span>;
    return <span className="flex items-center text-gray-600"><span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>Không xác định</span>;
  };

  const filteredCourses = courses.filter(c => {
    if (tab === 'all') return c.name.toLowerCase().includes(search.toLowerCase());
    return c.status === tab && c.name.toLowerCase().includes(search.toLowerCase());
  });

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
                              <button type="button" onClick={handleSaveEditSection} className="text-green-600"><i className="fas fa-check"></i></button>
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
                                        <>
                                          <span>{lecture.title}</span>
                                          {/* Dropdown chọn loại nội dung */}
                                          <select
                                            className="ml-2 border rounded px-1 py-0.5 text-xs"
                                            value={lecture.contentType || ''}
                                            onChange={e => handleChangeLectureContentType(section.id, lecture.id, e.target.value)}
                                          >
                                            <option value="">Chọn loại nội dung</option>
                                            <option value="video">Video</option>
                                            <option value="mixed">Bài giảng kết hợp</option>
                                            <option value="article">Bài viết</option>
                                          </select>
                                          {/* Nếu là video thì hiện ô nhập URL */}
                                          {lecture.contentType === 'video' && (
                                            <input
                                              type="text"
                                              className="ml-2 border rounded px-2 py-1 text-xs"
                                              placeholder="Nhập URL video..."
                                              value={lecture.videoUrl || ''}
                                              onChange={e => handleChangeLectureVideoUrl(section.id, lecture.id, e.target.value)}
                                              style={{ minWidth: 180 }}
                                            />
                                          )}
                                        </>
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
    if (!newSectionTitle.trim()) {
      setMessage('Vui lòng nhập tên chương!');
      setMessageType('error');
      return;
    }

    const newSection = {
      id: Date.now(),
      title: newSectionTitle,
      lectures: []
    };

    setSections([...sections, newSection]);
    setNewSectionTitle('');
    setMessage('Đã thêm chương mới!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  // Thêm Lecture
  const handleAddLecture = (sectionId) => {
    if (!newLectureTitle[sectionId] || !newLectureTitle[sectionId].trim()) {
      setMessage('Vui lòng nhập tên bài học!');
      setMessageType('error');
      return;
    }

    const newLecture = {
      id: Date.now(),
      title: newLectureTitle[sectionId],
      contentType: '',
      videoUrl: ''
    };

    setSections(sections.map(section => 
      section.id === sectionId
        ? { ...section, lectures: [...section.lectures, newLecture] }
        : section
    ));

    setNewLectureTitle({ ...newLectureTitle, [sectionId]: '' });
    setMessage('Đã thêm bài học mới!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  // Sửa Section
  const handleEditSection = (id, title) => {
    setEditingSectionId(id);
    setEditingSectionTitle(title);
  };

  const handleSaveEditSection = () => {
    if (!editingSectionTitle.trim()) {
      setMessage('Vui lòng nhập tên chương!');
      setMessageType('error');
      return;
    }

    setSections(sections.map(section =>
      section.id === editingSectionId
        ? { ...section, title: editingSectionTitle }
        : section
    ));

    setEditingSectionId(null);
    setEditingSectionTitle('');
    setMessage('Đã cập nhật tên chương!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDeleteSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
    setMessage('Đã xóa chương!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  // Sửa Lecture
  const handleEditLecture = (sectionId, lecture) => {
    setEditingLecture({ id: lecture.id, sectionId, title: lecture.title });
  };

  const handleSaveEditLecture = () => {
    if (!editingLecture.title.trim()) {
      setMessage('Vui lòng nhập tên bài học!');
      setMessageType('error');
      return;
    }

    setSections(sections.map(section =>
      section.id === editingLecture.sectionId
        ? {
            ...section,
            lectures: section.lectures.map(lecture =>
              lecture.id === editingLecture.id
                ? { ...lecture, title: editingLecture.title }
                : lecture
            )
          }
        : section
    ));

    setEditingLecture({ id: null, sectionId: null, title: '' });
    setMessage('Đã cập nhật tên bài học!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDeleteLecture = (sectionId, lectureId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            lectures: section.lectures.filter(lecture => lecture.id !== lectureId)
          }
        : section
    ));
    setMessage('Đã xóa bài học!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  // Thay đổi loại nội dung bài học
  const handleChangeLectureContentType = (sectionId, lectureId, contentType) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            lectures: section.lectures.map(lecture =>
              lecture.id === lectureId
                ? { ...lecture, contentType }
                : lecture
            )
          }
        : section
    ));
  };

  // Thay đổi URL video bài học
  const handleChangeLectureVideoUrl = (sectionId, lectureId, videoUrl) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            lectures: section.lectures.map(lecture =>
              lecture.id === lectureId
                ? { ...lecture, videoUrl }
                : lecture
            )
          }
        : section
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500 flex items-center space-x-2">
        <span className="text-purple-600 font-semibold cursor-pointer">Dashboard</span>
        <span>/</span>
        <span className="text-purple-600 font-semibold cursor-pointer">Khóa học</span>
        <span>/</span>
        <span>{tab === 'all' ? 'Tất cả' : tab === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Khóa học</h1>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
          onClick={() => setShowAddForm(true)}
        >
          <i className="fas fa-plus mr-2"></i> Thêm khóa học mới
        </button>
      </div>
      {showAddForm ? (
        <>
          {renderStepper()}
          {step === 0 && renderStep1()}
          {step === 1 && renderStep2()}
          {step === 2 && renderStep3()}
          {step === 3 && renderStep4()}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`px-4 py-2 -mb-px font-medium border-b-2 transition-colors ${tab === t.key ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-purple-600'}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học"
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="text-left text-gray-700 text-sm">
                    <th className="py-2 px-4">Khóa học</th>
                    <th className="py-2 px-4">Giảng viên</th>
                    <th className="py-2 px-4">Trạng thái</th>
                    <th className="py-2 px-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-400">Không có khóa học nào</td></tr>
                  ) : filteredCourses.map(course => (
                    <tr key={course.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img src={course.image} alt="thumb" className="w-14 h-14 rounded-lg object-cover" />
                          <div>
                            <div className="font-semibold text-gray-900 truncate max-w-xs">{course.name}</div>
                            <div className="text-xs text-gray-500">Thêm ngày {course.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <span>{course.instructor}</span>
                      </td>
                      <td className="py-3 px-4 align-top">{getStatusBadge(course.status)}</td>
                      <td className="py-3 px-4 align-top space-x-2">
                        {course.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(course.id, 'rejected')} 
                              className="border px-3 py-1 rounded text-gray-700 hover:bg-gray-100"
                            >
                              Từ chối
                            </button>
                            <button 
                              onClick={() => handleStatusChange(course.id, 'approved')} 
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              Duyệt
                            </button>
                          </>
                        )}
                        {course.status === 'approved' && (
                          <button 
                            onClick={() => handleStatusChange(course.id, 'pending')} 
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          >
                            Đổi trạng thái
                          </button>
                        )}
                        {course.status === 'rejected' && (
                          <button 
                            onClick={() => handleStatusChange(course.id, 'pending')} 
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          >
                            Đổi trạng thái
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses; 
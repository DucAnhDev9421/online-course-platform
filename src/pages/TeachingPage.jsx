import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import InstructorLayout from '../layouts/InstructorLayout';
import DashboardTeacher from './DashboardTeacher';
import CourseWizardForm from '../components/course/CourseWizardForm';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

function TeachingPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('performance');
  const [step, setStep] = useState(0);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseLevel, setCourseLevel] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseTopics, setCourseTopics] = useState(['']);
  const [courseVideo, setCourseVideo] = useState('');
  const [courseImage, setCourseImage] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [categories, setCategories] = useState([]);
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
  const [openDropdown, setOpenDropdown] = useState(null);

  // Load categories when component mounts
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
        toast.error('Có lỗi xảy ra khi tải danh mục!');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Load courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://localhost:7261/api/courses/instructor/${user?.id}`);
        if (response.data) {
          const formattedCourses = response.data.map(course => ({
            id: course.id,
            name: course.name,
            date: new Date().toISOString().split('T')[0],
            instructor: course.instructor || null,
            status: course.status === 0 ? 'pending' : course.status === 1 ? 'approved' : 'rejected',
            statusText: course.statusText,
            level: course.level,
            levelText: course.levelText,
            categoryId: course.categoryId,
            categoryName: course.categoryName,
            price: course.price,
            description: course.description,
            image: course.imageUrl || 'https://placehold.co/80x80/8b5cf6/fff?text=Course',
            videoDemoUrl: course.videoDemoUrl || '',
            averageRating: course.averageRating || 0,
            enrollmentCount: course.enrollmentCount || 0,
          }));
          setCourses(formattedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Có lỗi xảy ra khi tải danh sách khóa học!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user?.id]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseCategory) {
      toast.error('Vui lòng nhập đầy đủ thông tin khóa học!');
      return;
    }

    try {
      setIsLoading(true);
      const levelMap = {
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3
      };

      const courseData = {
        name: courseTitle,
        price: Number(coursePrice) || 0,
        description: courseDesc,
        imageUrl: courseImage,
        videoDemoUrl: courseVideo,
        status: 0,
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
        })),
        InstructorId: user?.id,
        topics: courseTopics.filter(t => t.trim()),
      };

      const response = await axios.post('https://localhost:7261/api/courses', courseData);

      if (response.data) {
        toast.success('Thêm khóa học thành công!');
        
        // Reset form
        setCourseTitle('');
        setCourseDesc('');
        setCourseCategory('');
        setCourseLevel('');
        setCourseTopics(['']);
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
        setShowCreateForm(false);
        setStep(0);

        // Fetch updated courses list
        const coursesResponse = await axios.get('https://localhost:7261/api/courses');
        if (coursesResponse.data) {
          const formattedCourses = coursesResponse.data.map(course => ({
            id: course.id,
            name: course.name,
            date: new Date().toISOString().split('T')[0],
            instructor: course.instructor || null,
            status: course.status === 0 ? 'pending' : course.status === 1 ? 'approved' : 'rejected',
            statusText: course.statusText,
            level: course.level,
            levelText: course.levelText,
            categoryId: course.categoryId,
            categoryName: course.categoryName,
            price: course.price,
            description: course.description,
            image: course.imageUrl || 'https://placehold.co/80x80/8b5cf6/fff?text=Course',
            videoDemoUrl: course.videoDemoUrl || '',
            averageRating: course.averageRating || 0,
            enrollmentCount: course.enrollmentCount || 0,
          }));
          setCourses(formattedCourses);
        }
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Có lỗi xảy ra khi thêm khóa học!');
    } finally {
      setIsLoading(false);
    }
  };

  // Section and Lecture handlers
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      toast.error('Vui lòng nhập tên chương!');
      return;
    }

    const newSection = {
      id: Date.now(),
      title: newSectionTitle,
      lectures: []
    };

    setSections([...sections, newSection]);
    setNewSectionTitle('');
    toast.success('Đã thêm chương mới!');
  };

  const handleAddLecture = (sectionId) => {
    if (!newLectureTitle[sectionId] || !newLectureTitle[sectionId].trim()) {
      toast.error('Vui lòng nhập tên bài học!');
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
    toast.success('Đã thêm bài học mới!');
  };

  const handleEditSection = (id, title) => {
    setEditingSectionId(id);
    setEditingSectionTitle(title);
  };

  const handleSaveEditSection = () => {
    if (!editingSectionTitle.trim()) {
      toast.error('Vui lòng nhập tên chương!');
      return;
    }

    setSections(sections.map(section =>
      section.id === editingSectionId
        ? { ...section, title: editingSectionTitle }
        : section
    ));

    setEditingSectionId(null);
    setEditingSectionTitle('');
    toast.success('Đã cập nhật tên chương!');
  };

  const handleDeleteSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
    toast.success('Đã xóa chương!');
  };

  const handleEditLecture = (sectionId, lecture) => {
    setEditingLecture({ id: lecture.id, sectionId, title: lecture.title });
  };

  const handleSaveEditLecture = () => {
    if (!editingLecture.title.trim()) {
      toast.error('Vui lòng nhập tên bài học!');
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
    toast.success('Đã cập nhật tên bài học!');
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
    toast.success('Đã xóa bài học!');
  };

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

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    if (result.type === 'section') {
      const reordered = Array.from(sections);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setSections(reordered);
    }
    
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

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(c => c.id !== courseId));
    toast.success('Đã xóa khóa học!');
  };

  // Render stepper
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
        <label className="block font-semibold mb-1">Nội dung bài học</label>
        <div className="space-y-2">
          {courseTopics.map((topic, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={`Nội dung ${idx + 1}`}
                value={topic}
                onChange={e => {
                  const newTopics = [...courseTopics];
                  newTopics[idx] = e.target.value;
                  setCourseTopics(newTopics);
                }}
              />
              {courseTopics.length > 1 && (
                <button type="button" onClick={() => setCourseTopics(courseTopics.filter((_, i) => i !== idx))} className="text-red-500 px-2 py-1 rounded hover:bg-red-100">Xóa</button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCourseTopics([...courseTopics, ''])}
            className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 font-semibold"
          >
            + Thêm nội dung
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-1">Mỗi dòng là một ý nội dung. Khi hiển thị sẽ tự động xuống dòng và có dấu tick.</div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Mô tả khóa học</label>
        <ReactQuill theme="snow" value={courseDesc} onChange={setCourseDesc} className="bg-white" />
      </div>
      <div className="flex justify-end mt-6">
        <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Tiếp theo</button>
      </div>
    </form>
  );

  // Step 2: Course Media
  const renderStep2 = () => (
    <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">Phương tiện khóa học</h3>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Video giới thiệu</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nhập link video giới thiệu"
          value={courseVideo}
          onChange={e => setCourseVideo(e.target.value)}
        />
      </div>
      {courseImage && (
        <div className="mb-2 flex justify-center">
          <img src={courseImage} alt="Preview" className="max-h-48 rounded shadow border" />
        </div>
      )}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Ảnh bìa</label>
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

  // Step 3: Curriculum
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
    <form onSubmit={handleCreateCourse} className="bg-white rounded-lg shadow-lg p-6">
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

  return (
    <InstructorLayout sidebarTab={sidebarTab} setSidebarTab={setSidebarTab}>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-10">
        <div className="container mx-auto px-6 py-8 bg-white/90 rounded-2xl shadow-2xl border border-gray-200">
          {sidebarTab === 'performance' && <DashboardTeacher courses={courses} />}

          {sidebarTab === 'courses' && (
            <>
              {showCreateForm ? (
                <>
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md shadow-sm border border-gray-300 font-semibold"
                    >
                      <i className="fas fa-arrow-left"></i>
                      Quay lại danh sách
                    </button>
                  </div>
                  {renderStepper()}
                  {step === 0 && renderStep1()}
                  {step === 1 && renderStep2()}
                  {step === 2 && renderStep3()}
                  {step === 3 && renderStep4()}
                </>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold">Khóa học</h1>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 shadow-md transition flex items-center gap-2 self-end md:self-auto"
                    >
                      <i className="fas fa-plus"></i> Thêm khóa học mới
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="Tìm kiếm khóa học của bạn"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      // onChange={...} // Có thể thêm logic tìm kiếm nếu muốn
                    />
                    <select className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Sắp xếp theo</option>
                      <option value="name">Tên khóa học</option>
                      <option value="students">Số học viên</option>
                      <option value="rating">Đánh giá</option>
                      <option value="status">Trạng thái</option>
                    </select>
                  </div>
                  <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Khóa học</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Học viên</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Đánh giá</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {courses.map((course) => (
                          <tr key={course.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 flex items-center gap-4 min-w-[320px]">
                              <img src={course.image} alt={course.name} className="w-16 h-16 rounded-lg object-cover border shadow" />
                              <div>
                                <div className="font-semibold text-base text-gray-900 line-clamp-1">{course.name}</div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span><i className="fas fa-clock mr-1"></i>1h 30m</span>
                                  <span><i className="fas fa-signal mr-1"></i>{course.level === 1 ? 'Cơ bản' : course.level === 2 ? 'Trung cấp' : course.level === 3 ? 'Nâng cao' : 'Không xác định'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-gray-700">{course.students?.toLocaleString('vi-VN') || '0'}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-bold text-yellow-500">{course.averageRating?.toFixed(1) || '0.0'}</span>
                              <i className="fas fa-star text-yellow-400 ml-1"></i>
                              <span className="text-xs text-gray-500 ml-1">({course.enrollmentCount?.toLocaleString('vi-VN') || '0'})</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {course.status === 1 ? (
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{course.statusText}</span>
                              ) : (
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{course.statusText}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right relative">
                              <div className="inline-block text-left">
                                <button
                                  className="text-gray-400 hover:text-purple-600 text-xl focus:outline-none"
                                  onClick={() => setOpenDropdown(openDropdown === course.id ? null : course.id)}
                                >
                                  <i className="fas fa-ellipsis-v"></i>
                                </button>
                                {openDropdown === course.id && (
                                  <div
                                    className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                                    onMouseLeave={() => setOpenDropdown(null)}
                                  >
                                    <button
                                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-t-lg"
                                      onClick={() => { setOpenDropdown(null); window.location.href = `/teaching/courses/${course.id}`; }}
                                    >
                                      <i className="fas fa-edit mr-2 text-purple-500"></i> Chỉnh sửa
                                    </button>
                                    <button
                                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 rounded-b-lg"
                                      onClick={() => { setOpenDropdown(null); handleDeleteCourse(course.id); }}
                                    >
                                      <i className="fas fa-trash mr-2"></i> Xóa khóa học
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {courses.length === 0 && (
                      <div className="flex items-center justify-between bg-white rounded-lg shadow p-8 mt-8" style={{ minHeight: 120 }}>
                        <div className="text-xl font-medium text-gray-700">
                          Chưa có khóa học nào, hãy bắt đầu tạo khóa học mới!
                        </div>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="bg-purple-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors shadow-md"
                        >
                          Thêm khóa học mới
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </InstructorLayout>
  );
}

export default TeachingPage; 
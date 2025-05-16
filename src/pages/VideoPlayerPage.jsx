import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactPlayer from 'react-player';

const VideoPlayerPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(null);
  // Dữ liệu mẫu cho chương và bài học
  const sampleSections = [
    {
      id: 1,
      title: 'Chương 1: Giới thiệu',
      lessons: [
        { id: 1, title: 'Giới thiệu về React', duration: '15:30', videoUrl: 'https://example.com/video1.mp4', completed: true },
        { id: 2, title: 'Cài đặt môi trường', duration: '20:15', videoUrl: 'https://example.com/video2.mp4', completed: false },
      ],
    },
    {
      id: 2,
      title: 'Chương 2: Cơ bản về React',
      lessons: [
        { id: 3, title: 'Components và Props', duration: '25:45', videoUrl: 'https://example.com/video3.mp4', completed: false },
        { id: 4, title: 'State và Lifecycle', duration: '18:20', videoUrl: 'https://example.com/video4.mp4', completed: false },
      ],
    },
  ];
  const [sections, setSections] = useState(sampleSections);
  const [notes, setNotes] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [openSectionIds, setOpenSectionIds] = useState([sampleSections[0].id]);

  // Tìm bài học hiện tại
  useEffect(() => {
    let foundLesson = null;
    for (const section of sections) {
      const lesson = section.lessons.find(l => l.id === parseInt(lessonId));
      if (lesson) {
        // Demo: override videoUrl thành link YouTube
        foundLesson = { ...lesson, videoUrl: 'https://youtu.be/x0fSBAgBrOQ?list=PL_-VfJajZj0UXjlKfBwFX73usByw3Ph9Q' };
        setCurrentLesson(foundLesson);
        break;
      }
    }
  }, [lessonId, sections]);

  // Cập nhật tiến độ khi sections thay đổi
  useEffect(() => {
    const allLessons = sections.flatMap(section => section.lessons);
    const completedCount = allLessons.filter(lesson => lesson.completed).length;
    const totalLessons = allLessons.length;
    const newProgress = (completedCount / totalLessons) * 100;
    setProgress(newProgress);
  }, [sections]);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem(`notes_${courseId}_${lessonId}`) || '[]');
    setSavedNotes(storedNotes);
  }, [courseId, lessonId]);

  // Xử lý khi chọn bài học khác
  const handleLessonSelect = (lesson) => {
    navigate(`/courses/${courseId}/lessons/${lesson.id}`);
  };

  // Xử lý chuyển đến bài học trước
  const handlePreviousLesson = () => {
    const allLessons = sections.flatMap(section => section.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      handleLessonSelect(allLessons[currentIndex - 1]);
    }
  };

  // Xử lý chuyển đến bài học tiếp theo
  const handleNextLesson = () => {
    const allLessons = sections.flatMap(section => section.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      handleLessonSelect(allLessons[currentIndex + 1]);
    }
  };

  const handleSaveNote = () => {
    if (!notes || notes === '<p><br></p>') return;
    const newNote = {
      id: editingNoteId || Date.now(),
      content: notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    let updatedNotes;
    if (editingNoteId) {
      updatedNotes = savedNotes.map(note => note.id === editingNoteId ? newNote : note);
    } else {
      updatedNotes = [...savedNotes, newNote];
    }
    setSavedNotes(updatedNotes);
    localStorage.setItem(`notes_${courseId}_${lessonId}`, JSON.stringify(updatedNotes));
    setNotes('');
    setEditingNoteId(null);
  };

  const handleEditNote = (note) => {
    setNotes(note.content);
    setEditingNoteId(note.id);
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = savedNotes.filter(note => note.id !== noteId);
    setSavedNotes(updatedNotes);
    localStorage.setItem(`notes_${courseId}_${lessonId}`, JSON.stringify(updatedNotes));
  };

  const handleCancelEdit = () => {
    setNotes('');
    setEditingNoteId(null);
  };

  // Xử lý đánh dấu hoàn thành bài học
  const handleCompleteLesson = () => {
    if (!currentLesson) return;
    const updatedSections = sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson =>
        lesson.id === currentLesson.id ? { ...lesson, completed: true } : lesson
      ),
    }));
    setSections(updatedSections);
    // Cập nhật bài học hiện tại
    let updatedCurrentLesson = null;
    for (const section of updatedSections) {
      const lesson = section.lessons.find(l => l.id === currentLesson.id);
      if (lesson) {
        updatedCurrentLesson = lesson;
        break;
      }
    }
    if (updatedCurrentLesson) {
      setCurrentLesson(updatedCurrentLesson);
    }
  };

  // Toggle dropdown section
  const handleToggleSection = (sectionId) => {
    setOpenSectionIds((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Xác định vị trí bài hiện tại để disable nút
  const allLessons = sections.flatMap(section => section.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const isFirstLesson = currentIndex === 0;
  const isLastLesson = currentIndex === allLessons.length - 1;

  if (!currentLesson) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Không tìm thấy bài học</div>
          <button 
            onClick={() => navigate(`/courses/${courseId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Quay lại khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header trên cùng */}
      <header className="w-full bg-gray-900 text-white flex items-center px-8 h-14 shadow z-20">
        <button
          className="text-2xl font-bold tracking-wide hover:text-purple-400 transition-colors"
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Academy
        </button>
      </header>
      <div className="flex flex-1 h-auto min-h-0">
        {/* Main Content - BÊN TRÁI */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="w-full px-0">
            <ReactPlayer
              url={currentLesson.videoUrl}
              controls
              width="100%"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              config={{
                file: {
                  attributes: {
                    poster: 'https://via.placeholder.com/1280x720',
                  }
                }
              }}
            />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
              <button
                onClick={handlePreviousLesson}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-full shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isFirstLesson}
                title="Bài trước"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Bài trước
              </button>
              <button
                onClick={handleNextLesson}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold px-5 py-2 rounded-full shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLastLesson}
                title="Bài tiếp"
              >
                Bài tiếp
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          {/* Tabs dưới video */}
          <div className="w-full bg-white rounded-lg shadow">
            <div className="flex border-b px-4 pt-2">
              <button className={`py-3 px-4 text-lg font-semibold focus:outline-none transition-colors ${activeTab === 'overview' ? 'border-b-2 border-purple-700 text-purple-700' : 'text-gray-600 hover:text-purple-700'}`} onClick={() => setActiveTab('overview')}>Tổng quan</button>
              <button className={`py-3 px-4 text-lg font-semibold focus:outline-none transition-colors ${activeTab === 'notes' ? 'border-b-2 border-purple-700 text-purple-700' : 'text-gray-600 hover:text-purple-700'}`} onClick={() => setActiveTab('notes')}>Ghi chú</button>
              <button className={`py-3 px-4 text-lg font-semibold focus:outline-none transition-colors ${activeTab === 'announcements' ? 'border-b-2 border-purple-700 text-purple-700' : 'text-gray-600 hover:text-purple-700'}`} onClick={() => setActiveTab('announcements')}>Thông báo</button>
              <button className={`py-3 px-4 text-lg font-semibold focus:outline-none transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-purple-700 text-purple-700' : 'text-gray-600 hover:text-purple-700'}`} onClick={() => setActiveTab('reviews')}>Đánh giá</button>
              <button className={`py-3 px-4 text-lg font-semibold focus:outline-none transition-colors ${activeTab === 'tools' ? 'border-b-2 border-purple-700 text-purple-700' : 'text-gray-600 hover:text-purple-700'}`} onClick={() => setActiveTab('tools')}>Công cụ học tập</button>
            </div>
            <div className="p-4">
              <div className="w-full">
                {activeTab === 'notes' && (
                  <>
                    <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
                    {/* Notes Input Section */}
                    <div className="mb-6 w-full flex flex-col items-center">
                      <h2 className="text-lg font-semibold mb-2 w-full">
                        {editingNoteId ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú mới'}
                      </h2>
                      <div className="w-full" style={{ maxWidth: 700 }}>
                        <ReactQuill
                          value={notes}
                          onChange={setNotes}
                          theme="snow"
                          placeholder="Ghi chú của bạn..."
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['code-block'],
                              ['clean']
                            ]
                          }}
                          style={{ height: 100 }}
                        />
                        <div className="w-full flex justify-end mt-4">
                          {editingNoteId && (
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                            >
                              Hủy
                            </button>
                          )}
                          <button
                            onClick={handleSaveNote}
                            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 font-semibold"
                            style={{ minWidth: 120 }}
                          >
                            {editingNoteId ? 'Cập nhật' : 'Lưu ghi chú'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Saved Notes List */}
                    <div className="mt-8">
                      <h2 className="text-lg font-semibold mb-4">Ghi chú đã lưu</h2>
                      {savedNotes.length > 0 ? (
                        <div className="space-y-4">
                          {savedNotes.map((note) => (
                            <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-gray-600 text-sm">
                                  {new Date(note.updatedAt).toLocaleString()}
                                </p>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditNote(note)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="text-gray-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: note.content }} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Chưa có ghi chú nào</p>
                      )}
                    </div>

                    {/* Complete Lesson Button */}
                    <div className="flex justify-start mt-6">
                      <button
                        onClick={handleCompleteLesson}
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                      >
                        Đánh dấu hoàn thành
                      </button>
                    </div>
                  </>
                )}
                {activeTab === 'overview' && (
                  <div className="text-gray-700">Nội dung tổng quan về bài học sẽ hiển thị ở đây.</div>
                )}
                {activeTab === 'announcements' && (
                  <div className="text-gray-700">Chưa có thông báo nào cho bài học này.</div>
                )}
                {activeTab === 'reviews' && (
                  <div className="w-full max-w-2xl mx-auto mt-8">
                    {/* Tổng quan đánh giá */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Phản hồi của học viên</h2>
                      <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center min-w-[120px]">
                          <span className="text-5xl font-bold text-yellow-700">4.5</span>
                          <div className="flex text-yellow-500 text-xl mb-1">
                            {Array.from({length: 5}).map((_,i) => (
                              <span key={i}>{i < 4.5 ? '★' : '☆'}</span>
                            ))}
                          </div>
                          <span className="text-yellow-700 font-semibold text-sm">Xếp hạng khóa học</span>
                        </div>
                        <div className="flex-1">
                          {[5,4,3,2,1].map((star, idx) => {
                            const percents = [57,34,7,0,2];
                            return (
                              <div key={star} className="flex items-center gap-2 mb-1">
                                <div className="w-2/3 h-2 bg-gray-200 rounded">
                                  <div className="h-2 rounded bg-gray-400" style={{width: percents[idx] + '%'}}></div>
                                </div>
                                <span className="text-yellow-500 text-sm ml-2">{'★'.repeat(star)}</span>
                                <span className="text-purple-700 text-xs ml-2">{percents[idx]}%</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    {/* Bộ lọc và tìm kiếm */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <input type="text" placeholder="Tìm kiếm đánh giá" className="flex-1 border px-4 py-2 rounded-md" />
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-purple-700"><svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                      <div>
                        <label className="mr-2 font-medium">Lọc xếp hạng</label>
                        <select className="border px-3 py-2 rounded-md">
                          <option>Tất cả xếp hạng</option>
                          <option>5 sao</option>
                          <option>4 sao</option>
                          <option>3 sao</option>
                          <option>2 sao</option>
                          <option>1 sao</option>
                        </select>
                      </div>
                    </div>
                    {/* Danh sách đánh giá */}
                    <div className="space-y-8">
                      {/* Đánh giá 1 */}
                      <div className="flex gap-4 border-b pb-6">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">Phan Thế A.</span>
                            <div className="flex text-yellow-500 text-base">{'★'.repeat(5)}</div>
                            <span className="text-gray-500 text-sm ml-2">1 tháng trước</span>
                          </div>
                          <div className="mb-2">Very good!</div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Đánh giá này có hữu ích không?</span>
                            <button className="flex items-center border rounded-full px-3 py-1 text-purple-700 hover:bg-purple-50"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9l-3 3m0 0l-3-3m3 3V4m0 16v-7" /></svg>Like</button>
                            <button className="flex items-center border rounded-full px-3 py-1 text-purple-700 hover:bg-purple-50"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15l3-3m0 0l3 3m-3-3v7m0-16v7" /></svg>Dislike</button>
                            <button className="text-purple-700 underline ml-2">Báo cáo</button>
                          </div>
                        </div>
                      </div>
                      {/* Đánh giá 2 */}
                      <div className="flex gap-4 border-b pb-6">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">TL</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">Truong Thi Hien L.</span>
                            <div className="flex text-yellow-500 text-base">{'★'.repeat(5)}</div>
                            <span className="text-gray-500 text-sm ml-2">3 tháng trước</span>
                          </div>
                          <div className="mb-2">Tuyệt vời, trên cả mong đợi!</div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Đánh giá này có hữu ích không?</span>
                            <button className="flex items-center border rounded-full px-3 py-1 text-purple-700 hover:bg-purple-50"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9l-3 3m0 0l-3-3m3 3V4m0 16v-7" /></svg>Like</button>
                            <button className="flex items-center border rounded-full px-3 py-1 text-purple-700 hover:bg-purple-50"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15l3-3m0 0l3 3m-3-3v7m0-16v7" /></svg>Dislike</button>
                            <button className="text-purple-700 underline ml-2">Báo cáo</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'tools' && (
                  <div className="text-gray-700">Các công cụ học tập sẽ hiển thị ở đây.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar - BÊN PHẢI sticky */}
        <aside className="w-80 h-screen sticky top-0 right-0 bg-white border-l shadow flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">Nội dung khóa học</h2>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Tiến độ: {Math.round(progress)}%</p>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-120px)]">
            {sections.map((section) => (
              <div key={section.id} className="border-b">
                {/* Section header */}
                <button
                  className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left hover:bg-gray-50"
                  onClick={() => handleToggleSection(section.id)}
                >
                  <span>{section.title}</span>
                  <svg className={`w-4 h-4 ml-2 transition-transform ${openSectionIds.includes(section.id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Lessons in section */}
                {openSectionIds.includes(section.id) && (
                  <div>
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`pl-8 pr-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${lesson.id === currentLesson.id ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-center">
                          {lesson.completed ? (
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VideoPlayerPage; 
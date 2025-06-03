import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";

const VideoPlayerPage = () => {
  const { user } = useUser();
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [openSectionIds, setOpenSectionIds] = useState([]);
  const [reviewInput, setReviewInput] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [filterStar, setFilterStar] = useState(0);
  const [searchReview, setSearchReview] = useState('');

  // Fetch course sections and lessons
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://localhost:7261/api/courses/${courseId}`);
        const courseSections = response.data.sections.map(section => ({
          id: section.id,
          title: section.title,
          lessons: section.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            type: lesson.type,
            content: lesson.content,
            duration: lesson.duration,
            completed: false,
          }))
        }));

        setSections(courseSections);
        setOpenSectionIds([courseSections[0]?.id]); // Open first section by default

        // Find and set current lesson
        if (lessonId) {
          // Check if the lessonId exists in the current course
          let lessonFound = false;
          for (const section of courseSections) {
            const lesson = section.lessons.find(l => l.id === parseInt(lessonId));
            if (lesson) {
              setCurrentLesson(lesson);
              lessonFound = true;
              break;
            }
          }

          // If lessonId doesn't exist in current course, redirect to first lesson
          if (!lessonFound && courseSections[0]?.lessons[0]) {
            const firstLesson = courseSections[0].lessons[0];
            setCurrentLesson(firstLesson);
            navigate(`/courses/${courseId}/lessons/${firstLesson.id}`);
          }
        } else if (courseSections[0]?.lessons[0]) {
          // If no lessonId provided, set first lesson as current
          const firstLesson = courseSections[0].lessons[0];
          setCurrentLesson(firstLesson);
          navigate(`/courses/${courseId}/lessons/${firstLesson.id}`);
        }

      } catch (err) {
        setError('Failed to fetch course details');
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, lessonId, navigate]);

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

  // Fetch reviews for course
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`https://localhost:7261/api/Reviews?courseId=${courseId}`);
        setReviews(res.data);
      } catch (err) {
        setReviews([]);
      }
    };
    if (courseId) fetchReviews();
  }, [courseId]);

  // Fetch review stats for course
  const fetchReviewStats = async () => {
    try {
      const res = await axios.get(`https://localhost:7261/api/Reviews/stats/${courseId}`);
      setReviewStats(res.data);
    } catch (err) {
      setReviewStats(null);
    }
  };

  useEffect(() => {
    if (courseId) fetchReviewStats();
  }, [courseId]);

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

  const handleSaveNote = async () => {
    if (!notes || notes === '<p><br></p>') return;
    
    try {
      if (!user) {
        alert('Vui lòng đăng nhập để lưu ghi chú');
        return;
      }

      const noteData = {
        title: currentLesson.title,
        content: notes,
        userId: user.id,
        lessonId: parseInt(lessonId)
      };

      let response;
      if (editingNoteId) {
        // Update existing note
        response = await axios.put(`https://localhost:7261/api/notes/${editingNoteId}`, noteData);
      } else {
        // Create new note
        response = await axios.post('https://localhost:7261/api/notes', noteData);
      }
      
      const newNote = {
        id: response.data.id,
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
    } catch (error) {
      console.error('Error saving note:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(`Lỗi: ${error.response.data.message || 'Không thể lưu ghi chú'}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Đã xảy ra lỗi khi lưu ghi chú. Vui lòng thử lại.');
      }
    }
  };

  const handleEditNote = (note) => {
    setNotes(note.content);
    setEditingNoteId(note.id);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      if (!user) {
        alert('Vui lòng đăng nhập để xóa ghi chú');
        return;
      }

      await axios.delete(`https://localhost:7261/api/notes/${noteId}?userId=${user.id}`);
      
      const updatedNotes = savedNotes.filter(note => note.id !== noteId);
      setSavedNotes(updatedNotes);
      localStorage.setItem(`notes_${courseId}_${lessonId}`, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
      if (error.response) {
        alert(`Lỗi: ${error.response.data.message || 'Không thể xóa ghi chú'}`);
      } else if (error.request) {
        alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn.');
      } else {
        alert('Đã xảy ra lỗi khi xóa ghi chú. Vui lòng thử lại.');
      }
    }
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

  // Gửi đánh giá mới
  const handleSubmitReview = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để gửi đánh giá');
      return;
    }
    if (!reviewInput.comment.trim()) return;
    try {
      const reviewData = {
        userId: user.id,
        courseId: parseInt(courseId),
        ratingValue: reviewInput.rating,
        comment: reviewInput.comment
      };
      const res = await axios.post('https://localhost:7261/api/Reviews', reviewData);
      // Lấy lại danh sách đánh giá mới nhất
      const reviewsRes = await axios.get(`https://localhost:7261/api/Reviews?courseId=${courseId}`);
      setReviews(reviewsRes.data);
      setReviewInput({ rating: 5, comment: '' });
      fetchReviewStats();
    } catch (err) {
      alert('Không thể gửi đánh giá. Vui lòng thử lại.');
    }
  };

  // Xóa đánh giá
  const handleDeleteReview = async (reviewId) => {
    if (!user) {
      alert('Vui lòng đăng nhập để xóa đánh giá');
      return;
    }
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      await axios.delete(`https://localhost:7261/api/Reviews/${reviewId}`);
      // Lấy lại danh sách đánh giá mới nhất
      const reviewsRes = await axios.get(`https://localhost:7261/api/Reviews?courseId=${courseId}`);
      setReviews(reviewsRes.data);
      fetchReviewStats();
    } catch (err) {
      alert('Không thể xóa đánh giá. Vui lòng thử lại.');
    }
  };

  // Lọc đánh giá theo sao và từ khóa
  const filteredReviews = reviews.filter(r => 
    (filterStar === 0 || r.ratingValue === filterStar) &&
    (
      r.comment.toLowerCase().includes(searchReview.toLowerCase()) ||
      (r.firstName && r.firstName.toLowerCase().includes(searchReview.toLowerCase()))
    )
  );

  // Thêm hàm toggle hoàn thành bài học
  const handleToggleLessonComplete = (lesson, completed) => {
    setSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        lessons: section.lessons.map(l =>
          l.id === lesson.id ? { ...l, completed } : l
        ),
      }))
    );
    // Nếu muốn lưu trạng thái lên server, có thể gọi API ở đây
  };

  // Hàm chuyển đổi duration về phút
  function parseDurationToMinutes(duration) {
    if (!duration) return 0;
    if (typeof duration === 'number') return duration;
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      // hh:mm:ss
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 2) {
      // mm:ss
      return parts[0];
    } else if (parts.length === 1) {
      // chỉ phút
      return parts[0];
    }
    return 0;
  }

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
      <header className="w-full bg-gray-900 text-white flex items-center px-8 shadow z-20 h-14 relative">
        <button
          className="mr-4 p-2 rounded hover:bg-gray-800 focus:outline-none"
          onClick={() => setIsSidebarOpen(v => !v)}
          aria-label={isSidebarOpen ? 'Đóng sidebar' : 'Mở sidebar'}
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
        <button
          className="text-2xl font-bold tracking-wide hover:text-purple-400 transition-colors"
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Academy
        </button>
        <span className="ml-4 text-lg font-semibold truncate max-w-[60vw] hidden md:inline-block">
          {currentLesson ? currentLesson.title : ''}
        </span>
        <div className="flex items-center gap-2 ml-auto relative group">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#6366f1"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - progress / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s' }}
              />
            </svg>
            <span className="absolute text-xs font-bold text-blue-700">{Math.round(progress)}%</span>
          </div>
          <span className="font-semibold text-white hidden md:inline">Tiến độ của bạn</span>
          {/* Tooltip */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-sm rounded shadow px-4 py-2 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition">
            Đã hoàn thành {allLessons.filter(l => l.completed).length}/{allLessons.length}
          </div>
        </div>
      </header>
      <div className="flex flex-1 h-auto min-h-0">
        {/* Main Content - BÊN TRÁI */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="w-full px-0">
            <ReactPlayer
              url={currentLesson.content}
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
                      <div className="w-full relative" style={{ maxWidth: 700 }}>
                        <ReactQuill
                          value={notes}
                          onChange={setNotes}
                          theme="snow"
                          placeholder="Ghi chú của bạn..."
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                              ['code-block'],
                              ['clean']
                            ]
                          }}
                          style={{ height: 100 }}
                        />
                        {editingNoteId && (
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 absolute right-36 bottom-4"
                          >
                            Hủy
                          </button>
                        )}
                        <button
                          onClick={handleSaveNote}
                          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 font-semibold absolute right-4 bottom-4"
                          style={{ minWidth: 120 }}
                        >
                          {editingNoteId ? 'Cập nhật' : 'Lưu ghi chú'}
                        </button>
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
                    <div className="mb-8 flex flex-col md:flex-row items-center gap-8 bg-white rounded-xl shadow-lg p-6">
                      <div className="flex flex-col items-center min-w-[120px]">
                        <span className="text-6xl font-extrabold text-yellow-500 drop-shadow">{reviewStats?.averageRating?.toFixed(1) || 0}</span>
                        <div className="flex text-yellow-400 text-2xl mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < Math.round(reviewStats?.averageRating) ? '★' : '☆'}</span>
                          ))}
                        </div>
                        <span className="text-gray-700 font-semibold text-sm">Xếp hạng khóa học</span>
                        <span className="text-gray-400 text-xs mt-1">{reviewStats?.totalRatings || 0} đánh giá</span>
                      </div>
                      <div className="flex-1 w-full">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const percent = reviewStats?.totalRatings > 0
                            ? (reviewStats.ratingDistribution[
                                star === 5 ? 'fiveStars' :
                                star === 4 ? 'fourStars' :
                                star === 3 ? 'threeStars' :
                                star === 2 ? 'twoStars' : 'oneStar'
                              ] / reviewStats.totalRatings) * 100
                            : 0;
                          return (
                            <div key={star} className="flex items-center gap-2 mb-2">
                              {/* Số sao bên trái */}
                              <span className="text-yellow-400 text-lg w-16 flex items-center">
                                {Array.from({ length: star }).map((_, i) => (
                                  <span key={i}>★</span>
                                ))}
                              </span>
                              {/* Progress bar */}
                              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500" style={{ width: percent + '%' }}></div>
                              </div>
                              {/* Số lượng đánh giá */}
                              <span className="text-gray-600 text-xs ml-2 w-8 text-right">
                                {reviewStats?.ratingDistribution[
                                  star === 5 ? 'fiveStars' :
                                  star === 4 ? 'fourStars' :
                                  star === 3 ? 'threeStars' :
                                  star === 2 ? 'twoStars' : 'oneStar'
                                ] || 0}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bộ lọc đánh giá và tìm kiếm - giao diện giống hình mẫu */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                      <div className="flex flex-1">
                        <input
                          type="text"
                          className="w-full border rounded-l px-3 py-2"
                          placeholder="Tìm kiếm đánh giá"
                          value={searchReview}
                          onChange={e => setSearchReview(e.target.value)}
                        />
                        <button
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-r flex items-center justify-center"
                          tabIndex={-1}
                          type="button"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                            <path stroke="currentColor" strokeWidth="2" d="M21 21l-3.5-3.5" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <label className="font-medium text-gray-700 mr-2">Lọc xếp hạng</label>
                        <select
                          className="border rounded px-3 py-2"
                          value={filterStar}
                          onChange={e => setFilterStar(Number(e.target.value))}
                        >
                          <option value={0}>Tất cả xếp hạng</option>
                          <option value={5}>5 sao</option>
                          <option value={4}>4 sao</option>
                          <option value={3}>3 sao</option>
                          <option value={2}>2 sao</option>
                          <option value={1}>1 sao</option>
                        </select>
                      </div>
                    </div>

                    {/* Form nhập đánh giá mới */}
                    <div className="mb-8 bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 shadow flex flex-col gap-3">
                      <div className="font-semibold text-lg mb-2">Viết đánh giá của bạn</div>
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            className={`text-3xl transition ${reviewInput.rating >= star ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-300'}`}
                            onClick={() => setReviewInput(r => ({ ...r, rating: star }))}
                            aria-label={`Chọn ${star} sao`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">{reviewInput.rating} sao</span>
                      </div>
                      <textarea
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                        rows={3}
                        placeholder="Nhận xét của bạn..."
                        value={reviewInput.comment}
                        onChange={e => setReviewInput(r => ({ ...r, comment: e.target.value }))}
                      />
                      <button
                        className="self-end bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-2 rounded-lg font-bold hover:from-purple-600 hover:to-purple-800 flex items-center gap-2 shadow"
                        onClick={handleSubmitReview}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Gửi đánh giá
                      </button>
                    </div>

                    {/* Danh sách đánh giá */}
                    <div className="space-y-8">
                      {filteredReviews.length === 0 && <div className="text-gray-400 text-center">Không tìm thấy đánh giá phù hợp</div>}
                      {filteredReviews.map((review) => (
                        <div key={review.id} className="flex gap-4 items-start bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                          {review.imageUrl ? (
                            <img src={review.imageUrl} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-purple-200" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg border-2 border-purple-200">
                              {review.firstName ? review.firstName.charAt(0) : '?'}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-base">{review.firstName || 'Ẩn danh'}</span>
                              <div className="flex text-yellow-400 text-lg">{'★'.repeat(review.ratingValue)}</div>
                              <span className="text-gray-400 text-xs ml-2">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
                              {user && review.userId === user.id && (
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="ml-4 text-red-600 hover:underline text-xs font-semibold"
                                >
                                  Xóa
                                </button>
                              )}
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 text-gray-800 shadow-inner">{review.comment}</div>
                          </div>
                        </div>
                      ))}
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
        {isSidebarOpen && (
          <aside className="w-80 h-screen sticky top-0 right-0 bg-white border-l shadow flex-shrink-0 overflow-y-auto z-40">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Nội dung khóa học</h2>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Đóng sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              {sections.map((section) => {
                const completedCount = section.lessons.filter(l => l.completed).length;
                const totalLessons = section.lessons.length;
                const totalDuration = section.lessons.reduce((sum, l) => sum + parseDurationToMinutes(l.duration), 0);
                return (
                  <div key={section.id} className="border-b">
                    {/* Section header */}
                    <button
                      className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left hover:bg-gray-50"
                      onClick={() => handleToggleSection(section.id)}
                    >
                      <div>
                        <div>{section.title}</div>
                        <div className="text-xs text-gray-500 font-normal mt-1">
                          {completedCount}/{totalLessons} bài học
                          <span className="mx-2">•</span>
                          Tổng thời lượng: {totalDuration} phút
                        </div>
                      </div>
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
                            className={`pl-8 pr-4 py-2 flex items-center justify-between ${lesson.id === currentLesson?.id ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={lesson.completed}
                                onChange={e => handleToggleLessonComplete(lesson, e.target.checked)}
                                onClick={e => e.stopPropagation()}
                              />
                              <span
                                className="font-medium cursor-pointer"
                                onClick={() => handleLessonSelect(lesson)}
                              >
                                {lesson.title}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
        {/* Nút mở sidebar khi đang đóng */}
        {!isSidebarOpen && (
          <button
            className="fixed top-20 right-0 z-50 bg-white border border-gray-300 rounded-l px-2 py-2 shadow hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Mở sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerPage; 
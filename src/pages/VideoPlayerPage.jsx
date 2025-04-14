import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VideoPlayerPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [notes, setNotes] = useState('');
  const [progress, setProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dữ liệu mẫu cho bài học
  const sampleLessons = [
    {
      id: 1,
      title: 'Giới thiệu về React',
      duration: '15:30',
      videoUrl: 'https://example.com/video1.mp4',
      completed: true
    },
    {
      id: 2,
      title: 'Cài đặt môi trường',
      duration: '20:15',
      videoUrl: 'https://example.com/video2.mp4',
      completed: false
    },
    {
      id: 3,
      title: 'Components và Props',
      duration: '25:45',
      videoUrl: 'https://example.com/video3.mp4',
      completed: false
    },
    {
      id: 4,
      title: 'State và Lifecycle',
      duration: '18:20',
      videoUrl: 'https://example.com/video4.mp4',
      completed: false
    }
  ];

  useEffect(() => {
    // Giả lập việc lấy dữ liệu bài học
    setLessons(sampleLessons);
    
    // Tìm bài học hiện tại
    const lesson = sampleLessons.find(l => l.id === parseInt(lessonId));
    if (lesson) {
      setCurrentLesson(lesson);
    }
  }, [lessonId]);

  // Cập nhật tiến độ khi lessons thay đổi
  useEffect(() => {
    const completedCount = lessons.filter(lesson => lesson.completed).length;
    const totalLessons = lessons.length;
    const newProgress = (completedCount / totalLessons) * 100;
    setProgress(newProgress);
  }, [lessons]);

  // Xử lý khi chọn bài học khác
  const handleLessonSelect = (lesson) => {
    navigate(`/courses/${courseId}/lessons/${lesson.id}`);
  };

  // Xử lý lưu ghi chú
  const handleSaveNote = () => {
    // Trong thực tế, bạn sẽ gọi API để lưu ghi chú
    alert('Đã lưu ghi chú');
  };

  // Xử lý đánh dấu hoàn thành bài học
  const handleCompleteLesson = () => {
    if (!currentLesson) return;

    const updatedLessons = lessons.map(lesson => 
      lesson.id === currentLesson.id ? { ...lesson, completed: true } : lesson
    );
    
    setLessons(updatedLessons);
    
    // Cập nhật bài học hiện tại
    const updatedCurrentLesson = updatedLessons.find(l => l.id === currentLesson.id);
    if (updatedCurrentLesson) {
      setCurrentLesson(updatedCurrentLesson);
    }
  };

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Nội dung khóa học</h2>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Tiến độ: {Math.round(progress)}%</p>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => handleLessonSelect(lesson)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                lesson.id === currentLesson.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {lesson.completed ? (
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{lesson.title}</span>
                </div>
                <span className="text-sm text-gray-500">{lesson.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="relative bg-black">
          <div className="absolute top-4 left-4 flex items-center space-x-4 z-10">
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg flex items-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="w-full">
            <video
              className="w-full max-h-[60vh]"
              controls
              src={currentLesson.videoUrl}
              poster="https://via.placeholder.com/1280x720"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Notes and Actions */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
            
            {/* Notes Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Ghi chú</h2>
              <textarea
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú của bạn..."
              ></textarea>
              <button
                onClick={handleSaveNote}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Lưu ghi chú
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-start">
              <button
                onClick={handleCompleteLesson}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              >
                Đánh dấu hoàn thành
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage; 
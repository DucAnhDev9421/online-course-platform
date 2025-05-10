import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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

const defaultInitial = {
  title: '',
  category: '',
  level: '',
  description: '',
  video: '',
  image: '',
  price: '',
  sections: [
    {
      id: Date.now(),
      title: 'Chương 1: Giới thiệu',
      lectures: [
        { id: Date.now() + 1, title: 'Giới thiệu khóa học' },
        { id: Date.now() + 2, title: 'Cài đặt phần mềm' },
      ],
    },
  ],
};

const CourseWizardForm = ({
  categories = [],
  onSubmit,
  onCancel,
  initialData = {},
}) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...defaultInitial, ...initialData });
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');
  const [newLectureTitle, setNewLectureTitle] = useState({});
  const [editingLecture, setEditingLecture] = useState({ id: null, sectionId: null, title: '' });

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
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          maxLength={60}
        />
        <div className="text-xs text-gray-400 mt-1">Nhập tiêu đề tối đa 60 ký tự.</div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Danh mục khóa học</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
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
          value={form.level}
          onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
        >
          {COURSE_LEVELS.map(lv => (
            <option key={lv.value} value={lv.value}>{lv.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Mô tả khóa học</label>
        <ReactQuill theme="snow" value={form.description} onChange={val => setForm(f => ({ ...f, description: val }))} className="bg-white" />
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
          value={form.video}
          onChange={e => setForm(f => ({ ...f, video: e.target.value }))}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Ảnh bìa (URL hoặc file)</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nhập link ảnh bìa"
          value={form.image}
          onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
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
              {form.sections.map((section, sIdx) => (
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
    <form onSubmit={e => { e.preventDefault(); if (onSubmit) onSubmit(form); }} className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">Cài đặt</h3>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Giá khóa học (VNĐ)</label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nhập giá khóa học"
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          min="0"
        />
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" onClick={() => setStep(2)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">Quay lại</button>
        <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Lưu</button>
      </div>
    </form>
  );

  // Section/Lecture handlers
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    setForm(f => ({
      ...f,
      sections: [
        ...f.sections,
        { id: Date.now(), title: newSectionTitle, lectures: [] },
      ],
    }));
    setNewSectionTitle('');
  };
  const handleEditSection = (id, title) => {
    setEditingSectionId(id);
    setEditingSectionTitle(title);
  };
  const handleSaveEditSection = (id) => {
    setForm(f => ({
      ...f,
      sections: f.sections.map(s => s.id === id ? { ...s, title: editingSectionTitle } : s),
    }));
    setEditingSectionId(null);
    setEditingSectionTitle('');
  };
  const handleDeleteSection = (id) => {
    setForm(f => ({
      ...f,
      sections: f.sections.filter(s => s.id !== id),
    }));
  };
  const handleAddLecture = (sectionId) => {
    if (!newLectureTitle[sectionId] || !newLectureTitle[sectionId].trim()) return;
    setForm(f => ({
      ...f,
      sections: f.sections.map(s =>
        s.id === sectionId
          ? { ...s, lectures: [...s.lectures, { id: Date.now(), title: newLectureTitle[sectionId] }] }
          : s
      ),
    }));
    setNewLectureTitle({ ...newLectureTitle, [sectionId]: '' });
  };
  const handleEditLecture = (sectionId, lecture) => {
    setEditingLecture({ id: lecture.id, sectionId, title: lecture.title });
  };
  const handleSaveEditLecture = () => {
    setForm(f => ({
      ...f,
      sections: f.sections.map(s =>
        s.id === editingLecture.sectionId
          ? { ...s, lectures: s.lectures.map(l => l.id === editingLecture.id ? { ...l, title: editingLecture.title } : l) }
          : s
      ),
    }));
    setEditingLecture({ id: null, sectionId: null, title: '' });
  };
  const handleDeleteLecture = (sectionId, lectureId) => {
    setForm(f => ({
      ...f,
      sections: f.sections.map(s =>
        s.id === sectionId
          ? { ...s, lectures: s.lectures.filter(l => l.id !== lectureId) }
          : s
      ),
    }));
  };
  // Kéo thả Section và Lecture
  const onDragEnd = (result) => {
    if (!result.destination) return;
    // Kéo thả Section
    if (result.type === 'section') {
      const reordered = Array.from(form.sections);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setForm(f => ({ ...f, sections: reordered }));
    }
    // Kéo thả Lecture trong Section
    if (result.type === 'lecture') {
      const sectionId = parseInt(result.source.droppableId);
      const destSectionId = parseInt(result.destination.droppableId);
      if (sectionId === destSectionId) {
        const section = form.sections.find(s => s.id === sectionId);
        const reorderedLectures = Array.from(section.lectures);
        const [removed] = reorderedLectures.splice(result.source.index, 1);
        reorderedLectures.splice(result.destination.index, 0, removed);
        setForm(f => ({
          ...f,
          sections: f.sections.map(s =>
            s.id === sectionId ? { ...s, lectures: reorderedLectures } : s
          ),
        }));
      }
    }
  };

  return (
    <div>
      {renderStepper()}
      {step === 0 && renderStep1()}
      {step === 1 && renderStep2()}
      {step === 2 && renderStep3()}
      {step === 3 && renderStep4()}
      <div className="flex justify-end mt-4">
        {onCancel && (
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">Hủy</button>
        )}
      </div>
    </div>
  );
};

export default CourseWizardForm; 
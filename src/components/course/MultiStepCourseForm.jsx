import React, { useState } from 'react';

const steps = [
  'Thông tin cơ bản',
  'Phương tiện khóa học',
  'Chương trình học',
  'Cài đặt',
];

const MultiStepCourseForm = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '',
    category: '',
    level: '',
    description: '',
    media: '',
    curriculum: '',
    price: '',
    isFree: false,
    settings: {},
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        {/* Steps header */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((label, idx) => (
            <div key={label} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step === idx ? 'bg-purple-600' : 'bg-gray-300'}`}>{idx + 1}</div>
              <span className={`ml-2 font-medium ${step === idx ? 'text-purple-600' : 'text-gray-500'}`}>{label}</span>
              {idx < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          {/* Step 1: Thông tin cơ bản */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Thông tin cơ bản</h2>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Tên khóa học</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Nhập tên khóa học" maxLength={60} required />
                <div className="text-xs text-gray-400 mt-1">Nhập tiêu đề tối đa 60 ký tự.</div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Danh mục khóa học</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                  <option value="">Chọn danh mục</option>
                  <option value="development">Phát triển</option>
                  <option value="business">Kinh doanh</option>
                  <option value="it">IT và Phần mềm</option>
                  <option value="marketing">Marketing</option>
                </select>
                <div className="text-xs text-gray-400 mt-1">Chọn danh mục phù hợp cho khóa học của bạn.</div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Trình độ khóa học</label>
                <select name="level" value={form.level} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                  <option value="">Chọn trình độ</option>
                  <option value="beginner">Người mới bắt đầu</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Mô tả khóa học</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={4} placeholder="Tóm tắt ngắn gọn về khóa học." />
              </div>
            </div>
          )}
          {/* Step 2: Phương tiện khóa học */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Phương tiện khóa học</h2>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Ảnh bìa (URL)</label>
                <input name="media" value={form.media} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Nhập URL ảnh bìa" />
              </div>
              {/* Có thể thêm upload video, file... */}
            </div>
          )}
          {/* Step 3: Chương trình học */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Chương trình học</h2>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Nội dung chương trình học</label>
                <textarea name="curriculum" value={form.curriculum} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={4} placeholder="Nhập nội dung chương trình học" />
              </div>
            </div>
          )}
          {/* Step 4: Cài đặt */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Cài đặt</h2>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Khóa học miễn phí</label>
                <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} className="mr-2" />
                <span>{form.isFree ? 'Miễn phí' : 'Trả phí'}</span>
              </div>
              {!form.isFree && (
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Giá (VNĐ)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Nhập giá khóa học" />
                </div>
              )}
            </div>
          )}
          {/* Buttons */}
          <div className="flex justify-between mt-8">
            <button type="button" onClick={prevStep} disabled={step === 0} className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50">Quay lại</button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={nextStep} className="px-6 py-2 rounded bg-purple-600 text-white font-semibold">Tiếp theo</button>
            ) : (
              <button type="submit" className="px-6 py-2 rounded bg-purple-600 text-white font-semibold">Hoàn tất</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepCourseForm; 
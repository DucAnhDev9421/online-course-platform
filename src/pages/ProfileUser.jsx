// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

const ProfileUser = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    age: '',
    jobTitle: '',
    sectionBU: '',
    language: 'Tiếng Việt'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="profile-container max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ công khai</h1>
      <p className="text-gray-600 mb-6">Thêm thông tin về bản thân bạn</p>
      
      <div className="divider h-px bg-gray-200 my-4"></div>
      
      <div className="basic-info mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Thông tin cơ bản:</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Họ</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nhập họ của bạn"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Tên</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Tiêu đề nghề nghiệp</label>
          <input
            type="text"
            name="jobTitle"
            value={profile.jobTitle}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="VD: Giảng viên tại Udemy, Kiến trúc sư..."
          />
        </div>
      </div>
      
      <div className="divider h-px bg-gray-200 my-4"></div>
      
      <div className="section-bu mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Giới thiệu</h2>
        <textarea
          name="sectionBU"
          value={profile.sectionBU}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded h-20"
        />
      </div>
      
      <div className="divider h-px bg-gray-200 my-4"></div>
      
      <div className="language-section">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Ngôn ngữ</h2>
        <select
          name="language"
          value={profile.language}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
        </select>
      </div>
      
      <div className="mt-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Lưu thông tin
        </button>
      </div>
    </div>
  );
};

export default ProfileUser;
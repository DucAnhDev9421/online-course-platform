// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from 'react';

const ProfileUser = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    age: '',
    jobTitle: '',
    sectionBU: '',
    language: 'Tiếng Việt',
    avatar: null,
    avatarPreview: '/default-avatar.png'
  });

  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: file,
          avatarPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Xử lý lưu thông tin profile
    console.log('Profile saved:', profile);
  };

  return (
    <div className="profile-container max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">Hồ sơ công khai</h1>
      <p className="text-gray-600 mb-6 text-center sm:text-left">Thêm thông tin về bản thân bạn</p>
      
      {/* Avatar Section */}
      <div className="avatar-section mb-8 text-center">
        <div className="relative inline-block">
          <div 
            className="w-32 h-32 rounded-full overflow-hidden cursor-pointer relative group"
            onClick={handleAvatarClick}
          >
            <img 
              src={profile.avatarPreview} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">Thay đổi ảnh</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
          {isEditingAvatar && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
              <button 
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setIsEditingAvatar(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">Nhấp vào ảnh để thay đổi</p>
      </div>
      
      <div className="divider h-px bg-gray-200 my-4"></div>
      
      <div className="basic-info mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Thông tin cơ bản:</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
          placeholder="Viết một vài dòng giới thiệu về bạn..."
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
      
      <div className="mt-8 flex justify-center sm:justify-end">
        <button 
          onClick={handleSaveProfile}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Lưu thông tin
        </button>
      </div>
    </div>
  );
};

export default ProfileUser;
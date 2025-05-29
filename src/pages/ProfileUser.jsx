// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileUser = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    bio: '',
    language: 'vi',
    avatar: null,
    avatarPreview: '/default-avatar.png'
  });

  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Cập nhật avatarPreview khi user đã đăng nhập
  useEffect(() => {
    if (user && user.imageUrl) {
      setProfile(prev => ({
        ...prev,
        avatarPreview: user.imageUrl
      }));
    }
    // Lấy thông tin họ tên và ảnh từ API mới nếu có user.id
    if (user && user.id) {
      setLoading(true);
      axios.get(`https://localhost:7261/api/users/${user.id}/profile`)
        .then(res => {
          const data = res.data;
          setProfile(prev => ({
            ...prev,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            imageUrl: data.imageUrl || '',
            avatarPreview: data.imageUrl || user.imageUrl,
            profileImageData: data.profileImageData || '',
            jobTitle: data.jobTitle || '',
            bio: data.bio || '',
          }));
          setLoading(false);
        })
        .catch(err => {
          // Có thể log lỗi hoặc bỏ qua
          console.error('Lỗi lấy thông tin user:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

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

  const handleAvatarChange = async (e) => {
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
      // Tích hợp cập nhật avatar Clerk
      if (user) {
        try {
          await user.setProfileImage({ file });
          toast.success('Ảnh đại diện đã được cập nhật!');
        } catch (error) {
          console.error('Lỗi cập nhật ảnh:', error);
          toast.error('Không thể cập nhật ảnh đại diện.');
        }
      }
    }
  };

  const handleClearAvatar = async () => {
    if (user) {
      try {
        await user.setProfileImage({ file: null });
        setProfile(prev => ({
          ...prev,
          avatar: null,
          avatarPreview: user.imageUrl,
          imageUrl: ''
        }));
        toast.success('Đã xóa ảnh đại diện!');
      } catch (error) {
        console.error('Lỗi xóa ảnh:', error);
        toast.error('Không thể xóa ảnh đại diện.');
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Nếu là ảnh mặc định Clerk thì imageUrl là user.imageUrl, nếu là ảnh upload thì là avatarPreview
      const isDefaultClerkAvatar = profile.avatarPreview === user.imageUrl;
      const imageUrl = isDefaultClerkAvatar ? '' : profile.avatarPreview;
      await axios.patch(`https://localhost:7261/api/users/${user.id}/profile`, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        imageUrl: imageUrl,
        jobTitle: profile.jobTitle,
        bio: profile.bio,
      });
      // Cập nhật state sau khi lưu thành công
      setProfile(prev => ({
        ...prev,
        imageUrl: imageUrl
      }));
      toast.success('Cập nhật thông tin thành công!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Có lỗi khi cập nhật thông tin!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Lỗi cập nhật:', error.response ? error.response.data : error);
    }
  };

  const isDefaultClerkAvatar = profile.avatarPreview?.includes('/avatar.png') || profile.avatarPreview === '/default-avatar.png';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-10">
      <div className="profile-container max-w-3xl mx-auto p-8 bg-white/90 rounded-2xl shadow-2xl border border-gray-200 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="text-lg text-gray-600 font-semibold">Đang tải thông tin hồ sơ...</div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">Hồ sơ công khai</h1>
            <p className="text-gray-600 mb-6 text-center sm:text-left">Thêm thông tin về bản thân bạn</p>
            {/* Avatar Section */}
            <div className="avatar-section mb-8 text-center">
              <div className="relative inline-block">
                <div 
                  className="w-36 h-36 rounded-full overflow-hidden cursor-pointer relative group border-4 border-blue-100 shadow-lg bg-white"
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
                <button
                  type="button"
                  onClick={handleClearAvatar}
                  className={`mt-2 px-3 py-1 rounded text-white ${isDefaultClerkAvatar ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                  disabled={isDefaultClerkAvatar}
                >
                  Xóa ảnh
                </button>
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
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-1">Họ</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 transition"
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 transition"
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
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="VD: Giảng viên tại Udemy, Kiến trúc sư..."
                />
              </div>
            </div>
            <div className="divider h-px bg-gray-200 my-4"></div>
            <div className="section-bu mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Giới thiệu</h2>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded h-20 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Viết một vài dòng giới thiệu về bạn..."
              />
            </div>
            <div className="divider h-px bg-gray-200 my-4"></div>
            <div className="mt-8 flex justify-center sm:justify-end">
              <button 
                onClick={handleSaveProfile}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Lưu thông tin
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileUser;
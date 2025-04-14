import { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';

export default function Register({ onSwitchToRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Xử lý đăng ký bằng email
    console.log('Register with:', { name, email, password });
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`); 
    // Xử lý đăng ký mạng xã hội
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8 mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng nhập</h2>
        
        {/* Form đăng ký bằng email */}
        <form onSubmit={handleSubmit} className="space-y-5">
 
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
              placeholder="Nhập email của bạn"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
              minLength={6}
              placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              required
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Tôi đồng ý với <a href="#" className="text-purple-600 hover:text-purple-500">Điều khoản dịch vụ</a> và <a href="#" className="text-purple-600 hover:text-purple-500">Chính sách bảo mật</a>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium text-lg ${isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} transition-colors`}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        
        {/* Phương thức đăng ký khác */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-base">
              <span className="px-4 bg-white text-gray-500">
                Hoặc đăng nhập bằng
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* Facebook */}
            <button
              onClick={() => handleSocialRegister('facebook')}
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <FaFacebook className="h-6 w-6 text-blue-600 mr-3" />
              Facebook
            </button>
            
            {/* Google */}
            <button
              onClick={() => handleSocialRegister('google')}
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <FaGoogle className="h-6 w-6 text-red-500 mr-3" />
              Google
            </button>
          </div>
        </div>
        
        {/* Phần chuyển sang đăng nhập */}
        <div className="mt-8 text-center">
          <p className="text-base text-gray-600">
            Bạn không có tài khoản?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-purple-600 hover:text-purple-500 font-medium focus:outline-none"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
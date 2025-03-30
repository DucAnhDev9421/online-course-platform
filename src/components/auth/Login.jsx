import { useState } from 'react';
import { FaFacebook, FaGoogle, FaEnvelope } from 'react-icons/fa';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Xử lý đăng nhập bằng email
    console.log('Login with:', { email, password, rememberMe });
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Xử lý đăng nhập mạng xã hội
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng nhập tài khoản</h2>

      {/* Form đăng nhập bằng email */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            placeholder="Nhập email của bạn"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            minLength={6}
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <a href="#" className="text-sm text-purple-600 hover:text-purple-500">
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} transition-colors`}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      {/* Phương thức đăng nhập khác */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Hoặc đăng nhập bằng
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Facebook */}
          <button
            onClick={() => handleSocialLogin('facebook')}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
            Facebook
          </button>

          {/* Google */}
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
            Google
          </button>
        </div>
      </div>

      {/* Liên kết chuyển sang đăng ký */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-sm text-purple-600 hover:text-purple-500 font-medium"
          >
            Chưa có tài khoản? Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
}
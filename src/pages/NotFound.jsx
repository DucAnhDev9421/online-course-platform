import React from 'react';
import { useNavigate } from 'react-router-dom';
import error404Image from '../assets/img/error-404-monochrome.svg';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center p-0 m-0">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <img 
          src={error404Image} 
          alt="404 Error" 
          className="w-64 h-64 mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! Trang không tồn tại
        </h1>
        <p className="text-gray-600 mb-8">
          Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-purple-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default NotFound; 
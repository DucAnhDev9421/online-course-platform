// components/Header.jsx
import { useState } from 'react';

export default function Header() {
  const [showCategories, setShowCategories] = useState(false);

  // Danh sách categories và subcategories
  const categories = [
    {
      name: 'Phát triển',
      subcategories: ['Lập trình web', 'Mobile', 'Game', 'Data Science']
    },
    {
      name: 'Kinh doanh',
      subcategories: ['Khởi nghiệp', 'Quản lý', 'Bán hàng', 'Chiến lược']
    },
    {
      name: 'IT và Phần mềm',
      subcategories: ['An ninh mạng', 'Hệ thống', 'DevOps', 'Cloud Computing']
    },
    {
      name: 'Marketing',
      subcategories: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing']
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo Udemy */}
          <a href="#" className="text-2xl font-bold text-purple-700">Udemy</a>
          
          {/* Nút Danh mục  */}
          <div 
            className="relative hidden md:block"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <button className="font-medium hover:text-purple-700 flex items-center">
              Danh mục
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Dropdown menu */}
            {showCategories && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                {categories.map((category, index) => (
                  <div key={index} className="group relative">
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex justify-between items-center"
                    >
                      {category.name}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-gray-500" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    
                    {/* Submenu */}
                    <div className="absolute left-full top-0 ml-1 hidden group-hover:block w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {category.subcategories.map((sub, i) => (
                        <a 
                          key={i} 
                          href="#" 
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thanh tìm kiếm  */}
        <div className="hidden md:block relative flex-grow max-w-2xl mx-8">
          <input 
            type="text" 
            placeholder="Tìm kiếm khóa học" 
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="absolute right-0 top-0 h-full px-4 bg-purple-700 text-white rounded-r-full hover:bg-purple-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {/* Phần menu bên phải */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="font-medium hover:text-purple-700">Udemy Business</a>
            <a href="#" className="font-medium hover:text-purple-700">Giảng dạy</a>
          </nav>
  
    

          <div className="flex items-center space-x-4">
            <button className="hidden md:block px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100">
              Đăng nhập
            </button>
            <button className="px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
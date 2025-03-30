//Footer.jsx
export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Udemy Business</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Đào tạo nhân viên</a></li>
                <li><a href="#" className="hover:underline">Giải pháp công ty</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Về chúng tôi</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Giới thiệu</a></li>
                <li><a href="#" className="hover:underline">Sự nghiệp</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Liên hệ</a></li>
                <li><a href="#" className="hover:underline">Trợ giúp</a></li>
                <li><a href="#" className="hover:underline">Điều khoản</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Theo dõi chúng tôi</h3>
              <div className="flex space-x-4">
                <a href="#"><span className="sr-only">Facebook</span>📘</a>
                <a href="#"><span className="sr-only">Twitter</span>🐦</a>
                <a href="#"><span className="sr-only">Instagram</span>📷</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex justify-between">
            <span>© 2025 Udemy, Inc.</span>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">Tiếng Việt</a>
              <a href="#" className="hover:underline">English</a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
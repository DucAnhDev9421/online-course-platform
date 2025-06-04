import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SlideManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        // Thay URL bằng API thực tế nếu có
        const res = await axios.get('https://localhost:7261/api/slides');
        setSlides(res.data);
      } catch (err) {
        setError('Không thể tải danh sách slide');
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const filteredSlides = slides.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý Slide</h1>
      <input
        className="border px-3 py-2 mb-4 w-full max-w-xs"
        placeholder="Tìm kiếm tiêu đề slide..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Tiêu đề</th>
                <th className="border px-4 py-2">Hình ảnh</th>
                <th className="border px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSlides.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">Không có slide nào.</td>
                </tr>
              ) : (
                filteredSlides.map((slide, idx) => (
                  <tr key={slide.id}>
                    <td className="border px-4 py-2">{idx + 1}</td>
                    <td className="border px-4 py-2">{slide.title}</td>
                    <td className="border px-4 py-2">
                      <img src={slide.imageUrl} alt={slide.title} className="h-12 w-24 object-cover rounded" />
                    </td>
                    <td className="border px-4 py-2">
                      <button className="text-blue-500 hover:underline mr-2">Sửa</button>
                      <button className="text-red-500 hover:underline">Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SlideManagement; 
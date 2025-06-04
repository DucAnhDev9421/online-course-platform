import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        // Thay URL bằng API thực tế nếu có
        const res = await axios.get('https://localhost:7261/api/coupons');
        setCoupons(res.data);
      } catch (err) {
        setError('Không thể tải danh sách coupon');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const filteredCoupons = coupons.filter(c =>
    c.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý Coupon</h1>
      <input
        className="border px-3 py-2 mb-4 w-full max-w-xs"
        placeholder="Tìm kiếm mã coupon..."
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
                <th className="border px-4 py-2">Mã coupon</th>
                <th className="border px-4 py-2">Giảm giá (%)</th>
                <th className="border px-4 py-2">Ngày hết hạn</th>
                <th className="border px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">Không có coupon nào.</td>
                </tr>
              ) : (
                filteredCoupons.map((coupon, idx) => (
                  <tr key={coupon.id}>
                    <td className="border px-4 py-2">{idx + 1}</td>
                    <td className="border px-4 py-2">{coupon.code}</td>
                    <td className="border px-4 py-2">{coupon.discount}</td>
                    <td className="border px-4 py-2">{coupon.expiryDate}</td>
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

export default CouponManagement; 
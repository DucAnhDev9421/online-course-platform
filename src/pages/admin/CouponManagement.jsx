import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCouponData, setNewCouponData] = useState({
    code: '',
    description: '',
    discountAmount: 0,
    startDate: '',
    endDate: '',
    usageLimit: 0,
    isAutoApply: false,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCouponData, setEditingCouponData] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [usageHistoryData, setUsageHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://localhost:7261/api/coupons');
        setCoupons(res.data);
      } catch (err) {
        setError('Không thể tải danh sách coupon');
        toast.error('Không thể tải danh sách coupon!');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const filteredCoupons = coupons.filter(c =>
    c.code?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Hàm định dạng ngày tháng (có thể thêm thư viện date-fns hoặc moment nếu cần format phức tạp hơn)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Cắt bỏ phần Z và tạo Date object
    const date = new Date(dateString.replace('Z', ''));
    // Kiểm tra nếu ngày không hợp lệ (Invalid Date)
    if (isNaN(date.getTime())) {
        return dateString; // Trả về chuỗi gốc nếu không parse được
    }
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString.replace('Z', ''));
     if (isNaN(date.getTime())) {
        return dateString; // Trả về chuỗi gốc nếu không parse được
    }
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
  };

  // Hàm xử lý thêm coupon
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      // Định dạng lại ngày tháng sang ISO 8601 nếu cần (ví dụ: yyyy-mm-ddThh:mm:ssZ)
      const couponDataToSend = {
        ...newCouponData,
        startDate: newCouponData.startDate ? new Date(newCouponData.startDate).toISOString() : null,
        endDate: newCouponData.endDate ? new Date(newCouponData.endDate).toISOString() : null,
        discountAmount: Number(newCouponData.discountAmount), // Đảm bảo là số
        usageLimit: Number(newCouponData.usageLimit), // Đảm bảo là số
      };

      await axios.post('https://localhost:7261/api/coupons', couponDataToSend);
      toast.success('Thêm coupon thành công!');
      setShowAddModal(false);
      setNewCouponData({
        code: '',
        description: '',
        discountAmount: 0,
        startDate: '',
        endDate: '',
        usageLimit: 0,
        isAutoApply: false,
      });
      // Refresh danh sách coupon sau khi thêm thành công
      const res = await axios.get('https://localhost:7261/api/coupons');
      setCoupons(res.data);

    } catch (error) {
      console.error('Error adding coupon:', error.response?.data || error.message);
      toast.error('Có lỗi xảy ra khi thêm coupon!');
    }
  };

  const handleToggleStatus = async (couponId, currentStatus) => {
    try {
      // Xác nhận trước khi thực hiện (tùy chọn)
      // if (window.confirm(`Bạn có chắc chắn muốn ${currentStatus ? 'tắt' : 'bật'} trạng thái coupon này?`)) {
        await axios.patch(`https://localhost:7261/api/coupons/${couponId}/toggle`);
        toast.success(`Cập nhật trạng thái coupon thành công!`);
        // Refresh danh sách coupon sau khi cập nhật thành công
        const res = await axios.get('https://localhost:7261/api/coupons');
        setCoupons(res.data);
      // }
    } catch (error) {
      console.error('Error toggling coupon status:', error.response?.data || error.message);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái coupon!');
    }
  };

  // Hàm xử lý khi click nút sửa
  const handleEditClick = (coupon) => {
    // Định dạng lại ngày tháng để hiển thị trong input type='date'
    const startDate = coupon.startDate ? new Date(coupon.startDate.replace('Z', '')).toISOString().split('T')[0] : '';
    const endDate = coupon.endDate ? new Date(coupon.endDate.replace('Z', '')).toISOString().split('T')[0] : '';

    setEditingCouponData({ ...coupon, startDate, endDate });
    setShowEditModal(true);
  };

  // Hàm xử lý cập nhật coupon
  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    if (!editingCouponData || !editingCouponData.id) return;

    try {
      const couponDataToSend = {
        ...editingCouponData,
        startDate: editingCouponData.startDate ? new Date(editingCouponData.startDate).toISOString() : null,
        endDate: editingCouponData.endDate ? new Date(editingCouponData.endDate).toISOString() : null,
        discountAmount: Number(editingCouponData.discountAmount),
        usageLimit: Number(editingCouponData.usageLimit),
      };

      await axios.put(`https://localhost:7261/api/coupons/${editingCouponData.id}`, couponDataToSend);
      toast.success('Cập nhật coupon thành công!');
      setShowEditModal(false);
      setEditingCouponData(null);
      // Refresh danh sách coupon sau khi cập nhật thành công
      const res = await axios.get('https://localhost:7261/api/coupons');
      setCoupons(res.data);

    } catch (error) {
      console.error('Error updating coupon:', error.response?.data || error.message);
      toast.error('Có lỗi xảy ra khi cập nhật coupon!');
    }
  };

  // Hàm xử lý khi click nút xem lịch sử
  const handleViewUsageHistory = async (couponId) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await axios.get(`https://localhost:7261/api/coupons/${couponId}/usage`);
      setUsageHistoryData(res.data);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Error fetching usage history:', error.response?.data || error.message);
      setHistoryError('Không thể tải lịch sử sử dụng.');
      toast.error('Không thể tải lịch sử sử dụng!');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Hàm xử lý xóa coupon
  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa coupon này không?')) {
      try {
        await axios.delete(`https://localhost:7261/api/coupons/${couponId}`);
        toast.success('Xóa coupon thành công!');
        // Cập nhật lại danh sách coupon bằng cách loại bỏ coupon đã xóa
        setCoupons(coupons.filter(coupon => coupon.id !== couponId));
      } catch (error) {
        console.error('Error deleting coupon:', error.response?.data || error.message);
        toast.error('Có lỗi xảy ra khi xóa coupon!');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold gradient-text">Quản lý Coupon</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            <span>Thêm Coupon</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm mã coupon hoặc mô tả..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách coupon...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-2">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="flex flex-col items-center">
              <i className="fas fa-tags text-4xl text-gray-400 mb-3"></i>
              <p>Không tìm thấy coupon nào.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã coupon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Giới hạn</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Đã dùng</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tự động áp dụng</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{coupon.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{coupon.discountAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{formatDate(coupon.startDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{formatDate(coupon.endDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{coupon.usageLimit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{coupon.usageCount || 0}</td> {/* Cần API usage-history */} 
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                         <input type="checkbox" checked={coupon.isAutoApply} readOnly className="form-checkbox h-5 w-5 text-blue-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(coupon)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                           onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                           className={`mr-3 ${coupon.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          <i className={`fas ${coupon.isActive ? 'fa-pause-circle' : 'fa-play-circle'}`}></i>
                        </button>
                         <button
                           onClick={() => handleViewUsageHistory(coupon.id)}
                           className="text-purple-600 hover:text-purple-900 mr-3"
                        >
                          <i className="fas fa-history"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4">Thêm Coupon mới</h2>
            <form onSubmit={handleAddCoupon}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">Mã Coupon</label>
                <input
                  type="text"
                  id="code"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCouponData.code}
                  onChange={(e) => setNewCouponData({ ...newCouponData, code: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Mô tả</label>
                <input
                  type="text"
                  id="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCouponData.description}
                  onChange={(e) => setNewCouponData({ ...newCouponData, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountAmount">Giảm giá (VNĐ)</label>
                <input
                  type="number"
                  id="discountAmount"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCouponData.discountAmount}
                  onChange={(e) => setNewCouponData({ ...newCouponData, discountAmount: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">Ngày bắt đầu</label>
                <input
                  type="date"
                  id="startDate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCouponData.startDate}
                  onChange={(e) => setNewCouponData({ ...newCouponData, startDate: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">Ngày kết thúc</label>
                <input
                  type="date"
                  id="endDate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCouponData.endDate}
                  onChange={(e) => setNewCouponData({ ...newCouponData, endDate: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="usageLimit">Giới hạn sử dụng</label>
                <input
                  type="number"
                  id="usageLimit"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCouponData.usageLimit}
                  onChange={(e) => setNewCouponData({ ...newCouponData, usageLimit: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isAutoApply"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={newCouponData.isAutoApply}
                  onChange={(e) => setNewCouponData({ ...newCouponData, isAutoApply: e.target.checked })}
                />
                <label className="ml-2 text-gray-700 text-sm font-bold" htmlFor="isAutoApply">Tự động áp dụng</label>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Thêm Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {showEditModal && editingCouponData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4">Sửa Coupon</h2>
            <form onSubmit={handleUpdateCoupon}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-code">Mã Coupon</label>
                <input
                  type="text"
                  id="edit-code"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCouponData.code}
                  onChange={(e) => setEditingCouponData({ ...editingCouponData, code: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">Mô tả</label>
                <input
                  type="text"
                  id="edit-description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCouponData.description}
                  onChange={(e) => setEditingCouponData({ ...editingCouponData, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-discountAmount">Giảm giá (VNĐ)</label>
                <input
                  type="number"
                  id="edit-discountAmount"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCouponData.discountAmount}
                  onChange={(e) => setEditingCouponData({ ...editingCouponData, discountAmount: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-startDate">Ngày bắt đầu</label>
                <input
                  type="date"
                  id="edit-startDate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCouponData.startDate}
                  onChange={(e) => setEditingCouponData({ ...editingCouponData, startDate: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-endDate">Ngày kết thúc</label>
                <input
                  type="date"
                  id="edit-endDate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCouponData.endDate}
                  onChange={(e) => setEditingCouponData({ ...editingCouponData, endDate: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-usageLimit">Giới hạn sử dụng</label>
                <input
                  type="number"
                  id="edit-usageLimit"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCouponData.usageLimit}
                  onChange={(e) => setEditingCouponData({ ...editingCouponData, usageLimit: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="edit-isAutoApply"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={editingCouponData.isAutoApply}
                  onChange={(e) => setEditingCouponData({ ...editingCouponData, isAutoApply: e.target.checked })}
                />
                <label className="ml-2 text-gray-700 text-sm font-bold" htmlFor="edit-isAutoApply">Tự động áp dụng</label>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cập nhật Coupon
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingCouponData(null); }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Usage History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4">Lịch sử sử dụng Coupon</h2>
            {historyLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Đang tải lịch sử...</p>
              </div>
            ) : historyError ? (
              <div className="text-center text-red-500">{historyError}</div>
            ) : usageHistoryData.length === 0 ? (
              <div className="text-center text-gray-500">Không có lịch sử sử dụng.</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sử dụng</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị đơn hàng</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usageHistoryData.map((historyItem) => (
                      <tr key={historyItem.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{historyItem.userName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{formatDateTime(historyItem.usageDate)}</td>
                         <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-right">{historyItem.orderValue?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => { setShowHistoryModal(false); setUsageHistoryData([]); setHistoryError(null); }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CouponManagement; 
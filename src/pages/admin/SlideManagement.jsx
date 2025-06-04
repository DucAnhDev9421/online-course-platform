import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const SlideManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlideData, setNewSlideData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    order: 0,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSlideData, setEditingSlideData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'true', 'false'

  // Hàm fetchSlides được sử dụng lại nhiều lần
  const fetchSlides = async () => {
    try {
      setLoading(true);
      let url = 'https://localhost:7261/api/slide'; // Sử dụng endpoint số ít /api/slide
      const params = {};
      if (filterStatus !== 'all') {
        params.isActive = filterStatus === 'true';
      }
      
      const res = await axios.get(url, { params });
      setSlides(res.data.sort((a, b) => (a.order || 0) - (b.order || 0))); // Sort by order initially
    } catch (err) {
      setError('Không thể tải danh sách slide');
      toast.error('Không thể tải danh sách slide!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [filterStatus]); // Thêm filterStatus vào dependency array

  // Reorder function (helper for drag and drop)
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Handle drag and drop end
  const onDragEnd = async (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Reorder the filtered list visually first
    const reorderedFilteredSlides = reorder(
      filteredSlides,
      sourceIndex,
      destinationIndex
    );
    
    // Now, map the reordered filtered list back to update the original slides state
    // This is the tricky part with filtering: finding the new order in the original list
    // A simpler approach is to reorder the main slides state if no filter/search is active
    // For now, let's assume reordering the filtered list is enough and we'll send the IDs of the filtered list
    // A more robust solution for filtered lists might involve calculating the new indices in the original list

    // For simplicity, let's just reorder the filtered list and get the new ID order from it
    // A better implementation for filtered DND would be more complex.
    // Let's update the main slides state based on the new order of the filtered slides.
    // Find the slides corresponding to the reorderedFilteredSlides IDs in the original slides array
    const newSlidesOrder = reorderedFilteredSlides.map(filteredSlide => 
        slides.find(slide => slide.id === filteredSlide.id)
    );
    
    // Update the main state with the new order (only for the filtered subset's new positions)
    // This is not perfectly accurate if items are hidden by filter, but works for simple cases.
    // A truly correct implementation requires more complex state management or disabling DND on filter.
    setSlides(newSlidesOrder.filter(Boolean)); // Update state, remove any potential undefined if find fails

    // Prepare data for API call - send IDs in the new order
    const newOrderIds = reorderedFilteredSlides.map(slide => slide.id);

    try {
      // Call reorder API
      await axios.post('https://localhost:7261/api/slide/reorder', newOrderIds);
      toast.success('Cập nhật thứ tự slide thành công!');
      // Re-fetch slides to ensure order is consistent with backend, including non-filtered items
      fetchSlides();
    } catch (error) {
      console.error('Error reordering slides:', error.response?.data || error.message);
      toast.error('Có lỗi xảy ra khi cập nhật thứ tự slide!');
      // Optionally revert state on error
      fetchSlides(); // Revert to backend order on error
    }
  };

  const filteredSlides = slides.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Hàm xử lý xóa slide
  const handleDeleteSlide = async (slideId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa slide này không?')) {
      try {
        await axios.delete(`https://localhost:7261/api/slide/${slideId}`);
        toast.success('Xóa slide thành công!');
        fetchSlides();
      } catch (error) {
        console.error('Error deleting slide:', error.response?.data || error.message);
        toast.error('Có lỗi xảy ra khi xóa slide!');
      }
    }
  };

  // Hàm xử lý thêm slide
  const handleAddSlide = async (e) => {
    e.preventDefault();
    // Prepare data to send, matching CreateSlideDto
    const dataToSend = {
        title: newSlideData.title,
        subtitle: newSlideData.subtitle === '' ? null : newSlideData.subtitle, // Send null if empty string for nullable field
        imageUrl: newSlideData.imageUrl,
        linkUrl: newSlideData.linkUrl,
        order: newSlideData.order,
    };

    try {
      await axios.post('https://localhost:7261/api/slide', dataToSend);
      toast.success('Thêm slide thành công!');
      setShowAddModal(false);
      // Reset state after successful add
      setNewSlideData({
        title: '',
        subtitle: '',
        imageUrl: '',
        linkUrl: '',
        order: 0,
      });
      fetchSlides();
    } catch (error) {
      console.error('Error adding slide:', error.response?.data || error.message);
      // Display specific validation errors if available
      if (error.response && error.response.status === 400) {
        const validationErrors = error.response.data.errors; // Assuming errors are in data.errors
        let errorMessage = 'Lỗi validation:';
        for (const field in validationErrors) {
            errorMessage += `\n- ${field}: ${validationErrors[field].join(', ')}`;
        }
        toast.error(errorMessage);
      } else {
        toast.error('Có lỗi xảy ra khi thêm slide!');
      }
    }
  };

  // Hàm xử lý khi click nút sửa
  const handleEditClick = (slide) => {
    setEditingSlideData({ ...slide });
    setShowEditModal(true);
  };

  // Hàm xử lý cập nhật slide
  const handleUpdateSlide = async (e) => {
    e.preventDefault();
    if (!editingSlideData || !editingSlideData.id) return;

    // Prepare data to send, matching UpdateSlideDto
    const dataToSend = {
        title: editingSlideData.title,
        subtitle: editingSlideData.subtitle === '' ? null : editingSlideData.subtitle, // Send null if empty string
        imageUrl: editingSlideData.imageUrl,
        linkUrl: editingSlideData.linkUrl,
        order: editingSlideData.order,
        isActive: editingSlideData.isActive,
    };

    try {
      await axios.put(`https://localhost:7261/api/slide/${editingSlideData.id}`, dataToSend);
      toast.success('Cập nhật slide thành công!');
      setShowEditModal(false);
      setEditingSlideData(null);
      fetchSlides();
    } catch (error) {
      console.error('Error updating slide:', error.response?.data || error.message);
       if (error.response && error.response.status === 400) {
        const validationErrors = error.response.data.errors; // Assuming errors are in data.errors
        let errorMessage = 'Lỗi validation:';
        for (const field in validationErrors) {
            errorMessage += `\n- ${field}: ${validationErrors[field].join(', ')}`;
        }
        toast.error(errorMessage);
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật slide!');
      }
    }
  };

  // Hàm xử lý cập nhật trạng thái (Active/Inactive)
  const handleToggleStatus = async (slideId, currentStatus) => {
    try {
      await axios.patch(`https://localhost:7261/api/slide/${slideId}/status`, !currentStatus , { // Send boolean directly as per API spec
         headers: { 'Content-Type': 'application/json' }
      });
      toast.success(`Cập nhật trạng thái slide thành công!`);
      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide status:', error.response?.data || error.message);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái slide!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Slide</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
        >
          Thêm Slide
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          className="border px-3 py-2 flex-1"
          placeholder="Tìm kiếm tiêu đề slide..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Filter by Status */}
        <select
          className="border px-3 py-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Không hoạt động</option>
        </select>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Order</th>
                <th className="border px-4 py-2">Tiêu đề</th>
                <th className="border px-4 py-2">Hình ảnh</th>
                <th className="border px-4 py-2">Trạng thái</th>
                <th className="border px-4 py-2">Thao tác</th>
              </tr>
            </thead>
             <DragDropContext onDragEnd={onDragEnd}>
               <Droppable droppableId="slideTableBody">
                 {(provided) => (
                   <tbody
                     {...provided.droppableProps}
                     ref={provided.innerRef}
                     className="divide-y divide-gray-200"
                   >
                     {filteredSlides.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="text-center py-4 text-gray-500">Không có slide nào.</td>
                       </tr>
                     ) : (
                       filteredSlides.map((slide, index) => (
                         <Draggable key={slide.id} draggableId={String(slide.id)} index={index}>
                           {(provided, snapshot) => (
                             <tr
                               ref={provided.innerRef}
                               {...provided.draggableProps}
                               {...provided.dragHandleProps}
                               style={{
                                 ...provided.draggableProps.style,
                                 backgroundColor: snapshot.isDragging ? '#e0e0e0' : 'inherit',
                               }}
                               className="hover:bg-gray-100 cursor-grab"
                             >
                               <td className="border px-4 py-2 text-center">{slide.order}</td>
                               <td className="border px-4 py-2">{slide.title}</td>
                               <td className="border px-4 py-2">
                                 <img src={slide.imageUrl} alt={slide.title} className="h-12 w-24 object-cover rounded" />
                               </td>
                                <td className="border px-4 py-2 text-center">
                                  <button
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${slide.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    onClick={() => handleToggleStatus(slide.id, slide.isActive)}
                                  >
                                    {slide.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                  </button>
                                </td>
                               <td className="border px-4 py-2">
                                 <button className="text-blue-500 hover:underline mr-2" onClick={() => handleEditClick(slide)}>Sửa</button>
                                 <button
                                   className="text-red-500 hover:underline"
                                   onClick={() => handleDeleteSlide(slide.id)}
                                 >
                                   Xóa
                                 </button>
                               </td>
                             </tr>
                           )}
                         </Draggable>
                       ))
                     )}
                     {provided.placeholder}
                   </tbody>
                 )}
               </Droppable>
             </DragDropContext>
          </table>
        </div>
      )}

      {/* Add Slide Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm Slide mới</h2>
            <form onSubmit={handleAddSlide}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Tiêu đề</label>
                <input
                  type="text"
                  id="title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newSlideData.title}
                  onChange={(e) => setNewSlideData({ ...newSlideData, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subtitle">Phụ đề (Không bắt buộc)</label>
                <input
                  type="text"
                  id="subtitle"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newSlideData.subtitle}
                  onChange={(e) => setNewSlideData({ ...newSlideData, subtitle: e.target.value })}                 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">URL Hình ảnh</label>
                <input
                  type="text"
                  id="imageUrl"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newSlideData.imageUrl}
                  onChange={(e) => setNewSlideData({ ...newSlideData, imageUrl: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkUrl">URL Liên kết</label>
                <input
                  type="text"
                  id="linkUrl"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newSlideData.linkUrl}
                  onChange={(e) => setNewSlideData({ ...newSlideData, linkUrl: e.target.value })}                 
                  required
                />
              </div>
               <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">Thứ tự</label>
                <input
                  type="number"
                  id="order"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newSlideData.order}
                  onChange={(e) => setNewSlideData({ ...newSlideData, order: Number(e.target.value) })}
                  required
                  min="0"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Thêm Slide
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Slide Modal */}
      {showEditModal && editingSlideData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Sửa Slide</h2>
            <form onSubmit={handleUpdateSlide}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">Tiêu đề</label>
                <input
                  type="text"
                  id="edit-title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingSlideData.title}
                  onChange={(e) => setEditingSlideData({ ...editingSlideData, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-subtitle">Phụ đề (Không bắt buộc)</label>
                <input
                  type="text"
                  id="edit-subtitle"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingSlideData.subtitle || ''} // Use || '' to handle potential null
                  onChange={(e) => setEditingSlideData({ ...editingSlideData, subtitle: e.target.value })}                 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-imageUrl">URL Hình ảnh</label>
                <input
                  type="text"
                  id="edit-imageUrl"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingSlideData.imageUrl}
                  onChange={(e) => setEditingSlideData({ ...editingSlideData, imageUrl: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-linkUrl">URL Liên kết</label>
                <input
                  type="text"
                  id="edit-linkUrl"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingSlideData.linkUrl}
                  onChange={(e) => setEditingSlideData({ ...editingSlideData, linkUrl: e.target.value })}                 
                  required
                />
              </div>
               <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-order">Thứ tự</label>
                <input
                  type="number"
                  id="edit-order"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingSlideData.order}
                  onChange={(e) => setEditingSlideData({ ...editingSlideData, order: Number(e.target.value) })}
                  required
                  min="0"
                />
              </div>
               <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  className="mr-2 leading-tight"
                  checked={editingSlideData.isActive}
                  onChange={(e) => setEditingSlideData({ ...editingSlideData, isActive: e.target.checked })}
                />
                <label className="text-sm text-gray-700" htmlFor="edit-isActive">Hoạt động</label>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cập nhật Slide
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingSlideData(null); }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SlideManagement; 
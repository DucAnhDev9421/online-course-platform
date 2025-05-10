import React from 'react';

const DashboardTeacher = ({ courses }) => {
  const totalCourses = courses.length;
  // Placeholder cho các thống kê khác (ví dụ: tổng số học viên, doanh thu...)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Giảng viên</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-lg font-semibold mb-2">Tổng số khóa học</div>
          <div className="text-3xl font-bold text-purple-600">{totalCourses}</div>
        </div>
        {/* Thêm các card thống kê khác ở đây nếu muốn */}
      </div>
    </div>
  );
};

export default DashboardTeacher; 
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../assets/css/admin.css';
import { useUserInfo } from '../contexts/UserContext';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { userInfo } = useUserInfo();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [topEnrolledCourses, setTopEnrolledCourses] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0);

  // Kiểm tra quyền truy cập
  if (!userInfo || userInfo.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  // Thêm useEffect để fetch dữ liệu từ API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://localhost:7261/api/admin/dashboard-stats');
        const { totalUsers, totalCourses, activeStudents, topEnrolledCourses, categoryDistribution, newUsersThisMonth } = res.data;
        setTotalUsers(totalUsers);
        setTotalCourses(totalCourses);
        setActiveStudents(activeStudents);
        setTopEnrolledCourses(topEnrolledCourses);
        setCategoryDistribution(categoryDistribution);
        setNewUsersThisMonth(newUsersThisMonth);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê');
      } finally { setLoading(false); }
    };
    fetchDashboardStats();
  }, []);

  // Chart data for user growth
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Người học mới', data: [0, 0, 0, 0, 0, newUsersThisMonth], borderColor: 'rgb(75, 192, 192)', tension: 0.4, fill: true, backgroundColor: 'rgba(75, 192, 192, 0.1)' },
      { label: 'Giảng viên mới', data: [0, 0, 0, 0, 0, 0], borderColor: 'rgb(255, 99, 132)', tension: 0.4, fill: true, backgroundColor: 'rgba(255, 99, 132, 0.1)' }
    ],
  };

  // Chart data for course distribution
  const courseDistributionData = {
    labels: categoryDistribution.map(c => c.categoryName),
    datasets: [ { data: categoryDistribution.map(c => c.courseCount), backgroundColor: [ 'rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(255, 205, 86)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(255, 99, 132)', 'rgb(255, 205, 86)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(75, 192, 192)' ], borderWidth: 2, borderColor: 'white' } ],
  };

  // Chart data for course enrollment
  const courseEnrollmentData = {
    labels: topEnrolledCourses.map(c => c.courseName),
    datasets: [ { label: 'Số người đăng ký', data: topEnrolledCourses.map(c => c.enrollmentCount), backgroundColor: 'rgba(54, 162, 235, 0.7)', borderRadius: 5 } ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  useEffect(() => {
    // Load admin.js script
    const script = document.createElement('script');
    script.src = '/src/assets/js/admin.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* Dashboard Content */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="stats-card hover-card">
            <div className="flex items-center p-6">
              <div className="icon-wrapper p-3 rounded-full bg-blue-100 text-blue-500">
                <i className="fas fa-users text-2xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Tổng người dùng</h3>
                <p className="text-2xl font-semibold gradient-text">{totalUsers}</p>
                <p className="text-xs text-green-500">↑ {newUsersThisMonth} người dùng mới trong tháng</p>
              </div>
            </div>
          </div>

          <div className="stats-card hover-card">
            <div className="flex items-center p-6">
              <div className="icon-wrapper p-3 rounded-full bg-green-100 text-green-500">
                <i className="fas fa-book text-2xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Tổng khóa học</h3>
                <p className="text-2xl font-semibold gradient-text">{totalCourses}</p>
                <p className="text-xs text-green-500">↑ 8% so với tháng trước</p>
              </div>
            </div>
          </div>

          <div className="stats-card hover-card">
            <div className="flex items-center p-6">
              <div className="icon-wrapper p-3 rounded-full bg-yellow-100 text-yellow-500">
                <i className="fas fa-graduation-cap text-2xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Học viên đang học</h3>
                <p className="text-2xl font-semibold gradient-text">{activeStudents}</p>
                <p className="text-xs text-green-500">↑ 15% so với tháng trước</p>
              </div>
            </div>
          </div>

          <div className="stats-card hover-card">
            <div className="flex items-center p-6">
              <div className="icon-wrapper p-3 rounded-full bg-red-100 text-red-500">
                <i className="fas fa-dollar-sign text-2xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Doanh thu</h3>
                <p className="text-2xl font-semibold gradient-text">$12,345</p>
                <p className="text-xs text-green-500">↑ 20% so với tháng trước</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="chart-container p-6">
            <h2 className="text-xl font-semibold mb-4 gradient-text">Tăng trưởng người dùng</h2>
            {loading ? ( <div>Đang tải...</div> ) : error ? ( <div className="text-red-500">{error}</div> ) : ( <Line data={userGrowthData} options={chartOptions} /> )}
          </div>
          <div className="chart-container p-6">
            <h2 className="text-xl font-semibold mb-4 gradient-text">Phân bố khóa học</h2>
            <Doughnut data={courseDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Course Enrollment Chart */}
        <div className="mt-8">
          <div className="chart-container p-6">
            <h2 className="text-xl font-semibold mb-4 gradient-text">Top khóa học được đăng ký nhiều nhất</h2>
            <Bar data={courseEnrollmentData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 gradient-text">Hoạt động gần đây</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="activity-timeline space-y-4">
                <div className="timeline-item flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Khóa học mới "Web Development 101" đã được tạo</p>
                    <p className="text-xs text-gray-400">2 giờ trước</p>
                  </div>
                </div>
                <div className="timeline-item flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Người dùng John Doe đã đăng ký khóa "Python Programming"</p>
                    <p className="text-xs text-gray-400">4 giờ trước</p>
                  </div>
                </div>
                <div className="timeline-item flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Giảng viên mới Jane Smith đã tham gia nền tảng</p>
                    <p className="text-xs text-gray-400">1 ngày trước</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
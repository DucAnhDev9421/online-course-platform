// Admin Dashboard JavaScript

// Toggle Sidebar
function toggleSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  const content = document.querySelector('.admin-content');
  const isExpanded = sidebar.classList.contains('expanded');

  if (isExpanded) {
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');
    content.classList.remove('expanded');
    content.classList.add('collapsed');
  } else {
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('expanded');
    content.classList.remove('collapsed');
    content.classList.add('expanded');
  }
}

// Initialize DataTables
function initializeDataTables() {
  const tables = document.querySelectorAll('.datatable');
  tables.forEach(table => {
    if (table) {
      new DataTable(table, {
        responsive: true,
        language: {
          search: "Search:",
          lengthMenu: "Show _MENU_ entries",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          infoEmpty: "Showing 0 to 0 of 0 entries",
          infoFiltered: "(filtered from _MAX_ total entries)",
          paginate: {
            first: "First",
            last: "Last",
            next: "Next",
            previous: "Previous"
          }
        }
      });
    }
  });
}

// Initialize Charts
function initializeCharts() {
  // User Growth Chart
  const userGrowthCtx = document.getElementById('userGrowthChart');
  if (userGrowthCtx) {
    new Chart(userGrowthCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Users',
          data: [65, 59, 80, 81, 56, 55],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    });
  }

  // Course Distribution Chart
  const courseDistributionCtx = document.getElementById('courseDistributionChart');
  if (courseDistributionCtx) {
    new Chart(courseDistributionCtx, {
      type: 'doughnut',
      data: {
        labels: ['Programming', 'Design', 'Business', 'Marketing'],
        datasets: [{
          data: [30, 25, 25, 20],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)'
          ]
        }]
      }
    });
  }
}

// Initialize Notifications
function initializeNotifications() {
  const notificationButton = document.querySelector('.notification-button');
  if (notificationButton) {
    notificationButton.addEventListener('click', () => {
      const dropdown = document.querySelector('.notification-dropdown');
      dropdown.classList.toggle('hidden');
    });
  }
}

// Initialize Tooltips
function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Document Ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeDataTables();
  initializeCharts();
  initializeNotifications();
  initializeTooltips();

  // Add event listeners
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
}); 
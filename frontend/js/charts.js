let publicCharts = {};
let adminCharts = {};

function destroyCharts(pool) {
  Object.values(pool).forEach((chart) => chart?.destroy?.());
}

function renderPublicCharts(insights) {
  if (!insights) return;
  destroyCharts(publicCharts);

  const deptCtx = document.getElementById('chart-department');
  const statusCtx = document.getElementById('chart-status');
  const trendCtx = document.getElementById('chart-trend');

  if (!deptCtx || !statusCtx || !trendCtx) return;

  publicCharts.department = new Chart(deptCtx, {
    type: 'doughnut',
    data: {
      labels: insights.byDepartment?.map((d) => d._id) || [],
      datasets: [{
        data: insights.byDepartment?.map((d) => d.count) || [],
        backgroundColor: ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#14b8a6', '#f97316']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });

  publicCharts.status = new Chart(statusCtx, {
    type: 'bar',
    data: {
      labels: ['Pending', 'In Progress', 'Resolved', 'High Priority'],
      datasets: [{
        label: 'Count',
        data: [insights.pending || 0, insights.inProgress || 0, insights.resolved || 0, insights.highPriority || 0],
        backgroundColor: ['#f59e0b', '#0ea5e9', '#22c55e', '#ef4444']
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  publicCharts.trend = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: insights.recentTrend?.map((d) => d._id) || [],
      datasets: [{
        label: 'Complaints',
        data: insights.recentTrend?.map((d) => d.count) || [],
        borderColor: '#6366f1',
        tension: 0.35,
        fill: true,
        backgroundColor: 'rgba(99,102,241,0.12)'
      }]
    },
    options: { responsive: true }
  });
}

function renderAdminCharts(complaints = []) {
  destroyCharts(adminCharts);

  const deptMap = {};
  const priorityMap = { red: 0, yellow: 0, green: 0 };

  complaints.forEach((c) => {
    deptMap[c.department] = (deptMap[c.department] || 0) + 1;
    priorityMap[c.priority_level] = (priorityMap[c.priority_level] || 0) + 1;
  });

  const deptCtx = document.getElementById('admin-chart-dept');
  const priorityCtx = document.getElementById('admin-chart-priority');

  if (!deptCtx || !priorityCtx) return;

  adminCharts.dept = new Chart(deptCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(deptMap),
      datasets: [{
        data: Object.values(deptMap),
        backgroundColor: ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#14b8a6', '#f97316']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });

  adminCharts.priority = new Chart(priorityCtx, {
    type: 'bar',
    data: {
      labels: ['High', 'Medium', 'Resolved'],
      datasets: [{
        data: [priorityMap.red, priorityMap.yellow, priorityMap.green],
        backgroundColor: ['#ef4444', '#f59e0b', '#22c55e']
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

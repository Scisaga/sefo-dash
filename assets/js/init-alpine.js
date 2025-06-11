/**
 * Alpine.js 初始化文件
 * 注册所有页面组件到 Alpine.js 中
 */
document.addEventListener('alpine:init', () => {
  // 注册各个页面组件
  Alpine.data('dashboard', dashboard);        // 仪表盘组件
  Alpine.data('workflowPage', workflowPage);  // 工作流管理页面
  Alpine.data('usersPage', usersPage);        // 用户管理页面
  Alpine.data('templatesPage', templatesPage);// 模板管理页面
  Alpine.data('deploymentsPage', deploymentsPage); // 部署管理页面
});
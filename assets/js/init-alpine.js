document.addEventListener('alpine:init', () => {
  Alpine.data('dashboard', dashboard);
  Alpine.data('workflowPage', workflowPage);
  Alpine.data('usersPage', usersPage);
  Alpine.data('templatesPage', templatesPage);
  Alpine.data('deploymentsPage', deploymentsPage);
});
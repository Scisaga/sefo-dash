/**
 * 部署管理页面组件
 * 负责工作流部署列表的展示、筛选和详情查看
 */
function deploymentsPage() {
  return {
    // 部署列表数据
    deployments: [],
    // 筛选条件
    filters: {
      ticketId: '',
      workflowName: '',
      channelRole: '',
    },
    loading: false,
    page: 1,
    perPage: 10,
    hasMore: true,
    selected: null,

    showDetail: false,
    /**
     * 查看部署详情
     * @param {Object} deploy - 部署对象
     */
    viewDetail(deploy) {
      this.selected = deploy;
      this.showDetail = true;
    },

    /**
     * 删除部署
     * @param {Object} deploy - 部署对象
     */
    remove(deploy) {
      this.deployments = this.deployments.filter(d => d.id !== deploy.id);
      this.selected = null;
      this.showDetail = false;
    },

    /**
     * 初始化页面
     * 设置无限滚动
     */
    async init() {
      await this.loadMore();
      this.$nextTick(() => {
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) this.loadMore();
        });
        observer.observe(this.$refs.sentinel);
      });
    },

    /**
     * 加载更多部署数据
     */
    async loadMore() {
      if (this.loading || !this.hasMore) return;
      this.loading = true;
      
      const newDeployments = await window.fetchDeploymentList(this.filters, this.page, this.perPage);

      this.deployments.push(...newDeployments);
      this.page++;
      this.loading = false;
    }
  }
}

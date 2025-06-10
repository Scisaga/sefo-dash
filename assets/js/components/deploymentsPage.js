function deploymentsPage() {
  return {
    deployments: [],
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
    viewDetail(deploy) {

      this.selected = deploy;
      this.showDetail = true;
    },

    remove(deploy) {
      this.deployments = this.deployments.filter(d => d.id !== deploy.id);
      this.selected = null;
      this.showDetail = false;
    },

    async init() {
      await this.loadMore();
      this.$nextTick(() => {
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) this.loadMore();
        });
        observer.observe(this.$refs.sentinel);
      });
    },

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

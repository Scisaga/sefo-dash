function usersPage() {
  return {
    users: [],
    filters: {
      keyword: '',
      status: ''
    },
    loading: false,
    page: 1,
    perPage: 20,
    hasMore: true,

    async init() {
      this.watchFilters();
      await this.loadMore();

      this.$nextTick(() => {
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) this.loadMore();
        });
        observer.observe(this.$refs.sentinel);
      });
    },

    watchFilters() {
      this.$watch('filters.keyword', () => this.resetAndFetch());
      this.$watch('filters.status', () => this.resetAndFetch());
    },

    async resetAndFetch() {
      this.page = 1;
      this.users = [];
      this.hasMore = true;
      await this.loadMore();
    },

    async loadMore() {
      if (!this.hasMore || this.loading) return;
      this.loading = true;

      const newUsers = await window.fetchUserList(this.filters, this.page, this.perPage);
      this.users.push(...newUsers);
      this.page++;
      if (newUsers.length < this.perPage) this.hasMore = false;

      this.loading = false;
    },

    toggleUserStatus(user) {
      user.status = user.status === 'active' ? 'disabled' : 'active';
    }
  };
}
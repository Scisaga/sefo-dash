function usersPage() {
  return {
    users: [],
    filters: {
      keyword: '',
      status: '',
    },
    loading: false,
    page: 1,
    perPage: 20,
    hasMore: true,

    get filteredUsers() {
      let list = this.users;

      if (this.filters.keyword) {
        list = list.filter(u =>
          u.username.toLowerCase().includes(this.filters.keyword.toLowerCase())
        );
      }

      if (this.filters.status) {
        list = list.filter(u => u.status === this.filters.status);
      }

      return list;
    },

    async init() {
      await this.loadMore();
      this.$nextTick(() => {
        const observer = new IntersectionObserver(entries => {
          if (entries.length && entries[0].isIntersecting) {
            this.loadMore();
          }
        });
        observer.observe(this.$refs.sentinel);
      });
    },

    toggleUserStatus(user) {
      user.status = user.status === 'active' ? 'disabled' : 'active';
    },

    async loadMore() {
      if (!this.hasMore || this.loading) return;
      this.loading = true;

      await new Promise(r => setTimeout(r, 300));

      const dummyData = Array.from({ length: this.perPage }, (_, i) => {
        const id = (this.page - 1) * this.perPage + i + 1;
        const username = `user${id}`;
        const nickname = `用户${id}`;
        const email = `user${id}@example.com`;
        const role = Math.random() < 0.2 ? 'admin' : 'user';
        const status = Math.random() > 0.1 ? 'active' : 'disabled';
        const avatar = window.generateAvatarBase64(id.toString());

        return { id, username, nickname, email, role, status, avatar };
      });

      this.users.push(...dummyData);
      this.page++;
      if (this.page > 3) this.hasMore = false;
      this.loading = false;
    }
  };
}
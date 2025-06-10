function templatesPage() {
  return {
    templates: [],
    filters: {
      keyword: '',
      sort: 'updated',
      tags: [],
    },
    tagFilterInput: '',
    loading: false,
    page: 1,
    perPage: 10,
    hasMore: true,
    selectedTemplate: null,
    showDetail: false,

    async init() {
      await this.loadMore();
      this.$nextTick(() => {
        const component = this.$data;
        const observer = new IntersectionObserver(entries => {
          if (entries.length && entries[0].isIntersecting) {
            component.loadMore();
          }
        });
        observer.observe(component.$refs.sentinel);
      });
    },

    handleTemplateClick(wf) {
      this.selectedTemplate = wf;
      this.showDetail = true;
    },

    //
    toggleStar(tpl) {
      tpl.starred = !tpl.starred;
      tpl.starCount = tpl.starCount || 0;
      tpl.starCount += tpl.starred ? 1 : -1;
    },

    forkTemplate(template) {
      console.log(`将 "${template.name}" 添加到我的工作流！`);

      // 保存模板对象到 window 全局（跨页传参）
      window.pendingWorkflowFork = template;

      // 切换 hash 页面，触发 dashboard.js 路由更新
      location.hash = '#workflow';  
    },

    addFilterTag() {
      const trimmed = this.tagFilterInput.trim();
      if (trimmed && !this.filters.tags.includes(trimmed)) {
        this.filters.tags.push(trimmed);
      }
      this.tagFilterInput = '';
    },

    handleBackspaceOnEmpty() {
      if (!this.tagFilterInput && this.filters.tags.length > 0) {
        this.filters.tags.pop();
      }
    },

    handleOutsideClick(event) {
      if (event.target.closest('[data-wf-card]')) return;
      this.showDetail = false;
      this.selectedTemplate = null;
    },

    async loadMore() {

      if (!this.hasMore || this.loading) return;
      this.loading = true;
      const newTemplates = await window.fetchTemplateList(this.filters, this.page, this.perPage);

      this.templates.push(...newTemplates);
      this.page++;
      if (this.page > 5) this.hasMore = false;
      this.loading = false;
    }
  };
}

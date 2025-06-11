/**
 * 模板页面组件
 * 提供模板列表的展示、筛选、排序、收藏和使用功能
 * @module components/templatesPage
 */

function templatesPage() {
  return {
    // 模板列表数据
    templates: [],
    // 筛选条件
    filters: {
      keyword: '',    // 关键词搜索
      sort: 'updated', // 排序方式
      tags: [],       // 标签筛选
    },
    tagFilterInput: '', // 标签输入框的值
    loading: false,     // 加载状态
    page: 1,           // 当前页码
    perPage: 10,       // 每页数量
    hasMore: true,     // 是否还有更多数据
    selectedTemplate: null, // 当前选中的模板
    showDetail: false,     // 是否显示详情抽屉

    /**
     * 初始化函数
     * 加载初始数据并设置无限滚动监听
     */
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

    /**
     * 处理模板点击事件
     * @param {Object} wf - 被点击的模板对象
     */
    handleTemplateClick(wf) {
      this.selectedTemplate = wf;
      this.showDetail = true;
    },

    /**
     * 切换模板收藏状态
     * @param {Object} tpl - 目标模板对象
     */
    toggleStar(tpl) {
      tpl.starred = !tpl.starred;
      tpl.starCount = tpl.starCount || 0;
      tpl.starCount += tpl.starred ? 1 : -1;
    },

    /**
     * 使用模板创建工作流
     * @param {Object} template - 要使用的模板对象
     */
    forkTemplate(template) {
      console.log(`将 "${template.name}" 添加到我的工作流！`);

      // 保存模板对象到 window 全局（跨页传参）
      window.pendingWorkflowFork = template;

      // 切换 hash 页面，触发 dashboard.js 路由更新
      location.hash = '#workflow';  
    },

    /**
     * 添加标签筛选
     */
    addFilterTag() {
      const trimmed = this.tagFilterInput.trim();
      if (trimmed && !this.filters.tags.includes(trimmed)) {
        this.filters.tags.push(trimmed);
      }
      this.tagFilterInput = '';
    },

    /**
     * 处理标签输入框的回退键事件
     * 当输入框为空时，删除最后一个标签
     */
    handleBackspaceOnEmpty() {
      if (!this.tagFilterInput && this.filters.tags.length > 0) {
        this.filters.tags.pop();
      }
    },

    /**
     * 处理点击模板卡片外部的事件
     * 关闭详情抽屉
     * @param {Event} event - 点击事件对象
     */
    handleOutsideClick(event) {
      if (event.target.closest('[data-wf-card]')) return;
      this.showDetail = false;
      this.selectedTemplate = null;
    },

    /**
     * 加载更多模板数据
     * 实现无限滚动加载
     */
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

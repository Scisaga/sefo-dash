/**
 * 工作流管理页面组件
 * 负责工作流的展示、筛选、详情查看和部署等功能
 */
function workflowPage() {
  return {
    // 工作流列表数据
    workflows: [],
    // 筛选条件
    filters: {
      keyword: '',
      status: '',
      sort: 'updated',
      tags: [],
    },
    tagFilterInput: '',
    loading: false,
    page: 1,
    perPage: 10,
    hasMore: true,
    selectedWorkflow: null,
    showDetail: false,
    tab: 'preview',
    tagInput: '',
    deploying: false,
    deploymentSelection: {},

    // 用户候选列表，按频道和角色分组
    userCandidates: {}, // { '客服-客服人员': [user1, user2] }
    // 用户搜索关键词，按频道和角色分组
    searchQuery: {},    // { '客服-客服人员': 'abc' }

    /**
     * 获取指定频道和角色的用户列表
     * @param {string} channelName - 频道名称
     * @param {string} roleName - 角色名称
     */
    async fetchUsersForRole(channelName, roleName) {
      const key = `${channelName}-${roleName}`;
      const keyword = this.searchQuery[key] || '';
      const list = await window.fetchUserList({ keyword }, 1, 10);
      this.userCandidates[key] = list;
    },

    /**
     * 初始化页面
     * 处理待添加的工作流模板，设置无限滚动
     */
    async init() {
      // 如果 templates 页面传来了待添加的 template
      if (window.pendingWorkflowFork) {
        const tpl = window.pendingWorkflowFork;
        delete window.pendingWorkflowFork;

        const newWorkflow = {
          id: `wf-${Date.now()}`,
          name: tpl.name + '（复制）',
          description: tpl.description,
          tags: [...tpl.tags],
          updated_time: Date.now(),
          created_time: Date.now(),
          thumbnail: tpl.thumbnail,
          models: [...tpl.models],
          apps: [...tpl.apps],
          status: 'active',
          starred: false,
          executions: 0,
          instances: 0,
          channelTemplates: tpl.channelTemplates,
          highlight: true // ✅ 高亮标记
        };

        this.workflows.unshift({
          ...newWorkflow,
          highlight: true
        });
      }

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
     * 加载更多工作流数据
     */
    async loadMore() {
      if (!this.hasMore || this.loading) return;
      this.loading = true;
      
      const newWorkflows = await window.fetchWorkflowList(this.filters, this.page, this.perPage);

      this.workflows.push(...newWorkflows);
      this.page++;
      this.loading = false;
    },

    /**
     * 处理工作流卡片点击事件
     * @param {Object} wf - 工作流对象
     */
    handleWorkflowClick(wf) {
      this.showDetail = false;
      this.deploying = false;
      this.tab = 'preview';
      this.deploymentSelection = {};

      setTimeout(() => {
        this.selectedWorkflow = { ...wf };
        this.showDetail = true;
      }, 0); // 让 Alpine 先清空，再注入，强制触发绑定
    },

    /**
     * 处理页面外部点击事件，用于关闭详情面板
     * @param {Event} event - 点击事件对象
     */
    handleOutsideClick(event) {
      const cardClicked = event.target.closest('[data-wf-card]');
      if (cardClicked) return;
      this.showDetail = false;
      this.selectedWorkflow = null;
      this.deploying = false;
    },

    /**
     * 为选中的工作流添加标签
     */
    addTag() {
      const trimmed = this.tagInput.trim();
      if (trimmed && !this.selectedWorkflow.tags.includes(trimmed)) {
        this.selectedWorkflow.tags.push(trimmed);
      }
      this.tagInput = '';
    },

    /**
     * 为筛选器添加标签
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
     */
    handleBackspaceOnEmpty() {
      if (!this.tagFilterInput && this.filters.tags.length > 0) {
        this.filters.tags.pop();
      }
    },

    /**
     * 更新工作流信息
     */
    update() {
      console.log('📝 更新工作流（占位）:', this.selectedWorkflow);
      // TODO: 未来可发送 PATCH 请求更新内容
    },

    /**
     * 执行工作流部署
     */
    executeDeployment() {
      console.log('部署选择：', this.deploymentSelection);
      alert(`工作流 "${this.selectedWorkflow.name}" 已部署（模拟）！`);
      this.deploying = false;
    },

    /**
     * 删除工作流
     */
    remove() {
      console.log('🗑️ 删除工作流:', this.selectedWorkflow);
      // TODO: 删除逻辑：可从 workflows 中移除
      this.workflows = this.workflows.filter(wf => wf.id !== this.selectedWorkflow.id);
      this.selectedWorkflow = null;
      this.showDetail = false;
    },
  };
}

function workflowPage() {
  return {
    workflows: [],
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

    userCandidates: {}, // { '客服-客服人员': [user1, user2] }
    searchQuery: {},    // { '客服-客服人员': 'abc' }

    async fetchUsersForRole(channelName, roleName) {
      const key = `${channelName}-${roleName}`;
      const keyword = this.searchQuery[key] || '';
      const list = await window.fetchUserList({ keyword }, 1, 10);
      this.userCandidates[key] = list;
    },

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

    async loadMore() {
      if (!this.hasMore || this.loading) return;
      this.loading = true;
      
      const newWorkflows = await window.fetchWorkflowList(this.filters, this.page, this.perPage);

      this.workflows.push(...newWorkflows);
      this.page++;
      this.loading = false;
    },

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

    handleOutsideClick(event) {
      const cardClicked = event.target.closest('[data-wf-card]');
      if (cardClicked) return;
      this.showDetail = false;
      this.selectedWorkflow = null;
      this.deploying = false;
    },

    addTag() {
      const trimmed = this.tagInput.trim();
      if (trimmed && !this.selectedWorkflow.tags.includes(trimmed)) {
        this.selectedWorkflow.tags.push(trimmed);
      }
      this.tagInput = '';
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
    update() {
      console.log('📝 更新工作流（占位）:', this.selectedWorkflow);
      // TODO: 未来可发送 PATCH 请求更新内容
    },
    executeDeployment() {
      console.log('部署选择：', this.deploymentSelection);
      alert(`工作流 "${this.selectedWorkflow.name}" 已部署（模拟）！`);
      this.deploying = false;
    },
    remove() {
      console.log('🗑️ 删除工作流:', this.selectedWorkflow);
      // TODO: 删除逻辑：可从 workflows 中移除
      this.workflows = this.workflows.filter(wf => wf.id !== this.selectedWorkflow.id);
      this.selectedWorkflow = null;
      this.showDetail = false;
    },
  };
}

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
    deleteDeployment(deploy) {
      this.deployments = this.deployments.filter(d => d.id !== deploy.id);
      this.selected = null;
      this.showDetail = false;
    },

    get filteredDeployments() {
      return this.deployments.filter(d => {
        return (!this.filters.ticketId || d.ticketId.includes(this.filters.ticketId)) &&
               (!this.filters.workflowName || d.workflow_name.includes(this.filters.workflowName)) &&
               (!this.filters.channelRole || d.channels.some(c =>
                  c.roles.some(r => r.includes(this.filters.channelRole)) ||
                  c.users.some(u => u.includes(this.filters.channelRole))));
      });
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
      await new Promise(r => setTimeout(r, 300));

      const channelTemplates = {
        '上门履约全流程监控': [
          { name: '工程师', roles: ['工程师'] },
          { name: '客户', roles: ['客户'] },
          { name: '风控审计', roles: ['审计人员'] },
          { name: '系统通知', roles: ['系统通知'] }
        ],
        '多网点智能派单调度': [
          { name: '调度', roles: ['调度员'] },
          { name: '现场', roles: ['现场人员'] }
        ],
        '自动化 BI 报表生成': [
          { name: '分析', roles: ['数据分析师'] }
        ],
        'RAG 数据检索问答链路': [
          { name: '问答', roles: ['知识库管理员', '业务人员'] }
        ],
        '工单多轮对话引导流程': [
          { name: '客服', roles: ['客服人员'] },
          { name: '用户交互', roles: ['客户'] }
        ],
        '电子围栏实时事件推送': [
          { name: '事件监控', roles: ['安防人员'] },
          { name: '响应', roles: ['应急响应'] }
        ],
        '地址纠错与标准化流程': [
          { name: '地址', roles: ['地址专员'] }
        ],
        '智能营销线索打标签流程': [
          { name: '销售跟进', roles: ['营销顾问'] }
        ],
        '多语种 FAQ 自动应答流程': [
          { name: '语言', roles: ['语言专家'] },
          { name: '客服', roles: ['客服人员'] }
        ],
        '合同审批流数字化重建': [
          { name: '合同', roles: ['法务人员', '审核人'] },
          { name: '文档', roles: ['文档管理员'] }
        ]
      };

      const names = Object.keys(channelTemplates);

      const randUser = () => {
        const p = ['张','李','王','刘','陈','杨','赵','黄'];
        const s = ['伟','芳','娜','敏','静','强','磊','军'];
        const name = p[Math.floor(Math.random()*p.length)] + s[Math.floor(Math.random()*s.length)];
        return { name, avatar: window.generateAvatarBase64(name) };
      };

      const dummy = Array.from({ length: this.perPage }, (_, i) => {
        const name = names[Math.floor(Math.random() * names.length)];
        const id = `deploy-${this.page}-${i}`;
        const executions = Math.floor(Math.random() * 200 + 30);
        const tokens = executions * 1000;
        const gas = executions * 30;

        const channels = channelTemplates[name].map(t => ({
          name: t.name,
          roles: t.roles,
          users: Array.from({ length: Math.min(3, t.roles.length * 2) }, randUser),
          messageCount: Math.floor(Math.random() * 60)
        }));

        return {
          id,
          ticketId: `TKT-${this.page}-${i}`,
          workflow_id: `wf-${Math.floor(Math.random()*100)}`,
          workflow_name: name,
          executions,
          tokens,
          token_per_exec: 1000,
          gas,
          gas_per_exec: 30,
          tokens_display: `${(tokens/1000).toFixed(1)}k`,
          createdAt: Date.now() - Math.floor(Math.random()*1e7),
          channels
        };
      });

      this.deployments.push(...dummy);
      this.page++;
      if (this.page > 5) this.hasMore = false;
      this.loading = false;
    }
  }
}

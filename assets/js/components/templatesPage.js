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
    _initialized: false,

    get filteredTemplates() {
      let list = this.templates;

      if (this.filters.keyword) {
        list = list.filter(wf => wf.name.includes(this.filters.keyword));
      }
      if (this.filters.tags.length > 0) {
        list = list.filter(wf => this.filters.tags.every(tag => wf.tags.includes(tag)));
      }
      if (this.filters.sort === 'updated') {
        list = list.sort((a, b) => b.updated_time - a.updated_time);
      } else if (this.filters.sort === 'starred') {
        list = list.sort((a, b) => b.starred - a.starred);
      }
      return list;
    },

    async init() {
      await this.loadMore();
      this.$nextTick(() => {
        const component = this.$data; // 🟢 正确方式，使用 Alpine 提供的稳定引用
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

    toggleStar(tpl) {
      tpl.starred = !tpl.starred;
      tpl.starCount = tpl.starCount || 0;
      tpl.starCount += tpl.starred ? 1 : -1;
    },

    forkTemplate(template) {
      alert(`已将 "${template.name}" 添加到我的工作流！`);
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
      await new Promise(r => setTimeout(r, 400));

      const titles = [
        '多端履约状态看板', '工业数据采集分析', '全链路质检流程',
        '跨组织审批流协作', '智慧物流调度引擎', '运营数据可视化大屏',
        '客户接触路径追踪', '作业风险自动识别流程', '设备运维周期预测', '无人值守任务机器人'
      ];

      const descriptions = [
        '展示任务的执行状态、处理进度与异常预警，适用于客服、运维、履约管理等场景需求。',
        '自动采集设备运行传感器数据，进行边缘计算与集中聚合分析以辅助业务决策。',
        '全流程覆盖多媒体资料的质检，包括文本、语音与图像内容，输出标准化质检报告。',
        '支持多组织间的审批流协作，配置多层审批节点与流程动态控制策略。',
        '融合任务分布、资源约束与实时数据，智能计算最优物流调度与落地方案。',
        '从业务系统采集关键指标并渲染成数据大屏，支持实时更新与定制化视图。',
        '记录用户在平台的每次接触事件，为营销、客服等角色提供行为路径可视化能力。',
        '结合任务工单与模型推理，智能识别作业流程中存在的潜在风险与不规范行为。',
        '分析历史运维周期与当前设备数据，预测下次维护时间以减少计划外停机。',
        '基于固定规则自动执行重复任务，适用于质检、审批、数据处理等无人值守场景。'
      ];

      const tagsList = [
        ['工业自动化', '流程监控'], ['数据采集', '边缘计算'],
        ['质检流程'], ['审批流'], ['智能调度', '路径规划'],
        ['数据可视化'], ['客户行为'], ['风险识别'],
        ['预测分析'], ['自动化机器人']
      ];

      const models = ['gpt-4o', 'qwen2.5', 'deepseek', 'yi-1.5', 'ChatGLM3'];
      const apps = ['数据采集系统', '运维调度引擎', '质检服务', '流程引擎', '大屏系统'];

      const dummyData = Array.from({ length: this.perPage }, (_, i) => {
        const now = Date.now();
        return {
          id: `tpl-${this.page}-${i}`,
          name: titles[i % titles.length],
          description: descriptions[i % descriptions.length],
          tags: tagsList[i % tagsList.length],
          updated_time: now - Math.floor(Math.random() * 1e8),
          thumbnail: generateWorkflowStyleBase64(),
          models: [models[Math.floor(Math.random() * models.length)]],
          apps: [apps[Math.floor(Math.random() * apps.length)]],
          starred: 0,
          starCount: Math.floor(Math.random() * 20) + 1,
          forks: Math.floor(Math.random() * 200)
        };
      });

      this.templates.push(...dummyData);
      this.page++;
      if (this.page > 5) this.hasMore = false;
      this.loading = false;
    },
  };
}
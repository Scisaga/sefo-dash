/**
 * 模型服务页面组件
 * 提供模型服务列表的展示、筛选、创建、编辑和删除功能
 * @module pages/modelPage
 */

function modelPage() {
  return {
    // 模型服务列表数据
    models: [],
    // 筛选条件
    filters: {
      keyword: '',    // 关键词搜索
    },
    loading: false,     // 加载状态
    page: 1,           // 当前页码
    perPage: 10,       // 每页数量
    hasMore: true,     // 是否还有更多数据
    selectedModel: null, // 当前选中的模型
    showDetail: false,  // 是否显示详情抽屉
    showCreateModal: false, // 是否显示创建弹窗
    newModel: {         // 新模型数据
      name: '',
      baseUrl: '',
      apiKey: '',
      thumbnail: 'https://picsum.photos/200',
    },

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
     * 加载更多模型数据
     * 实现无限滚动加载
     */
    async loadMore() {
      if (!this.hasMore || this.loading) return;
      this.loading = true;
      const newModels = await window.fetchModelList(this.filters, this.page, this.perPage);

      this.models.push(...newModels);
      this.page++;
      if (newModels.length < this.perPage) this.hasMore = false;
      this.loading = false;
    },

    /**
     * 处理模型点击事件
     * @param {Object} model - 被点击的模型数据
     */
    handleModelClick(model) {
      this.selectedModel = { ...model };
      this.showDetail = true;
    },

    /**
     * 创建新模型
     */
    async createModel() {
      if (!this.newModel.name || !this.newModel.baseUrl) {
        alert('请填写必要信息');
        return;
      }

      const model = await window.fetchModelList.create(this.newModel);
      this.models.unshift(model);
      this.showCreateModal = false;
      this.newModel = {
        name: '',
        baseUrl: '',
        apiKey: '',
        thumbnail: 'https://picsum.photos/200',
      };
    },

    /**
     * 更新模型信息
     */
    async update() {
      if (!this.selectedModel.name || !this.selectedModel.baseUrl) {
        alert('请填写必要信息');
        return;
      }

      const updatedModel = await window.fetchModelList.update(this.selectedModel.id, this.selectedModel);
      const index = this.models.findIndex(m => m.id === updatedModel.id);
      if (index !== -1) {
        this.models[index] = updatedModel;
      }
      this.showDetail = false;
    },

    /**
     * 删除模型
     */
    async remove() {
      if (!confirm('确定要删除这个模型服务吗？')) return;

      await window.fetchModelList.delete(this.selectedModel.id);
      this.models = this.models.filter(m => m.id !== this.selectedModel.id);
      this.showDetail = false;
    },
  };
} 
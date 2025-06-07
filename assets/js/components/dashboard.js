function dashboard() {
  return {
    timeFull: '',
    runningCount: 3,
    quota: {
      token: 3200,
      gas: 1840,
    },
    currentHash: '',

    updateTime() {
      const now = new Date();
      this.timeFull = now.toLocaleString('zh-CN');
    },

    async loadContent(hash) {
      this.currentHash = hash;

      const view = hash.replace('#', '');
      const res = await fetch(`pages/${view}.html`);
      const html = await res.text();

      // 先清空再插入 DOM 元素
      this.$refs.mainContainer.innerHTML = '';

      console.log('🔥 插入 templates.html 内容');
      const tmp = document.createElement('div');
      tmp.innerHTML = html;

      // 只插入子元素，避免外层结构被破坏
      [...tmp.children].forEach(child => {
        this.$refs.mainContainer.appendChild(child);
      });

      console.log('🧠 调用 Alpine.initTree');
      Alpine.initTree(this.$refs.mainContainer);
    },

    handleRouteChange() {
      const hash = location.hash || '#workflow';
      this.loadContent(hash);
    },

    init() {
      this.updateTime();
      setInterval(() => this.updateTime(), 1000);
      this.handleRouteChange();
      window.addEventListener('hashchange', () => this.handleRouteChange());
    }
  };
}
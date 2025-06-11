/**
 * 部署列表数据获取模块
 * 提供工作流部署列表的模拟数据获取功能，支持分页和筛选
 * @module store/fetchDeploymentList
 */

/**
 * 获取部署列表数据
 * @param {Object} filters - 筛选条件
 * @param {string} [filters.ticketId] - 工单ID筛选
 * @param {string} [filters.workflowName] - 工作流名称筛选
 * @param {string} [filters.channelRole] - 频道角色筛选
 * @param {number} [page=1] - 页码
 * @param {number} [perPage=10] - 每页数量
 * @returns {Promise<Array>} 部署列表数据
 */
window.fetchDeploymentList = async function(filters = {}, page = 1, perPage = 10) {
  
  // 模拟网络延迟
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

  /**
   * 生成随机用户信息
   * @returns {Object} 包含姓名和头像的用户信息
   */
  const randUser = () => {
    const p = ['张','李','王','刘','陈','杨','赵','黄'];
    const s = ['伟','芳','娜','敏','静','强','磊','军'];
    const name = p[Math.floor(Math.random()*p.length)] + s[Math.floor(Math.random()*s.length)];
    return { name, avatar: window.generateAvatarBase64(name) };
  };

  // 生成模拟数据
  const dummyData = Array.from({ length: perPage }, (_, i) => {
    const name = names[Math.floor(Math.random() * names.length)];
    const id = `deploy-${page}-${i}`;
    const executions = Math.floor(Math.random() * 200 + 30);
    const tokens = executions * 1000;
    const gas = executions * 30;

    // 生成频道数据
    const channels = channelTemplates[name].map(t => ({
      name: t.name,
      roles: t.roles,
      users: Array.from({ length: Math.min(3, t.roles.length * 2) }, randUser),
      messageCount: Math.floor(Math.random() * 60)
    }));

    return {
      id,
      ticketId: `TKT-${page}-${i}`,
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

  // 根据筛选条件过滤数据
  return dummyData.filter(d => {
    return (!filters.ticketId || d.ticketId.includes(filters.ticketId)) &&
           (!filters.workflowName || d.workflow_name.includes(filters.workflowName)) &&
           (!filters.channelRole || d.channels.some(c =>
              c.roles.some(r => r.includes(filters.channelRole)) ||
              c.users.some(u => u.includes(filters.channelRole))));
  });
};
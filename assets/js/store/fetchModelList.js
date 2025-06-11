/**
 * 模型服务列表数据获取模块
 * 提供模型服务列表的模拟数据获取功能，支持分页和筛选
 * @module store/fetchModelList
 */

/**
 * 获取模型服务列表数据
 * @param {Object} filters - 筛选条件
 * @param {string} [filters.keyword] - 关键词搜索
 * @param {number} [page=1] - 页码
 * @param {number} [perPage=10] - 每页数量
 * @returns {Promise<Array>} 模型服务列表数据
 */
window.fetchModelList = async function(filters = {}, page = 1, perPage = 10) {
  await new Promise(r => setTimeout(r, 400));

  const models = [
    {
      name: 'GPT-4',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-****',
      description: 'OpenAI 最强大的语言模型，具有出色的推理能力和广泛的知识。',
    },
    {
      name: 'Claude',
      baseUrl: 'https://api.anthropic.com/v1',
      apiKey: 'sk-****',
      description: 'Anthropic 开发的大型语言模型，擅长长文本理解和生成。',
    },
    {
      name: 'DeepSeek',
      baseUrl: 'https://api.deepseek.com/v1',
      apiKey: 'sk-****',
      description: '深度求索开发的开源大语言模型，支持中英双语。',
    },
    {
      name: 'Qwen',
      baseUrl: 'https://api.qwen.com/v1',
      apiKey: 'sk-****',
      description: '通义千问开发的大语言模型，具有强大的中文理解和生成能力。',
    },
    {
      name: 'Yi',
      baseUrl: 'https://api.yi.com/v1',
      apiKey: 'sk-****',
      description: '零一万物开发的开源大语言模型，支持多语言。',
    },
    {
      name: 'Moonshot',
      baseUrl: 'https://api.moonshot.com/v1',
      apiKey: 'sk-****',
      description: '月之暗面开发的大语言模型，专注于中文场景。',
    },
    {
      name: 'ChatGLM',
      baseUrl: 'https://api.chatglm.com/v1',
      apiKey: 'sk-****',
      description: '清华开源的双语对话语言模型，具有强大的推理能力。',
    },
    {
      name: 'Baichuan',
      baseUrl: 'https://api.baichuan.com/v1',
      apiKey: 'sk-****',
      description: '百川智能开发的开源大语言模型，支持中英双语。',
    },
    {
      name: 'Gemini',
      baseUrl: 'https://api.gemini.com/v1',
      apiKey: 'sk-****',
      description: 'Google 开发的多模态大语言模型，支持文本、图像和代码。',
    },
    {
      name: 'Mistral',
      baseUrl: 'https://api.mistral.com/v1',
      apiKey: 'sk-****',
      description: 'Mistral AI 开发的高效开源大语言模型，性能优异。',
    }
  ];

  const dummyData = models.map((model, i) => {
    const updatedAt = Date.now() - Math.floor(Math.random() * 1e8);
    return {
      id: `model-${page}-${i}`,
      name: model.name,
      baseUrl: model.baseUrl,
      apiKey: model.apiKey,
      description: model.description,
      updated_time: updatedAt,
      thumbnail: window.generateModelThumbnail(model.name),
    };
  });

  // 应用筛选条件
  const filteredData = dummyData.filter(model => {
    const matchKeyword = filters.keyword
      ? model.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        model.description.toLowerCase().includes(filters.keyword.toLowerCase())
      : true;

    return matchKeyword;
  });

  // 计算分页
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return filteredData.slice(start, end);
};

// 添加 CRUD 操作
window.fetchModelList.create = async function(data) {
  await new Promise(r => setTimeout(r, 400));
  return {
    ...data,
    id: `model-${Date.now()}`,
    updated_time: Date.now(),
    thumbnail: data.thumbnail || window.generateModelThumbnail(data.name),
  };
};

window.fetchModelList.update = async function(id, data) {
  await new Promise(r => setTimeout(r, 400));
  return {
    ...data,
    id,
    updated_time: Date.now(),
    thumbnail: data.thumbnail || window.generateModelThumbnail(data.name),
  };
};

window.fetchModelList.delete = async function(id) {
  await new Promise(r => setTimeout(r, 400));
  return true;
}; 
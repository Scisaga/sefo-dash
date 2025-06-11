/**
 * 缩略图生成工具模块
 * 提供工作流缩略图和用户头像的生成功能
 * @module utils/thumbnail
 */

/**
 * 生成工作流缩略图
 * 创建一个包含随机节点和连线的流程图缩略图
 * @param {string} [seed=''] - 随机种子，用于生成可重复的图案
 * @returns {string} Base64 编码的 PNG 图片数据
 */
function generateWorkflowStyleBase64(seed = '') {
  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 节点和布局参数
  const nodeRadius = 8;
  const nodeSize = 14;
  const leftMargin = 8;
  const rightMargin = canvas.width - 8;
  const levels = 4;
  const layout = [
    Math.floor(1 + Math.random() * 2),
    Math.floor(2 + Math.random() * 2),
    Math.floor(1 + Math.random() * 2),
    Math.floor(1 + Math.random() * 2),
  ];

  // 预定义的颜色对
  const colorPairs = [
    { fill: '#bfdbfe', border: '#1d4ed8' },
    { fill: '#bbf7d0', border: '#059669' },
    { fill: '#fef3c7', border: '#d97706' },
    { fill: '#fecaca', border: '#b91c1c' },
    { fill: '#ddd6fe', border: '#7c3aed' },
    { fill: '#a5f3fc', border: '#0891b2' },
  ];

  // 生成节点
  const nodes = [];
  for (let level = 0; level < layout.length; level++) {
    const count = layout[level];
    for (let i = 0; i < count; i++) {
      const x = leftMargin + ((rightMargin - leftMargin) / (levels - 1)) * level;
      const spacingY = canvas.height / (count + 1);
      const y = spacingY * (i + 1);
      const color = colorPairs[Math.floor(Math.random() * colorPairs.length)];
      nodes.push({ id: `${level}-${i}`, x, y, level, color });
    }
  }

  // 绘制连线
  nodes.forEach(source => {
    const nextLevelNodes = nodes.filter(n => n.level === source.level + 1);
    if (nextLevelNodes.length > 0) {
      const targets = [nextLevelNodes[Math.floor(Math.random() * nextLevelNodes.length)]];
      if (Math.random() > 0.6 && nextLevelNodes.length > 1) {
        targets.push(nextLevelNodes[Math.floor(Math.random() * nextLevelNodes.length)]);
      }
      targets.forEach(target => {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }
  });

  // 绘制节点
  nodes.forEach(node => {
    ctx.beginPath();
    const isCircle = node.level === 0 || node.level === layout.length - 1;
    ctx.fillStyle = node.color.fill;
    if (isCircle) {
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.rect(node.x - nodeSize / 2, node.y - nodeSize / 2, nodeSize, nodeSize);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.strokeStyle = node.color.border;
    ctx.lineWidth = 1.5;
    if (isCircle) {
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    } else {
      ctx.rect(node.x - nodeSize / 2, node.y - nodeSize / 2, nodeSize, nodeSize);
    }
    ctx.stroke();
  });

  return canvas.toDataURL('image/png');
}

/**
 * 生成用户头像
 * 创建一个基于用户名的渐变背景头像，包含装饰图形和首字母
 * @param {string} [seed=''] - 用户名，用于生成可重复的头像
 * @returns {string} Base64 编码的 PNG 图片数据
 */
function generateAvatarBase64(seed = '') {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  /**
   * 简单的字符串哈希函数
   * @param {string} str - 输入字符串
   * @returns {number} 哈希值
   */
  function hashString(str) {
    return [...str].reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7) >>> 0;
  }

  const hash = hashString(seed);
  const rand = (i) => Math.abs((Math.sin(hash + i) * 10000) % 1);

  // 创建渐变背景
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, `hsl(${(hash % 360)}, 60%, 70%)`);
  gradient.addColorStop(1, `hsl(${(hash * 3 % 360)}, 70%, 60%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // 添加装饰图形
  for (let i = 0; i < 5; i++) {
    const x = size * rand(i + 1);
    const y = size * rand(i + 2);
    const r = 5 + 8 * rand(i + 3);
    ctx.beginPath();
    ctx.globalAlpha = 0.2 + 0.3 * rand(i + 4);
    ctx.fillStyle = `hsl(${(hash * (i + 5)) % 360}, 80%, 80%)`;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 绘制中心字母
  const char = seed[0]?.toUpperCase() || '?';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, size / 2, size / 2);

  return canvas.toDataURL('image/png');
}

/**
 * 生成模型服务缩略图
 * 创建一个包含随机节点和连线的抽象网络图
 * @param {string} modelName - 模型名称
 * @param {number} [size=200] - 图片尺寸
 * @returns {string} Base64 编码的 PNG 图片数据
 */
window.generateModelThumbnail = function(modelName, size = 200) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 使用模型名称生成哈希值
  const hash = [...modelName].reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7) >>> 0;
  const rand = (i) => Math.abs((Math.sin(hash + i) * 10000) % 1);

  // 生成随机颜色
  const hue = (hash % 360);
  const bgColor = `hsl(${hue}, 30%, 15%)`;
  const lineColor = `hsl(${hue}, 70%, 80%)`;
  const nodeColor = `hsl(${hue}, 60%, 60%)`;

  // 绘制深色背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // 节点和布局参数
  const nodeRadius = size * 0.04;
  const nodeSize = size * 0.07;
  const margin = size * 0.1;
  const levels = 4;
  const layout = [
    Math.floor(1 + rand(1) * 2),
    Math.floor(2 + rand(2) * 2),
    Math.floor(1 + rand(3) * 2),
    Math.floor(1 + rand(4) * 2),
  ];

  // 生成节点
  const nodes = [];
  for (let level = 0; level < layout.length; level++) {
    const count = layout[level];
    for (let i = 0; i < count; i++) {
      const x = margin + ((size - 2 * margin) / (levels - 1)) * level;
      const spacingY = (size - 2 * margin) / (count + 1);
      const y = margin + spacingY * (i + 1);
      nodes.push({ id: level * 100 + i, x, y, level });
    }
  }

  // 绘制连线
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = size * 0.005;
  nodes.forEach(source => {
    const nextLevelNodes = nodes.filter(n => n.level === source.level + 1);
    if (nextLevelNodes.length > 0) {
      const targets = [nextLevelNodes[Math.floor(rand(source.id) * nextLevelNodes.length)]];
      if (rand(source.id + 1) > 0.6 && nextLevelNodes.length > 1) {
        targets.push(nextLevelNodes[Math.floor(rand(source.id + 2) * nextLevelNodes.length)]);
      }
      targets.forEach(target => {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      });
    }
  });

  // 绘制节点
  nodes.forEach(node => {
    ctx.beginPath();
    const isCircle = node.level === 0 || node.level === layout.length - 1;
    ctx.fillStyle = nodeColor;
    if (isCircle) {
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.rect(node.x - nodeSize / 2, node.y - nodeSize / 2, nodeSize, nodeSize);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = size * 0.008;
    if (isCircle) {
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    } else {
      ctx.rect(node.x - nodeSize / 2, node.y - nodeSize / 2, nodeSize, nodeSize);
    }
    ctx.stroke();
  });

  return canvas.toDataURL('image/png');
};
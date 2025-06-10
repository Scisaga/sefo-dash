function generateWorkflowStyleBase64(seed = '') {

  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
  const colorPairs = [
    { fill: '#bfdbfe', border: '#1d4ed8' },
    { fill: '#bbf7d0', border: '#059669' },
    { fill: '#fef3c7', border: '#d97706' },
    { fill: '#fecaca', border: '#b91c1c' },
    { fill: '#ddd6fe', border: '#7c3aed' },
    { fill: '#a5f3fc', border: '#0891b2' },
  ];
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


function generateAvatarBase64(seed = '') {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 简单哈希函数
  function hashString(str) {
    return [...str].reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7) >>> 0;
  }

  const hash = hashString(seed);
  const rand = (i) => Math.abs((Math.sin(hash + i) * 10000) % 1);

  // 渐变背景（线性）
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, `hsl(${(hash % 360)}, 60%, 70%)`);
  gradient.addColorStop(1, `hsl(${(hash * 3 % 360)}, 70%, 60%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // 抽象装饰图形（随机圆点）
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

  // 中心字母
  const char = seed[0]?.toUpperCase() || '?';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, size / 2, size / 2);

  return canvas.toDataURL('image/png');
}
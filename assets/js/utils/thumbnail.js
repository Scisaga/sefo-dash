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

if (typeof module !== 'undefined') {
  module.exports = generateWorkflowStyleBase64;
}


function generateAvatarBase64(seed = '') {
  // 高质量扰动 hash（更分散）
  const hash = (() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i) << (i % 8);
    }
    return (h * 2654435761) >>> 0;
  })();

  const rand = (offset, min, max) => {
    const base = Math.abs(Math.sin(hash + offset) * 10000);
    return min + Math.floor(base % (max - min + 1));
  };

  const center = 50;
  const outerRadius = 35;
  const innerRadius = outerRadius * 0.5;
  const spikes = rand(1, 5, 6); // 5 或 6 角星
  const strokeLayers = rand(2, 1, 3); // 1~3 条边框线
  const angleOffset = (rand(5, 0, 360) * Math.PI) / 180;

  const baseHue = rand(0, 0, 360);                     // 背景色 H
  const fillHue = (baseHue + 180) % 360;               // 对比色 H
  const borderHue = (fillHue + rand(12, -30, 30)) % 360;

  const bgColor = `hsl(${baseHue}, 40%, 92%)`;          // 柔和背景
  const fillColor = `hsl(${fillHue}, 80%, 55%)`;        // 明亮对比填充
  const borderColor = (delta) => `hsl(${borderHue}, 80%, ${45 - delta * 8}%)`;

  const getStarPoints = (outer, inner, rotation) => {
    const points = [];
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (Math.PI * i) / spikes + rotation;
      const radius = i % 2 === 0 ? outer : inner;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(' ');
  };

  const polygons = [];

  // 填充星形
  polygons.push(
    `<polygon points="${getStarPoints(outerRadius, innerRadius, angleOffset)}" 
              fill="${fillColor}" stroke="none"/>`
  );

  // 多层边框线
  for (let i = 0; i < strokeLayers; i++) {
    const scale = 1 - i * 0.05;
    polygons.push(
      `<polygon points="${getStarPoints(
        outerRadius * scale,
        innerRadius * scale,
        angleOffset
      )}" 
        fill="none" 
        stroke="${borderColor(i)}" 
        stroke-width="2" 
        stroke-linejoin="round" />`
    );
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="12" ry="12" fill="${bgColor}" />
      ${polygons.join('\n')}
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

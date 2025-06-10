// store/fetchUserList.js
window.fetchUserList = async function(filters = {}, page = 1, perPage = 20) {

  await new Promise(r => setTimeout(r, 300)); // 模拟延迟

  const dummyData = Array.from({ length: perPage }, (_, i) => {
    
    const id = (page - 1) * perPage + i + 1;
    const username = `user${id}`;
    const nickname = `用户${id}`;
    const email = `user${id}@example.com`;

    const roles = Math.random() < 0.2 ? 'system_user system_admin' : 'system_user';
    const status = Math.random() > 0.1 ? 'active' : 'in_active'; // 供状态筛选和切换使用
    const create_at = Date.now() - Math.floor(Math.random() * 100 * 86400 * 1000); // 最近100天内

    const avatar = window.generateAvatarBase64(username);

    return { id, username, nickname, email, roles, status, create_at, avatar };
  });

  return dummyData.filter(user => {
    const matchKeyword = filters.keyword
      ? user.username.toLowerCase().includes(filters.keyword.toLowerCase())
      : true;

    const matchStatus = filters.status
      ? user.status === filters.status
      : true;

    return matchKeyword && matchStatus;
  });
};
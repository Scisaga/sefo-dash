## 介绍

这是建一个 n8n 风格的纯静态 Web 管理系统前端界面：

技术栈与特征：
- HTML + TailwindCSS：用于布局与样式，保持现代感与响应式；
- Alpine.js：轻量级前端交互框架，用于页面的数据绑定与交互；
- Preline.js：前端组件库
- material-symbols：字体库

目前文件：
- workflow.html 工作流子页面代码
- workflowPage.js 工作流子页面的相关JS逻辑
- users.html 用户列表子页面代码
- usersPage.js 用户列表子页面的相关JS逻辑
- deployments.html 工作流部署列表子页面代码
- deploymentsPage.js 工作流部署列表子页面的相关JS逻辑


工作流模板定义了一类标准化业务流程的结构，包括流程节点、依赖模型与应用，以及用于协作的频道模板配置。频道模板明确了部署后将创建哪些频道、每个频道允许哪些角色的用户参与以及人数上限。部署是将工作流模板实例化为具体业务场景的过程，系统会根据模板创建对应的部署实例和频道，并将用户按角色加入各自频道，完成完整的流程初始化，每次部署都关联了一组外部变量（如工单ID）。

## 安装依赖
```bash
# 安装所有依赖（包括 TailwindCSS、Alpine.js 和 Preline）
npm install

# 生成编译后的 CSS 文件
npx tailwindcss -i ./assets/css/style.css -o ./assets/css/style.compiled.css --watch
```

## 测试运行
```
python -m http.server 8000
```
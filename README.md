# Trae Todo - 任务管理应用

一个现代化的任务管理应用，帮助你高效管理日常任务，支持多维度分类、标签管理和云端同步。

## ✨ 功能特点

- **任务管理** - 创建、编辑、删除任务，支持完成状态切换
- **多维度分类** - 按工作、个人、学习等分类管理任务
- **标签系统** - 灵活的标签标记，快速筛选任务
- **时间筛选** - 查看今日、本周、逾期任务
- **拖拽排序** - 自定义任务顺序
- **优先级设置** - 高、中、低三级优先级
- **云端同步** - 数据自动同步到 Supabase
- **GitHub 登录** - 安全便捷的 OAuth 认证

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式**: TailwindCSS 3
- **状态管理**: Zustand
- **数据库**: Supabase
- **路由**: React Router 7
- **拖拽**: @dnd-kit
- **图标**: Lucide React

## 📁 项目结构

```
src/
├── components/          # UI 组件
│   ├── ui/             # 基础组件（Button、Input、Modal等）
│   ├── AppLayout.tsx   # 主布局
│   ├── TodoList.tsx    # 任务列表（含拖拽排序）
│   ├── TodoForm.tsx    # 任务表单
│   ├── Sidebar.tsx     # 侧边栏导航
│   └── FilterBar.tsx   # 筛选栏
├── pages/              # 页面
│   ├── Home.tsx        # 全部任务
│   ├── Today.tsx       # 今日任务
│   ├── Week.tsx        # 本周任务
│   ├── Overdue.tsx     # 逾期任务
│   ├── Completed.tsx   # 已完成任务
│   └── Login.tsx       # 登录页
├── store/              # 状态管理（Zustand）
│   ├── todoStore.ts    # 任务状态
│   ├── categoryStore.ts # 分类状态
│   ├── tagStore.ts     # 标签状态
│   └── filterSortStore.ts # 筛选排序
├── contexts/           # React Context
│   └── AuthContext.tsx # 认证上下文
├── lib/                # 核心工具
│   ├── supabase.ts     # Supabase 客户端
│   └── mappers.ts      # 数据映射
├── types/              # TypeScript 类型
│   ├── index.ts        # 业务类型
│   └── database.ts     # 数据库类型
└── utils/              # 工具函数
    └── date.ts         # 日期工具
```

## 🚀 快速开始

### 前置条件

- Node.js >= 20
- Supabase 账号

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制 `.env.example` 为 `.env.local`
2. 在 Supabase 控制台获取项目凭证
3. 配置环境变量：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 数据库初始化

在 Supabase SQL 编辑器中执行 `supabase/migrations/001_initial_schema.sql` 文件，创建必要的表和权限。

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

## 📦 构建

```bash
npm run build
```

构建产物输出到 `dist` 目录。

## 🔧 代码检查

```bash
npm run lint    # ESLint 检查
npm run check   # TypeScript 类型检查
```

## 🌐 部署

### Vercel 部署

1. 连接 GitHub 仓库
2. 在环境变量中添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. 点击 Deploy

### 其他平台

确保在部署环境中正确配置环境变量，构建命令为 `npm run build`。

## 📝 开发说明

### 添加新功能

1. 在 `types/index.ts` 定义新类型
2. 在 `store/` 创建或更新状态管理
3. 创建或更新组件
4. 更新路由配置

### 数据库变更

1. 在 `supabase/migrations/` 创建新的迁移文件
2. 在 `types/database.ts` 更新类型定义

## 📄 许可证

MIT License

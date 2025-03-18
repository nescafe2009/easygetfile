# EasyGetFile

一个简单的文件管理、文本和备忘录应用，使用苹果设计风格。

## 功能特点

- **文件浏览器**：在左上角，可以上传和下载文件
- **文本区域**：在左下角，可以输入并保存文本内容
- **备忘录**：在右侧，展示所有保存的备忘笔记

## 技术栈

- Next.js（React框架）
- TypeScript 
- Tailwind CSS（样式）
- 服务器本地文件存储

## 如何使用

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动

### 构建生产版本

```bash
npm run build
```

### 运行生产版本

```bash
npm run start
```

## 项目结构

```
easygetfile/
├── public/            # 静态资源
│   └── uploads/       # 上传的文件存储目录
├── src/
│   ├── app/           # 应用页面
│   │   ├── api/       # API路由
│   │   │   ├── files/ # 文件管理API
│   │   │   └── notes/ # 备忘录管理API
│   │   ├── page.tsx   # 主页面
│   │   └── layout.tsx # 布局组件
│   ├── components/    # 组件
│   │   ├── FileBrowser.tsx  # 文件浏览器组件
│   │   ├── TextArea.tsx     # 文本区域组件
│   │   └── NotesDisplay.tsx # 备忘录显示组件
│   ├── data/          # 数据存储
│   └── types.ts       # 类型定义
└── next.config.ts     # Next.js配置
```

## 许可证

MIT

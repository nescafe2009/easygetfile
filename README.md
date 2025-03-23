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

## Docker 部署

本项目支持使用 Docker 进行部署，服务默认端口为 3001。

### 使用 Docker Compose 部署（推荐）

1. 确保已安装 Docker 和 Docker Compose
2. 克隆本仓库到本地
3. 在项目根目录下运行:

```bash
docker-compose up -d
```

4. 访问 http://localhost:3001 即可使用应用

### 手动构建和运行

1. 构建 Docker 镜像:

```bash
docker build -t easygetfile:latest .
```

2. 运行容器:

```bash
docker run -d -p 3001:3001 -v $(pwd)/data:/app/data -v $(pwd)/public/uploads:/app/public/uploads --name easygetfile easygetfile:latest
```

3. 访问 http://localhost:3001 使用应用

### 数据持久化

- 备忘录数据保存在 `./data` 目录中
- 上传的文件保存在 `./public/uploads` 目录中

这些目录通过 Docker 卷挂载到容器中，确保数据持久化。

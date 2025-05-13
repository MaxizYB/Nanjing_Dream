# 南京历史地图项目

## 项目简介

本项目是一个基于 Vue 3 和 Leaflet 的南京历史地图可视化项目，展示了从六朝到现代南京的历史变迁。项目采用组件化开发，实现了地图展示、时间线切换、地点标记等功能。

## 技术栈

- Vue 3 (Composition API)
- Vue Router
- Leaflet (地图库)
- Vite (构建工具)
- TailwindCSS (样式框架)

## 项目结构

```
├── src/                    # 源代码目录
│   ├── api/               # API 接口
│   ├── components/        # 通用组件
│   │   ├── MapView.vue    # 地图视图组件（核心组件）
│   │   ├── TimelineSwitcher.vue  # 时间线切换器
│   │   └── Sidebar.vue    # 侧边栏组件
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页
│   │   └── LocationDetail.vue  # 地点详情页
│   ├── router/            # 路由配置
│   ├── data/              # 数据文件
│   │   └── periods.js     # 历史时期配置
│   └── App.vue            # 根组件
├── assets/                # 静态资源
│   ├── images/            # 图片资源
│   │   ├── markers/       # 地图标记图标
│   │   └── locations/     # 地点图片
│   ├── maps/              # 地图瓦片
│   │   └── modern/        # 现代地图瓦片
│   │       └── tiles/     # 瓦片文件
│   ├── scripts/           # 脚本文件
│   │   └── markers/       # 标记点数据
│   ├── styles/            # 样式文件
│   └── libs/              # 第三方库
├── public/                # 公共资源
├── tiler/                 # 地图瓦片处理工具
└── index.html             # 入口 HTML
```

## 核心功能实现

### 1. 地图组件 (MapView.vue)

- 使用 Leaflet 实现地图展示
- 支持地图缩放和平移
- 自定义地图标记点
- 响应式更新地图内容
- 支持 URL 参数控制显示时期

### 2. 时间线切换器 (TimelineSwitcher.vue)

- 横向时间轴设计
- 支持点击切换历史时期
- 优雅的动画效果
- 响应式布局

### 3. 历史时期配置 (periods.js)

- 支持多个历史时期
- 每个时期包含：
  - 地图瓦片配置
  - 标记点数据
  - 时期名称

## 如何添加新的历史地点标记

### 1. 准备标记图标

在 `assets/images/markers` 目录下添加新的标记图标：

- 建议尺寸：32x32 像素
- 格式：PNG（支持透明背景）
- 命名规范：`marker-{时期}-{类型}.png`

### 2. 添加地点数据

在 `assets/scripts/markers` 目录下添加新的标记点数据：

```javascript
{
  name: '地点名称',
  position: [x, y],  // 地图坐标
  icon: '图标路径',
  description: '地点描述',
  link: '/location/详情页路径',
  type: '地点类型'
}
```

### 3. 地点类型说明

- `palace`: 宫殿建筑
- `temple`: 寺庙
- `gate`: 城门
- `street`: 街道
- `other`: 其他类型

### 4. 图片要求

- 地点图片应放在 `assets/images/locations` 目录下
- 建议尺寸：800x600 像素
- 格式：JPG 或 PNG
- 命名规范：`{地点名称}.jpg/png`

### 5. 地图瓦片要求

- 瓦片文件应放在 `assets/maps/{时期}/tiles` 目录下
- 瓦片命名格式：`{z}/{x}_{y}.png`
- 支持缩放级别：0-5
- 建议瓦片尺寸：256x256 像素

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 注意事项

1. 添加新的历史地点时，请确保坐标准确
2. 图片资源应进行适当压缩，以提高加载性能
3. 地点描述应简洁明了，突出历史价值
4. 建议为每个地点添加至少一张历史图片
5. 地图瓦片文件应放在对应时期的目录下，并按缩放级别分类存放
6. 修改地图配置时，注意更新 `periods.js` 中的相关配置

## 贡献指南

1. Fork 本仓库
2. 创建新的功能分支
3. 提交您的更改
4. 发起 Pull Request

## 许可证

MIT License

导航栏实现

1. 整体布局
左侧导航栏（可折叠，古典风格，黑色或深色为主，边框优雅简洁）
主内容区（地图展示区，右侧自适应）
2. 导航栏内容
顶部：网站Logo/图标（较大，古典风格，预留插槽）
时间线切换器（横向，支持拖动，时间点：隋唐五代、宋元、明、清、近代、新中国至今）
拖动时间线时，切换不同历史时期的地图（每个时期对应一套瓦片地图，预留接口，当前所有时间点都加载现有地图）
主页面跳转按钮（预留，后续可扩展）

## 操作指南

### 每个文件对应的作用

- assets

这里面都是一些资源文件，像是images下存放locations(页面首图)，markdown(markdown需要的图片)，markers(就是svg图标)；libs暂未用；maps下存放不同时期地图切片；markdown里面存放每个事件的介绍文件(命名格式要正确)；scripts存放脚本文件，marker里面的location存放不同地点的配置信息；markertemplate里面存放模板(只有图标的宏定义)

- src

这里面是页面的组件，components和views组成了全部页面，可以不用修改；data下面有个quizz，可以添加quizz

- tiler

切片工具

- package

项目依赖

## 目标

- 添加不同事件的详情页，包括：md文件，添加的md中的图片和页面首图，markers添加svg(如果需要)，location配置每个事件，最后quizz(选择性添加)

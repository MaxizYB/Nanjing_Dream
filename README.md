# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

导航栏实现

1. 整体布局
左侧导航栏（可折叠，古典风格，黑色或深色为主，边框优雅简洁）
主内容区（地图展示区，右侧自适应）
2. 导航栏内容
顶部：网站Logo/图标（较大，古典风格，预留插槽）
时间线切换器（横向，支持拖动，时间点：隋唐五代、宋元、明、清、民国、新中国至今）
拖动时间线时，切换不同历史时期的地图（每个时期对应一套瓦片地图，预留接口，当前所有时间点都加载现有地图）
主页面跳转按钮（预留，后续可扩展）

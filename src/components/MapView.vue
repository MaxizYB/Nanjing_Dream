<template>
  <div id="map" class="map-container"></div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getPeriodConfig } from '../data/periods'

const props = defineProps({
  period: {
    type: String,
    required: true
  }
})

const router = useRouter()
const route = useRoute()
const map = ref(null)
const tileLayer = ref(null)
const markers = ref([])

// 初始化地图
function initMap() {
  if (map.value) return

  map.value = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 5,
    zoomControl: true,
    scrollWheelZoom: true,
    center: [128, 128],  // 地图中心点
    zoom: 2,
    attributionControl: false,
    maxBounds: [[0, 0], [256, 256]],
    maxBoundsViscosity: 1.0
  })

  // 添加缩放控件
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map.value)

  // 设置地图视图范围
  const imageWidth = 256
  const imageHeight = 256
  const southWest = map.value.unproject([0, imageHeight], 0)
  const northEast = map.value.unproject([imageWidth, 0], 0)
  const bounds = new L.LatLngBounds(southWest, northEast)

  map.value.setMaxBounds(bounds)
  map.value.fitBounds(bounds)

  // 添加调试信息
  map.value.on('load', () => {
    console.log('地图加载完成')
    console.log('当前视图范围:', map.value.getBounds())
    console.log('当前缩放级别:', map.value.getZoom())
    console.log('当前中心点:', map.value.getCenter())
  })

  // 添加点击事件来获取坐标
  map.value.on('click', (e) => {
    console.log('点击位置坐标:', e.latlng)
  })
}

// 更新地图瓦片
function updateMapTiles(period) {
  console.log('更新地图瓦片，时期:', period)
  const config = getPeriodConfig(period)
  
  // 移除旧的瓦片图层
  if (tileLayer.value) {
    map.value.removeLayer(tileLayer.value)
  }

  // 添加新的瓦片图层
  tileLayer.value = L.tileLayer(config.mapTiles, {
    noWrap: true,
    attribution: '© Nanjing Map',
    tileSize: 256,
    maxNativeZoom: 5,
    minZoom: 0,
    maxZoom: 5,
    continuousWorld: false,
    updateWhenZooming: false
  })

  // 添加错误处理
  tileLayer.value.on('tileerror', (e) => {
    console.error('瓦片加载错误:', e)
    console.error('错误瓦片URL:', e.tile.src)
  })

  tileLayer.value.on('tileload', (e) => {
    console.log('瓦片加载成功:', e.tile.src)
  })

  tileLayer.value.addTo(map.value)
  
  // 确保地图居中显示
  setTimeout(() => {
    map.value.setView([128, 128], 2)
  }, 100)
}

// 清除所有标记点
function clearMarkers() {
  markers.value.forEach(marker => {
    map.value.removeLayer(marker)
  })
  markers.value = []
}

// 添加标记点
function addMarkers(period) {
  const config = getPeriodConfig(period)
  
  config.markers.forEach(markerData => {
    // 创建自定义图标
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-icon">
          <img src="${markerData.icon}" alt="${markerData.name}" />
          <div class="marker-label">${markerData.name}</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    })

    // 创建标记点
    const marker = L.marker(markerData.position, { icon })
      .addTo(map.value)
      .bindPopup(`
        <div class="marker-popup">
          <h3>${markerData.name}</h3>
          <p>${markerData.description}</p>
          <a href="${markerData.link}" class="marker-link">查看详情</a>
        </div>
      `)

    // 添加点击事件
    marker.on('click', () => {
      router.push(markerData.link)
    })

    markers.value.push(marker)
  })
}

// 更新地图内容
function updateMapContent(period) {
  console.log('更新地图内容，时期:', period)
  if (!map.value) {
    console.error('地图未初始化')
    return
  }
  clearMarkers()
  updateMapTiles(period)
  addMarkers(period)
}

// 监听时期变化
watch(() => props.period, (newPeriod) => {
  console.log('时期变化:', newPeriod)
  if (newPeriod) {
    updateMapContent(newPeriod)
  }
}, { immediate: true })

// 监听 URL 参数变化
watch(() => route.query.period, (newPeriod) => {
  console.log('URL 参数变化:', newPeriod)
  if (newPeriod && newPeriod !== props.period) {
    updateMapContent(newPeriod)
  }
})

onMounted(() => {
  console.log('组件挂载')
  initMap()
  // 如果 URL 中有时期参数，使用它来初始化地图
  const periodFromUrl = route.query.period
  if (periodFromUrl) {
    updateMapContent(periodFromUrl)
  }
})

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
  margin: 0;
  padding: 0;
}

/* 添加加载提示样式 */
.map-container::after {
  content: '地图加载中...';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 16px;
  z-index: 1;
}

:deep(.leaflet-container) {
  background-color: #000;
}

:deep(.custom-marker) {
  background: none;
  border: none;
}

:deep(.marker-icon) {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.marker-icon img) {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

:deep(.marker-label) {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: #fbfaf8;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  color: #634d0d;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #d6c9a5;
}

:deep(.marker-popup) {
  padding: 8px;
}

:deep(.marker-popup h3) {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

:deep(.marker-popup p) {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

:deep(.marker-link) {
  display: inline-block;
  padding: 4px 8px;
  background: #a08c5b;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 12px;
}

:deep(.marker-link:hover) {
  background: #8a7a4f;
}
</style>
<template>
  <div id="map" class="map-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const map = ref(null)
const markers = ref([
  { x: 500, y: 500, title: '南京大学' },
  { x: 600, y: 600, title: '玄武湖' },
  { x: 400, y: 400, title: '夫子庙' }
])

onMounted(() => {
  try {
    console.log('开始初始化地图...')

    // 初始化地图
    map.value = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 5,
      zoomControl: true,
      scrollWheelZoom: true, // 启用鼠标滚轮缩放
      center: [128, 128], // 调整中心点
      zoom: 0,
      attributionControl: false,
      maxBounds: [[0, 0], [256, 256]], // 调整边界框大小
      maxBoundsViscosity: 1.0
    })

    console.log('地图实例创建成功')

    // 设置地图视图范围
    const imageWidth = 256
    const imageHeight = 256
    const southWest = map.value.unproject([0, imageHeight], 0)
    const northEast = map.value.unproject([imageWidth, 0], 0)
    const bounds = new L.LatLngBounds(southWest, northEast)

    map.value.setMaxBounds(bounds)
    map.value.fitBounds(bounds)
    console.log('地图范围设置完成:', bounds)

    // 添加瓦片图层
    const tileLayer = L.tileLayer('../../assets/maps/tiles/{z}/{x}_{y}.png', {
      noWrap: true,
      attribution: '© Nanjing Map',
      tileSize: 256,
      maxNativeZoom: 7,
      minZoom: 0,
      maxZoom: 5,
      continuousWorld: false,
      updateWhenZooming: false
    })

    console.log('开始添加瓦片图层...')
    tileLayer.addTo(map.value)
    console.log('瓦片图层添加完成')

    // 添加标记点
    markers.value.forEach(marker => {
      const markerInstance = L.marker([marker.y, marker.x], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-icon"></div>`,
          iconSize: [20, 20]
        })
      })
      markerInstance.addTo(map.value)
      markerInstance.bindPopup(marker.title)
      console.log(`添加标记点: ${marker.title} 位置: [${marker.y}, ${marker.x}]`)
    })

    // 添加调试信息
    map.value.on('load', () => {
      console.log('地图加载完成')
      console.log('当前视图范围:', map.value.getBounds())
      console.log('当前缩放级别:', map.value.getZoom())
      console.log('当前中心点:', map.value.getCenter())
    })

    tileLayer.on('tileerror', (e) => {
      console.error('瓦片加载错误:', e)
      console.error('错误瓦片URL:', e.tile.src)
    })

    tileLayer.on('tileload', (e) => {
      console.log('瓦片加载成功:', e.tile.src)
    })

    // 添加地图事件监听
    map.value.on('click', (e) => {
      console.log('点击位置:', e.latlng)
    })

    // 添加缩放事件监听
    map.value.on('zoomend', () => {
      console.log('缩放级别变化:', map.value.getZoom())
    })

  } catch (error) {
    console.error('地图初始化错误:', error)
  }
})
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  position: relative;
  margin: 0;
  padding: 0;
}

.map-container::after {
  content: '地图加载中...';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 16px;
}

:deep(.custom-marker) {
  background-color: red;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

:deep(.marker-icon) {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: currentColor;
}
</style>
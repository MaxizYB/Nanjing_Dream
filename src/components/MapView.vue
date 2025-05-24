<template>
  <div id="map" class="map-container">
    <Teleport to="body">
      <div v-if="showDriftBottleSend" class="modal-overlay">
        <DriftBottleSend @close="showDriftBottleSend = false" @sent="handleBottleSent" />
      </div>
      <div v-if="showDriftBottleReceive" class="modal-overlay">
        <DriftBottleReceive @close="showDriftBottleReceive = false" />
      </div>
      <EggModal v-if="showEggModal" :egg="currentEgg" :collectedEggIds="collectedEggIds" @close="showEggModal = false" @collected="collectedEggIds.push($event)" />
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getPeriodConfig } from '../data/periods'
import { getMarkersByPeriod, storyMarkers } from '../assets/scripts/markers'
import DriftBottleSend from './DriftBottleSend.vue'
import DriftBottleReceive from './DriftBottleReceive.vue'
import { useToast } from 'vue-toastification'
import { eggMarkers } from '../assets/scripts/markers/eggMarkers'
import axios from 'axios'
import EggModal from './EggModal.vue'
import { BASE_URL } from '@/api'

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

// 标记点管理
const markerLayer = ref(null)

const showDriftBottleSend = ref(false)
const showDriftBottleReceive = ref(false)
const toast = useToast()

const receiveMarkerRef = ref(null)
let receiveMarkerRefreshTimer = null

// 彩蛋弹窗相关
const showEggModal = ref(false)
const currentEgg = ref(null)
const collectedEggIds = ref([])
const visibleEggIds = ref([]) // 当前可见彩蛋id
let eggTimer = null

// 初始化地图
function initMap() {
  if (map.value) return

  map.value = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 5,
    zoomControl: true,
    scrollWheelZoom: true,
    center: [128, 128],
    zoom: 2,
    attributionControl: false,
    maxBounds: [[0, 0], [256, 256]],
    maxBoundsViscosity: 1.0
  })

  // 创建标记点图层组
  markerLayer.value = L.layerGroup().addTo(map.value)

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

  tileLayer.value.addTo(map.value)
  
  // 确保地图居中显示
  setTimeout(() => {
    map.value.setView([128, 128], 2)
  }, 100)
}

// 清除所有标记点
function clearMarkers() {
  if (!map.value || !markerLayer.value) return
  console.log('清除所有标记点')
  
  // 清除所有标记点和定时器
  markers.value.forEach(({ marker, interval }) => {
    if (interval) {
      clearInterval(interval)
    }
    if (marker) {
      marker.remove()
    }
  })
  
  markerLayer.value.clearLayers()
  markers.value = []
}

// 清理地图
function cleanupMap() {
  if (!map.value) return
  console.log('清理地图')
  
  // 清除标记点
  clearMarkers()
  
  // 移除瓦片图层
  if (tileLayer.value) {
    if (map.value.hasLayer(tileLayer.value)) {
      map.value.removeLayer(tileLayer.value)
    }
    tileLayer.value = null
  }
}

// 添加漂流瓶标记点
function addDriftBottleMarkers() {
  if (!map.value || !markerLayer.value) return

  // 添加发送漂流瓶标记点
  const sendMarker = L.marker(
    map.value.unproject([50, 47], 0),
    { 
      icon: L.divIcon({
        className: 'drift-bottle-send-marker',
        html: `
          <div class="marker-icon">
            <img src="/assets/images/markers/letter.svg" alt="写信" />
            <div class="marker-label">写信</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      })
    }
  ).on('click', () => {
    showDriftBottleSend.value = true
  })
  sendMarker.addTo(markerLayer.value)

  // 添加接收漂流瓶标记点（点击后不消失，始终存在）
  const receiveMarker = L.marker(
    map.value.unproject([34, 57], 0),
    { 
      icon: L.divIcon({
        className: 'drift-bottle-receive-marker',
        html: `
          <div class="marker-icon">
            <img src="/assets/images/markers/bottle.svg" alt="漂流瓶" />
            <div class="marker-label">漂流瓶</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      })
    }
  ).on('click', () => {
    showDriftBottleReceive.value = false; // 先关闭，确保每次都能重新加载
    nextTick(() => {
      showDriftBottleReceive.value = true
    })
  })
  receiveMarker.addTo(markerLayer.value)
}

// 添加剧情标记点
function addStoryMarkers(period) {
  if (!map.value || !markerLayer.value) return
  storyMarkers.filter(story => story.period === period).forEach(story => {
    const marker = L.marker(
      map.value.unproject(story.position, 0),
      {
        icon: L.divIcon({
          className: 'story-marker',
          html: `
            <div class="marker-icon">
              <img src="/assets/images/markers/${story.icon}" alt="剧情点" />
              <div class="marker-label">${story.name}</div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        })
      }
    ).on('click', () => {
      router.push(`/story/${story.id}`)
    })
    marker.addTo(markerLayer.value)
  })
}

// 查询已收集彩蛋
async function fetchCollectedEggs() {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const userId = payload.userId || payload.id
    const { data } = await axios.get(`${BASE_URL}/api/achievement/eggs?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    collectedEggIds.value = data.eggs.map(e => e.egg_id)
  } catch {}
}

// 收集彩蛋
async function collectEgg(eggId) {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const userId = payload.userId || payload.id
    await axios.post(`${BASE_URL}/api/achievement/collect-egg`, {
      user_id: userId,
      egg_id: eggId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    collectedEggIds.value.push(eggId)
  } catch {}
}

// 访问彩蛋
async function visitEgg(eggId) {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const userId = payload.userId || payload.id
    if (!userId) return
    await axios.post(`${BASE_URL}/api/achievement/visit-egg`, {
      user_id: userId,
      egg_id: eggId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('访问彩蛋统计已上报', eggId)
  } catch (e) {
    console.error('访问彩蛋统计失败', e)
  }
}

function getNextRefreshDelay(intervalMinutes = 5) {
  const now = new Date()
  const ms = now.getMinutes() * 60 * 1000 + now.getSeconds() * 1000 + now.getMilliseconds()
  const intervalMs = intervalMinutes * 60 * 1000
  const next = Math.ceil(ms / intervalMs) * intervalMs
  return next - ms
}

function refreshEggByTime() {
  const candidates = eggMarkers.filter(e => e.period === props.period)
  if (candidates.length > 0) {
    const randomEgg = candidates[Math.floor(Math.random() * candidates.length)]
    visibleEggIds.value = [randomEgg.id]
  } else {
    visibleEggIds.value = []
  }
}

function startEggAbsoluteTimer() {
  if (eggTimer) clearTimeout(eggTimer)
  function scheduleNext() {
    refreshEggByTime()
    const delay = getNextRefreshDelay(0.5) // 5分钟为例
    eggTimer = setTimeout(scheduleNext, delay)
  }
  scheduleNext()
}

// 添加标记点
function addMarkers(period) {
  console.log('添加标记点，时期:', period)
  if (!map.value || !markerLayer.value) return
  
  // 确保先清理现有标记点
  clearMarkers()
  
  const markers = getMarkersByPeriod(period)
  console.log('当前时期标记点数量:', markers.length)
  
  markers.forEach(markerData => {
    const periodInfo = markerData.periods[period]
    if (!periodInfo) {
      console.log(`标记点 ${markerData.name} 在时期 ${period} 不存在`)
      return
    }

    console.log(`添加标记点 ${markerData.name} 在时期 ${period}`)

    try {
      // 创建自定义图标
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-icon">
            <img src="/assets/images/markers/${periodInfo.icon}" alt="${markerData.name}" />
            <div class="marker-label">${markerData.name}</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      })

      // 创建标记点
      const marker = L.marker(
        map.value.unproject(periodInfo.position, 0),
        { icon }
      ).bindPopup(`
        <div class="marker-popup">
          <h3>${markerData.name}</h3>
          <p>${periodInfo.description}</p>
          <a href="/location/${markerData.id}/${period}" class="marker-link">查看详情</a>
        </div>
      `)

      // 添加点击事件
      marker.on('click', () => {
        router.push(`/location/${markerData.id}/${period}`)
      })

      // 将标记点添加到图层组
      marker.addTo(markerLayer.value)
      markers.value.push({ marker })
    } catch (error) {
      console.error(`添加标记点 ${markerData.name} 时出错:`, error)
    }
  })

  // 添加漂流瓶标记点
  addDriftBottleMarkers()
  // 添加剧情标记点
  addStoryMarkers(period)
  // 添加彩蛋标记点
  addEggMarkers()
}

// 更新地图内容
function updateMapContent(period) {
  console.log('更新地图内容，时期:', period)
  if (!map.value) {
    console.error('地图未初始化')
    return
  }
  
  // 先清理现有内容
  cleanupMap()

  try {
    // 重新添加瓦片图层
    const config = getPeriodConfig(period)
    if (!config) {
      console.error('未找到时期配置:', period)
      return
    }

    console.log('添加地图瓦片:', config.mapTiles)
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

    tileLayer.value.addTo(map.value)
    
    // 添加标记点
    addMarkers(period)

    // 确保地图视图正确
    setTimeout(() => {
      map.value.setView([128, 128], 2)
    }, 100)
  } catch (error) {
    console.error('更新地图内容时出错:', error)
  }
}

// 监听 props.period 变化
watch(() => props.period, (newPeriod, oldPeriod) => {
  console.log('props时期变化:', newPeriod, '旧时期:', oldPeriod)
  if (newPeriod && newPeriod !== oldPeriod) {
    // 确保在下一个事件循环中更新地图内容
    nextTick(() => {
      updateMapContent(newPeriod)
    })
  }
}, { immediate: true })

// 监听路由变化
watch(() => route.path, (newPath, oldPath) => {
  console.log('路由路径变化:', newPath, '旧路径:', oldPath)
  if (newPath === '/map') {
    const periodFromUrl = route.query.period || 'modern'
    console.log('检测到地图路由，时期:', periodFromUrl)
    // 确保地图和标记点被正确清理和重新加载
    nextTick(() => {
      updateMapContent(periodFromUrl)
    })
  }
}, { immediate: true })

onMounted(() => {
  console.log('组件挂载')
  initMap()
  // 使用 props.period 初始化地图
  console.log('初始化地图，时期:', props.period)
  updateMapContent(props.period)
  startEggAbsoluteTimer()
})

// 组件卸载时清理
onBeforeUnmount(() => {
  cleanupMap()
  if (markerLayer.value) {
    markerLayer.value.clearLayers()
    markerLayer.value = null
  }
  if (map.value) {
    map.value.remove()
    map.value = null
  }
  if (receiveMarkerRefreshTimer) {
    clearInterval(receiveMarkerRefreshTimer)
    receiveMarkerRefreshTimer = null
  }
  if (eggTimer) clearTimeout(eggTimer)
})

function addEggMarkers() {
  if (!map.value || !markerLayer.value) return
  eggMarkers.filter(egg => egg.period === props.period && visibleEggIds.value.includes(egg.id)).forEach(egg => {
    const marker = L.marker(
      map.value.unproject(egg.position, 0),
      {
        icon: L.divIcon({
          className: 'egg-marker',
          html: `
            <div class=\"marker-icon\">
              <img src=\"/assets/images/markers/${egg.icon}\" alt=\"彩蛋\" />
              <div class=\"marker-label\">${egg.name}</div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        })
      }
    ).on('click', async () => {
      currentEgg.value = egg
      showEggModal.value = true
      visibleEggIds.value = [] // 点击后立即移除彩蛋
      await collectEgg(egg.id)
      await visitEgg(egg.id)
    })
    marker.addTo(markerLayer.value)
  })
}
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

:deep(.drift-bottle-send-marker),
:deep(.drift-bottle-receive-marker) {
  background: none;
  border: none;
}

:deep(.drift-bottle-send-marker .marker-icon),
:deep(.drift-bottle-receive-marker .marker-icon) {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.drift-bottle-send-marker .marker-icon img),
:deep(.drift-bottle-receive-marker .marker-icon img) {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

:deep(.drift-bottle-send-marker .marker-label),
:deep(.drift-bottle-receive-marker .marker-label) {
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

.egg-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.egg-modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
}

.egg-img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
  margin-bottom: 16px;
}

.collect-btn {
  background-color: #a08c5b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
}

.collected-tip {
  margin-top: 16px;
  color: #666;
}

.close-btn {
  background-color: #a08c5b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
}
</style>
import { getMarkersByPeriod } from '../assets/scripts/markers'

// 时期配置数据
export const periodConfigs = {
    'sui-tang': {
        name: '隋唐五代',
        mapTiles: '/assets/maps/tiles/{z}/{x}_{y}.png'
    },
    'song-yuan': {
        name: '宋元',
        mapTiles: '/assets/maps/tiles/{z}/{x}_{y}.png'
    },
    'ming': {
        name: '明',
        mapTiles: '/assets/maps/tiles/{z}/{x}_{y}.png'
    },
    'qing': {
        name: '清',
        mapTiles: '/assets/maps/tiles/{z}/{x}_{y}.png'
    },
    'jindai': {
        name: '近代',
        mapTiles: '/assets/maps/tiles/{z}/{x}_{y}.png'
    },
    'modern': {
        name: '现代',
        mapTiles: '/assets/maps/tiles/{z}/{x}_{y}.png'
    }
}

// 获取指定时期的配置
export function getPeriodConfig(period) {
    const config = periodConfigs[period] || periodConfigs.modern
    return {
        ...config,
        markers: getMarkersByPeriod(period)
    }
}

// 获取所有时期列表
export const periods = Object.keys(periodConfigs).map(key => ({
    key,
    name: periodConfigs[key].name
})) 
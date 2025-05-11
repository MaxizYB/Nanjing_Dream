import { allMarkers } from '../../assets/scripts/markers'

// 时期配置数据
export const periodConfigs = {
    'sui-tang': {
        name: '隋唐五代',
        mapTiles: '../../assets/maps/modern/tiles/{z}/{x}_{y}.png',
        markers: allMarkers['sui-tang']
    },
    'song-yuan': {
        name: '宋元',
        mapTiles: '../../assets/maps/modern/tiles/{z}/{x}_{y}.png',
        markers: allMarkers['song-yuan']
    },
    'ming': {
        name: '明',
        mapTiles: '../../assets/maps/modern/tiles/{z}/{x}_{y}.png',
        markers: allMarkers['ming']
    },
    'qing': {
        name: '清',
        mapTiles: '../../assets/maps/modern/tiles/{z}/{x}_{y}.png',
        markers: allMarkers['qing']
    },
    'minguo': {
        name: '民国',
        mapTiles: '../../assets/maps/modern/tiles/{z}/{x}_{y}.png',
        markers: allMarkers['minguo']
    },
    'modern': {
        name: '现代',
        mapTiles: '../../assets/maps/modern/tiles/{z}/{x}_{y}.png',
        markers: allMarkers['modern']
    }
}

// 获取指定时期的配置
export function getPeriodConfig(period) {
    return periodConfigs[period] || periodConfigs.modern
}

// 获取所有时期列表
export const periods = Object.keys(periodConfigs).map(key => ({
    key,
    name: periodConfigs[key].name
})) 
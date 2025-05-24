import { locationMarkers } from './locations'
import { storyMarkers } from './storyMarkers'

// 根据时期筛选标记点
export const getMarkersByPeriod = (period) => {
    console.log('筛选时期标记点:', period)
    const filteredMarkers = locationMarkers.filter(marker => {
        const hasPeriod = marker.periods[period] !== undefined
        console.log(`标记点 ${marker.name} 在时期 ${period} 存在:`, hasPeriod)
        return hasPeriod
    })
    console.log(`时期 ${period} 的标记点数量:`, filteredMarkers.length)
    return filteredMarkers
}

// 获取所有时期
export const getAllPeriods = () => {
    const periods = new Set()
    locationMarkers.forEach(marker => {
        Object.keys(marker.periods).forEach(period => periods.add(period))
    })
    return Array.from(periods)
}

// 获取特定地点的所有时期信息
export const getLocationPeriods = (locationId) => {
    const location = locationMarkers.find(marker => marker.id === locationId)
    return location ? Object.keys(location.periods) : []
}

// 获取特定地点在特定时期的信息
export const getLocationPeriodInfo = (locationId, period) => {
    const location = locationMarkers.find(marker => marker.id === locationId)
    return location ? location.periods[period] : null
}

export { storyMarkers } 
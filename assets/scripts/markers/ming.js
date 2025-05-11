import { createMarker, MarkerType, MarkerIcons } from '../markerTemplate'

export const mingMarkers = [
    createMarker({
        id: '1',
        name: '明城墙',
        position: [128, 128],
        icon: MarkerIcons[MarkerType.WALL],
        description: '明代南京城墙',
        period: 'ming'
    })
    // 可以继续添加更多标记点
] 
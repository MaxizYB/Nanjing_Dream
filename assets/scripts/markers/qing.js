import { createMarker, MarkerType, MarkerIcons } from '../markerTemplate'

export const qingMarkers = [
    createMarker({
        id: '1',
        name: '江宁织造府',
        position: [128, 128],
        icon: MarkerIcons[MarkerType.GOVERNMENT],
        description: '清代江宁织造府遗址',
        period: 'qing'
    })
    // 可以继续添加更多标记点
] 
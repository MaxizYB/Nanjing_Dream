import { createMarker, MarkerType, MarkerIcons } from '../markerTemplate'

export const minguoMarkers = [
    createMarker({
        id: '1',
        name: '总统府',
        position: [128, 128],
        icon: MarkerIcons[MarkerType.GOVERNMENT],
        description: '民国时期总统府',
        period: 'minguo'
    })
    // 可以继续添加更多标记点
] 
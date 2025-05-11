import { createMarker, MarkerType, MarkerIcons } from '../markerTemplate'

export const modernMarkers = [
    createMarker({
        id: '1',
        name: '南京大学',
        position: [-128, 128],
        icon: MarkerIcons[MarkerType.UNIVERSITY],
        description: '南京大学鼓楼校区',
        period: 'modern'
    }),
    // 可以继续添加更多标记点
    createMarker({
        id: '2',
        name: '东南大学',
        position: [-128, 150],
        icon: MarkerIcons[MarkerType.UNIVERSITY],
        description: '东南大学四牌楼校区',
        period: 'modern'
    })
] 
import { createMarker, MarkerType, MarkerIcons } from '../markerTemplate'

export const suiTangMarkers = [
    createMarker({
        id: '1',
        name: '石头城',
        position: [128, 128],
        icon: MarkerIcons[MarkerType.HISTORICAL_SITE],
        description: '六朝时期的重要军事要塞',
        period: 'sui-tang'
    })
    // 可以继续添加更多标记点
] 
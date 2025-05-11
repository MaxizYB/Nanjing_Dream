import { createMarker, MarkerType, MarkerIcons } from '../markerTemplate'

export const songYuanMarkers = [
    createMarker({
        id: '1',
        name: '夫子庙',
        position: [128, 128],
        icon: MarkerIcons[MarkerType.TEMPLE],
        description: '始建于宋代的文庙',
        period: 'song-yuan'
    })
    // 可以继续添加更多标记点
] 
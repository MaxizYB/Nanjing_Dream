import { MarkerType, MarkerIcons } from '../markerTemplate'

export const locationMarkers = [
    {
        id: 'mingxiaoling',
        name: '明孝陵',
        type: MarkerType.PALACE,
        periods: {
            'ming': {
                position: [182, 109],
                icon: MarkerIcons[MarkerType.PALACE],
                description: () => import('../../markdown/locations/mingxiaoling-ming.md?raw'),
                images: ['/assets/images/locations/mingxiaoling-ming.jpg']
            },
            'qing': {
                position: [182, 109],
                icon: MarkerIcons[MarkerType.PALACE],
                description: () => import('../../markdown/locations/mingxiaoling-qing.md?raw'),
                images: ['/assets/images/locations/mingxiaoling-qing.jpg']
            },
            'modern': {
                position: [182, 109],
                icon: MarkerIcons[MarkerType.PALACE],
                description: () => import('../../markdown/locations/mingxiaoling-modern.md?raw'),
                images: ['/assets/images/locations/mingxiaoling-modern.jpg']
            }
        }
    },

    // 可以继续添加更多地点...
] 
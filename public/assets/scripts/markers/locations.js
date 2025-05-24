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
    {
        id: 'shangxinting',
        name: '赏心亭',
        type: MarkerType.TOWER,
        periods: {
            'song-yuan': {
                position: [88, 162],
                icon: MarkerIcons[MarkerType.TOWER],
                description: () => import('../../markdown/locations/shangxinting-songyuan.md?raw'),
                images: ['assets/images/locations/shangxinting-song-yuan.jpg']
            }
        }
    },
    {
        id: 'nanjingdaxue',
        name: '南京大学',
        type: MarkerType.UNIVERSITY,
        periods: {
            'modern': {
                position: [104, 120],
                icon: MarkerIcons[MarkerType.UNIVERSITY],
                // description: () => import('../../markdown/locations/nanjingdaxue-modern.md?raw'),
                // images: ['/assets/images/locations/nanjingdaxue-modern.jpg']
            }
        }
    },
    {
        id: 'beijige',
        name: '北极阁',
        type: MarkerType.SPECIAL,
        periods: {
            'modern': {
                position: [118, 112],
                icon: MarkerIcons[MarkerType.SPECIAL],
                // description: () => import('../../markdown/locations/beijige-modern.md?raw'),
                // images: ['/assets/images/locations/beijige-modern.jpg']
            }
        }
    },
    {
        id: 'yuhuatai',
        name: '雨花台',
        type: MarkerType.SPECIAL,
        periods: {
            'modern': {
                position: [104, 210],
                icon: MarkerIcons[MarkerType.SPECIAL],
            }
        }
    },
    {
        id: 'hongmiao',
        name: '红庙',
        type: MarkerType.SPECIAL,
        periods: {
            'modern': {
                position: [116, 130],
                icon: MarkerIcons[MarkerType.SPECIAL],
            }
        }
    },
    {
        id: 'xinjiekou',
        name: '新街口',
        type: MarkerType.SPECIAL,
        periods: {
            'modern': {
                position: [108, 140],
                icon: MarkerIcons[MarkerType.SPECIAL],
            }
        }
    },
    {
        id: 'zhongshanmatou',
        name: '中山码头',
        type: MarkerType.PORT,
        periods: {
            'modern': {
                position: [43, 68],
                icon: MarkerIcons[MarkerType.PORT],
                description: () => import('../../markdown/locations/zhongshanmatou-modern.md?raw'),
                images: ['/assets/images/locations/zhongshanmatou-modern.jpg']
            }
        }
    },
    {
        id: 'nanjingaolinpike',
        name: '奥体中心',
        type: MarkerType.SPECIAL,
        periods: {
            'modern': {
                position: [33, 191],
                icon: MarkerIcons[MarkerType.SPECIAL],
                // description: () => import('../../markdown/locations/nanjingaolinpike-modern.md?raw'),
                // images: ['/assets/images/locations/nanjingaolinpike-modern.jpg']
            }
        }
    },
    {
        id: 'zhongshanling',
        name: '中山陵',
        type: MarkerType.PALACE,
        periods: {
            'jindai': {
                position: [192, 107],
                icon: MarkerIcons[MarkerType.PALACE],
                description: () => import('../../markdown/locations/zhongshanling-jindai.md?raw'),
                //images: ['/assets/images/locations/zhongshanling-jindai.jpg']
            },
            'modern': {
                position: [192, 107],
                icon: MarkerIcons[MarkerType.PALACE],
                description: () => import('../../markdown/locations/zhongshanling-modern.md?raw'),
                images: ['/assets/images/locations/zhongshanling-modern.jpg']
            }
        }
    },
    {
        id: 'zhonghuamen',
        name: '中华门',
        type: MarkerType.WALL,
        periods: {
            'ming': {
                position: [106, 184],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/zhonghuamen-ming.md?raw'),
                //images: ['/assets/images/locations/zhonghuamen-ming.jpg']
            },
            'qing': {
                position: [106, 184],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/zhonghuamen-qing.md?raw'),
                //images: ['/assets/images/locations/zhonghuamen-qing.jpg']
            },
            'jindai': {
                position: [106, 184],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/zhonghuamen-jindai.md?raw'),
                //images: ['/assets/images/locations/zhonghuamen-jindai.jpg']
            },
            'modern': {
                position: [106, 184],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/zhonghuamen-modern.md?raw'),
                images: ['/assets/images/locations/zhonghuamen-modern.jpg']
            }
        }
    },
    {
        id: 'zhanyuan',
        name: '瞻园',
        type: MarkerType.GARDEN,
        periods: {
            'ming': {
                position: [106, 178],
                icon: MarkerIcons[MarkerType.GARDEN],
                description: () => import('../../markdown/locations/zhanyuan-ming.md?raw'),
                //images: ['/assets/images/locations/zhonghuamen-ming.jpg']
            },
            'qing': {
                position: [106, 178],
                icon: MarkerIcons[MarkerType.GARDEN],
                description: () => import('../../markdown/locations/zhanyuan-qing.md?raw'),
                //images: ['/assets/images/locations/zhonghuamen-qing.jpg']
            },
            'jindai': {
                position: [106, 178],
                icon: MarkerIcons[MarkerType.GARDEN],
                description: () => import('../../markdown/locations/zhanyuan-jindai.md?raw'),
                //images: ['/assets/images/locations/zhonghuamen-jindai.jpg']
            },
            'modern': {
                position: [106, 178],
                icon: MarkerIcons[MarkerType.GARDEN],
                description: () => import('../../markdown/locations/zhanyuan-modern.md?raw'),
                images: ['/assets/images/locations/zhanyuan-modern.jpg']
            }
        }
    },
    {
        id: 'nanjingchangjiangdaqiao',
        name: '南京长江大桥',
        type: MarkerType.BRIDGE,
        periods: {
            'modern': {
                position: [63, 32],
                icon: MarkerIcons[MarkerType.BRIDGE],
                description: () => import('../../markdown/locations/nanjingchangjiangdaqiao-modern.md?raw'),
                images: ['/assets/images/locations/nanjingchangjiangdaqiao-modern.jpg']
            }
        }
    },
    {
        id: 'nanyangquanyehui',
        name: '南洋劝业会',
        type: MarkerType.SCROLL,
        periods: {
            'qing': {
                position: [109, 114],
                icon: MarkerIcons[MarkerType.SCROLL],
                description: () => import('../../markdown/locations/nanyangquanyehui-qing.md?raw'),
                images: ['/assets/images/locations/nanyangquanyehui-qing.jpg']
            }
        }
    },
    {
        id: 'nanjingtiaoyue',
        name: '南京条约',
        type: MarkerType.SCROLL,
        periods: {
            'qing': {
                position: [55, 40],
                icon: MarkerIcons[MarkerType.SCROLL],
                description: () => import('../../markdown/locations/nanjingtiaoyue-qing.md?raw'),
                images: ['/assets/images/locations/nanjingtiaoyue-qing.jpg']
            }
        }
    },
    {
        id: 'taipingtianguo',
        name: '太平天国',
        type: MarkerType.SCROLL,
        periods: {
            'qing': {
                position: [134, 124],
                icon: MarkerIcons[MarkerType.SCROLL],
                description: () => import('../../markdown/locations/taipingtianguo-qing.md?raw'),
                images: ['/assets/images/locations/taipingtianguo-qing.jpg']
            }
        }
    },
    {
        id: 'datushajinianguan',
        name: '南京大屠杀遇难同胞纪念馆',
        type: MarkerType.MUSEUM,
        periods: {
            'modern': {
                position: [52, 155],
                icon: MarkerIcons[MarkerType.MUSEUM],
                description: () => import('../../markdown/locations/datushajinianguan-modern.md?raw'),
                images: ['/assets/images/locations/datushajinianguan-modern.jpg']
            }
        }
    },
    {
        id: 'zhonghuaminguo',
        name: '总统府',
        type: MarkerType.GOVERNMENT,
        periods: {
            'jindai': {
                position: [125, 137],
                icon: MarkerIcons[MarkerType.GOVERNMENT],
                description: () => import('../../markdown/locations/zhonghuaminguo-jindai.md?raw'),
                images: ['/assets/images/locations/zhonghuaminguo-jindai.jpg']
            },
            'modern': {
                position: [125, 137],
                icon: MarkerIcons[MarkerType.GOVERNMENT],
                description: () => import('../../markdown/locations/zhonghuaminguo-modern.md?raw'),
                images: ['/assets/images/locations/zhonghuaminguo-modern.jpg']
            }
        }
    },
    {
        id: 'nanjingbowuyuan',
        name: '南京博物院',
        type: MarkerType.MUSEUM,
        periods: {
            'modern': {
                position: [165, 142],
                icon: MarkerIcons[MarkerType.MUSEUM],
                description: () => import('../../markdown/locations/nanjingbowuyuan-modern.md?raw'),
                images: ['/assets/images/locations/nanjingbowuyuan-modern.jpg']
            }
        }
    },
    {
        id: 'dujiangshengli',
        name: '渡江胜利纪念馆',
        type: MarkerType.MUSEUM,
        periods: {
            'modern': {
                position: [38, 89],
                icon: MarkerIcons[MarkerType.MUSEUM],
                description: () => import('../../markdown/locations/dujiangshengli-modern.md?raw'),
                images: ['/assets/images/locations/dujiangshengli-modern.jpg']
            }
        }
    },
    {//石头城
        id: 'shitoucheng',
        name: '石头城',
        type: MarkerType.WALL,
        periods: {
            'sui-tang': {
                position: [65, 125],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/shitoucheng-sui-tang.md?raw'),
            },
            'song-yuan': {
                position: [65, 125],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/shitoucheng-song-yuan.md?raw'),
            },
            'ming': {
                position: [65, 125],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/shitoucheng-ming.md?raw'),
            },
            'qing': {
                position: [65, 125],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/shitoucheng-qing.md?raw'),
            },
            'jindai': {
                position: [65, 125],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/shitoucheng-jindai.md?raw'),
            },
            'modern': {
                position: [65, 125],
                icon: MarkerIcons[MarkerType.WALL],
                description: () => import('../../markdown/locations/shitoucheng-modern.md?raw'),
                images: ['/assets/images/locations/shitoucheng-modern.jpg']
            }
        }
    },
    {//雨花台：
        id: 'yuhuatai',
        name: '雨花台',
        type: MarkerType.PALACE,
        periods: {
            'jindai': {
                position: [105, 210],
                icon: MarkerIcons[MarkerType.PALACE],
                description: () => import('../../markdown/locations/yuhuatai-jindai.md?raw'),
            },
            'modern': {
                position: [105, 210],
                icon: MarkerIcons[MarkerType.PALACE],
                description: () => import('../../markdown/locations/yuhuatai-modern.md?raw'),
                images: ['/assets/images/locations/yuhuatai-modern.jpg']
            }
        }
    },
    {//玄武湖
        id: 'xuanwuhu',
        name: '玄武湖',
        type: MarkerType.OTHER,
        periods: {
            'sui-tang': {
                position: [130, 100],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/xuanwuhu-sui-tang.md?raw'),
            },
            'song-yuan': {
                position: [130, 100],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/xuanwuhu-song-yuan.md?raw'),
            },
            'ming': {
                position: [130, 100],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/xuanwuhu-ming.md?raw'),
            },
            'qing': {
                position: [130, 100],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/xuanwuhu-qing.md?raw'),
            },
            'jindai': {
                position: [130, 100],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/xuanwuhu-jindai.md?raw'),
            },
            'modern': {
                position: [130, 100],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/xuanwuhu-modern.md?raw'),
                images: ['/assets/images/locations/xuanwuhu-modern.jpg']
            }
        }
    },
    {//秦淮河
        id: 'qinhuaihe',
        name: '秦淮河',
        type: MarkerType.OTHER,
        periods: {
            'sui-tang': {
                position: [113, 180],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/qinhuaihe-sui-tang.md?raw'),
            },
            'song-yuan': {
                position: [113, 180],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/qinhuaihe-song-yuan.md?raw'),
            },
            'ming': {
                position: [113, 180],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/qinhuaihe-ming.md?raw'),
            },
            'qing': {
                position: [113, 180],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/qinhuaihe-qing.md?raw'),
            },
            'jindai': {
                position: [113, 180],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/qinhuaihe-jindai.md?raw'),
            },
            'modern': {
                position: [113, 180],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/qinhuaihe-modern.md?raw'),
                images: ['/assets/images/locations/qinhuaihe-modern.jpg']
            }
        }
    },
    {//紫金山
        id: 'zijinshan',
        name: '紫金山',
        type: MarkerType.MOUNTAIN,
        periods: {
            'sui-tang': {
                position: [189, 97],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/zijinshan-sui-tang.md?raw'),
            },
            'song-yuan': {
                position: [189, 97],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/zijinshan-song-yuan.md?raw'),
            },
            'ming': {
                position: [189, 97],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/zijinshan-ming.md?raw'),
            },
            'qing': {
                position: [189, 97],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/zijinshan-qing.md?raw'),
            },
            'jindai': {
                position: [189, 97],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/zijinshan-jindai.md?raw'),
            },
            'modern': {
                position: [189, 97],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/zijinshan-modern.md?raw'),
                images: ['/assets/images/locations/zijinshan-modern.jpg']
            }
        }
    },
    {//幕府山-燕子矶
        id: 'mufushan-yanziji',
        name: '幕燕滨江风貌区',
        type: MarkerType.MOUNTAIN,
        periods: {
            'sui-tang': {
                position: [115, 20],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/mufushan-yanziji-sui-tang.md?raw'),
            },
            'song-yuan': {
                position: [115, 20],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/mufushan-yanziji-song-yuan.md?raw'),
            },
            'ming': {
                position: [115, 20],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/mufushan-yanziji-ming.md?raw'),
            },
            'qing': {
                position: [115, 20],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/mufushan-yanziji-qing.md?raw'),
            },
            'jindai': {
                position: [115, 20],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/mufushan-yanziji-jindai.md?raw'),
            },
            'modern': {
                position: [115, 20],
                icon: MarkerIcons[MarkerType.MOUNTAIN],
                description: () => import('../../markdown/locations/mufushan-yanziji-modern.md?raw'),
                images: ['/assets/images/locations/mufushan-modern.jpg']
            }
        }
    },
    {//莫愁湖
        id: 'mochouhu',
        name: '莫愁湖',
        type: MarkerType.OTHER,
        periods: {
            'sui-tang': {
                position: [80, 150],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/mochouhu-sui-tang.md?raw'),
            },
            'song-yuan': {
                position: [80, 150],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/mochouhu-song-yuan.md?raw'),
            },
            'ming': {
                position: [80, 150],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/mochouhu-ming.md?raw'),
            },
            'qing': {
                position: [80, 150],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/mochouhu-qing.md?raw'),
            },
            'jindai': {
                position: [80, 150],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/mochouhu-jindai.md?raw'),
            },
            'modern': {
                position: [80, 150],
                icon: MarkerIcons[MarkerType.OTHER],
                description: () => import('../../markdown/locations/mochouhu-modern.md?raw'),
                images: ['/assets/images/locations/mochouhu-modern.jpg']
            }
        }
    }
    // 可以继续添加更多地点...
] 
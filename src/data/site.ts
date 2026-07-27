export const site = {
  name: '觀夕平台',
  fullName: '觀夕平台旅遊指南',
  domain: 'guanxipingtai.com',
  url: 'https://guanxipingtai.com',
  description:
    '觀夕平台完整旅遊指南，整理安平看夕陽的最佳時段、交通停車、現場玩法、海邊安全、附近美食、住宿與順遊行程。',
  address: '708 臺南市安平區漁濱路',
  coordinates: {
    latitude: 22.9901592,
    longitude: 120.1470983
  },
  maps: {
    place:
      'https://www.google.com/maps/place/%E8%A7%80%E5%A4%95%E5%B9%B3%E5%8F%B0/@22.9903446,120.1448117,17z/data=!4m7!3m6!1s0x346e7603ffffffff:0xd4dc6d7696b10aa2!8m2!3d22.9901592!4d120.1470983!15sCgzop4DlpJXlubPlj7CSARBvYnNlcnZhdGlvbl9kZWNr4AEA!16s%2Fg%2F11xb4xdg8?entry=tts&g_ep=EgoyMDI2MDcyMi4wIPu8ASoASAFQAw%3D%3D&skid=01023a89-ab2d-45e4-8270-31d267a12485',
    embed:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3672.9097874290733!2d120.1448117!3d22.9903446!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e7603ffffffff%3A0xd4dc6d7696b10aa2!2z6KeC5aSV5bmz5Y-w!5e0!3m2!1szh-CN!2stw!4v1785140613395!5m2!1szh-CN!2stw',
    driving:
      'https://www.google.com/maps/dir/?api=1&destination=22.9901592%2C120.1470983&travelmode=driving',
    transit:
      'https://www.google.com/maps/dir/?api=1&destination=22.9901592%2C120.1470983&travelmode=transit',
    walking:
      'https://www.google.com/maps/dir/?api=1&destination=22.9901592%2C120.1470983&travelmode=walking'
  }
} as const;

export const primaryNavigation = [
  { href: '/guide/', label: '現場怎麼玩' },
  { href: '/transport-parking/', label: '交通與停車' },
  { href: '/best-time/', label: '最佳時間' },
  { href: '/nearby/', label: '附近景點' },
  { href: '/food/', label: '周邊美食' },
  { href: '/faq/', label: '實用 FAQ' }
] as const;

export const allGuides = [
  { href: '/guide/', label: '現場怎麼玩', description: '散步、看夕陽與停留時間' },
  {
    href: '/transport-parking/',
    label: '交通與停車',
    description: '自駕、公車與日落後返程'
  },
  {
    href: '/history-highlights/',
    label: '歷史與看點',
    description: '安平港灣與海岸地景'
  },
  {
    href: '/best-time/',
    label: '最佳遊覽時間',
    description: '季節、天氣與光線'
  },
  {
    href: '/photography/',
    label: '拍照指南',
    description: '夕陽、剪影與手機構圖'
  },
  { href: '/family/', label: '親子指南', description: '玩沙、推車與安全準備' },
  { href: '/food/', label: '周邊美食', description: '老街小吃與晚餐區域' },
  { href: '/stay/', label: '住宿區域', description: '安平與市區住宿選擇' },
  { href: '/nearby/', label: '附近景點', description: '安平經典景點順遊' },
  { href: '/itinerary/', label: '行程建議', description: '半日、一日與無車路線' },
  { href: '/safety/', label: '海邊安全', description: '浪況、強風與夜間提醒' },
  { href: '/faq/', label: '實用 FAQ', description: '門票、設施與常見問題' }
] as const;

export const faqItems = [
  {
    question: '觀夕平台需要門票嗎？',
    answer:
      '一般戶外空間通常不需購票，但活動、交通或周邊設施可能另有規定。若行程包含安平其他景點，應分別查看票價資訊。'
  },
  {
    question: '觀夕平台幾點去最好？',
    answer:
      '一般旅客可在日落前 45–60 分鐘抵達；週末、自駕或想拍攝完整光線變化者，可再提早 20–30 分鐘。'
  },
  {
    question: '觀夕平台可以游泳或玩水嗎？',
    answer:
      '不建議游泳或深入涉水。這裡是自然海岸，不應視為有救生管理的海水浴場；請留意離岸流、突發浪況與現場警示。'
  },
  {
    question: '觀夕平台停車方便嗎？',
    answer:
      '周邊通常可找到停車空間，但夕陽時段、週末、連假與活動日可能較快滿位。建議提早抵達並依現場標示停車。'
  },
  {
    question: '公車可以到觀夕平台嗎？',
    answer:
      '可透過大台南公車或地圖大眾運輸查詢。班次、站位與活動改道可能調整，規劃時要先確認日落後的回程班次。'
  },
  {
    question: '觀夕平台適合帶小孩嗎？',
    answer:
      '適合散步、看海與在乾燥沙地玩沙，但成人需全程陪同，不讓孩子單獨靠近水邊。夏季注意曝曬與補水，冬季準備防風外層。'
  },
  {
    question: '觀夕平台建議停留多久？',
    answer:
      '單純散步與看夕陽約 60–90 分鐘；親子玩沙或攝影可預留約 2 小時，另加停車、步行與返程時間。'
  },
  {
    question: '日落後容易叫車嗎？',
    answer:
      '通常可以嘗試叫車，但熱門時段可能需要等待。建議在天黑前確認上車點與網路狀況，選擇照明清楚、車輛可安全停靠的位置。'
  }
] as const;

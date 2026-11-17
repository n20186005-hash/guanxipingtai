export const site = {
  name: '觀夕平台',
  officialName: '觀夕平臺',
  englishName: 'Guanxi Platform',
  fullName: '觀夕平台旅遊指南',
  domain: 'guanxipingtai.com',
  url: 'https://guanxipingtai.com',
  description:
    '觀夕平台（觀夕平臺）位於台南安平四草大橋南端，免費看海賞夕陽。查今日預估日落時間、漁濱路停車與公車、Google 地圖及安平附近景點。',
  placeType: '觀景台',
  address: '708 臺南市安平區漁濱路',
  addressParts: {
    street: '漁濱路',
    locality: '安平區',
    region: '臺南市',
    postalCode: '708',
    country: '臺灣',
    countryCode: 'TW'
  },
  plusCode: 'X4RW+3R 安平區 台灣臺南市',
  coordinates: {
    latitude: 22.9901592,
    longitude: 120.1470983
  },
  maps: {
    share: 'https://maps.app.goo.gl/TiT7uCv5GiquAeCk8',
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
  },
  landmarks: ['安平古堡與安平老街', '安平樹屋與德記洋行'],
  tourism: {
    tainan: 'https://www.twtainan.net/',
    tainanLabel: '臺南旅遊網',
    taiwan: 'https://www.taiwan.net.tw/',
    taiwanLabel: '交通部觀光署'
  },
  reviews: {
    source: 'Google 地圖（Google Maps）',
    sourceLabel: 'Google 地圖',
    rating: 4.4,
    ratingLabel: '4.4',
    count: 12458,
    countLabel: '12,458',
    syncedAt: '2026 年 11 月 17 日',
    note: '同步自 Google 地圖使用者評價，資料更新日期 2026 年 11 月 17 日；版權歸原作者與 Google 地圖所有。',
    inlineNote:
      '評分與評價數同步自 Google 地圖（Google Maps）使用者評價 · 更新於 2026 年 11 月 17 日 · 點擊查看 Google 地圖全部評價↗',
    cta: '在 Google 地圖查看全部評價'
  },
  rights: {
    photos: '本網站所展示的所有圖片產權及版權均歸原攝影者所有。'
  }
} as const;

export const primaryNavigation = [
  { href: '/guide/', label: '現場怎麼玩' },
  { href: '/transport-parking/', label: '交通與停車' },
  { href: '/best-time/', label: '最佳時間' },
  { href: '/sunset-time/', label: '日落時間' },
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
    href: '/sunset-time/',
    label: '日落時間表',
    description: '逐日日出、日落與方位'
  },
  {
    href: '/photography/',
    label: '拍照指南',
    description: '夕陽、剪影與手機構圖'
  },
  { href: '/family/', label: '親子指南', description: '玩沙、推車與安全準備' },
  { href: '/food/', label: '周邊美食', description: '老街小吃與晚餐區域' },
  { href: '/stay/', label: '住宿區域', description: '安平與市區住宿選擇' },
  {
    href: '/facilities/',
    label: '訪客服務與周邊設施',
    description: '洗手間、停車、餐飲與補給'
  },
  { href: '/nearby/', label: '附近景點', description: '安平經典景點順遊' },
  { href: '/anping-fort/', label: '安平古堡', description: '歷史城牆、瞭望台與古堡街' },
  { href: '/yizai-golden-fort/', label: '億載金城（二鯤鯓砲臺）', description: '清代海防砲臺、護城河與交通設施' },
  { href: '/four-bastion-fort/', label: '四稜郭', description: '億載金城的四角稜堡式防禦建築' },
  { href: '/yizai-park/', label: '億載公園', description: '白千層林蔭步道與散步休息' },
  { href: '/teyang-destroyer-ship-park/', label: '德陽艦園區', description: '退役驅逐艦與安平港軍事歷史' },
  { href: '/lin-moniang-park/', label: '林默娘公園', description: '媽祖雕像、港灣草地與 YouBike' },
  { href: '/historic-harborside-park/', label: '港濱歷史公園', description: '安平歷史主題、港灣綠地與散步' },
  { href: '/anping-harborside-playground/', label: '安平港濱歷史特色遊戲場', description: '港灣文化遊具與親子活動' },
  { href: '/big-fish-blessing/', label: '大魚的祝福', description: '魚形公共藝術與港景拍攝' },
  { href: '/anping-harbor-canal-cruise/', label: '安平遊港遊運河', description: '立驛國際港內與運河船遊資訊' },
  { href: '/yuguang-island/', label: '漁光島', description: '漁村沙洲、森林與月牙灣' },
  { href: '/yuguang-beach/', label: '漁光沙灘', description: '西岸海景、潮線與夕陽' },
  { href: '/yuguang-forest-trail/', label: '漁光森林步道', description: '防風林、林蔭與雨後倒影' },
  { href: '/crescent-bay/', label: '月牙灣', description: '弧形沙岸與黃昏海景' },
  { href: '/yuguang-park/', label: '漁光公園', description: '漁光島公共綠地與休息' },
  { href: '/yuguang-headphone-breakwater/', label: '漁光島巨人耳機防波堤', description: '岸線地景與安全遠眺' },
  { href: '/anping-south-breakwater-light/', label: '安平漁港南堤燈塔', description: '南側助航設施及港區管制' },
  { href: '/anping-north-breakwater-light/', label: '安平漁港北堤燈塔', description: '北側助航設施及港區管制' },
  { href: '/anping-harbor-breakwaters/', label: '安平港導流堤與小砲台', description: '港口工程、歷史線索與不同地圖點' },
  { href: '/qiumao-garden-belltower/', label: '秋茂園鐘樓', description: '海岸歷史地標與外觀觀察' },
  { href: '/yizai-yuguang-baseball-field/', label: '億載漁光棒球場', description: '運動場地位置與活動導航' },
  { href: '/taijiang-national-park/', label: '台江國家公園', description: '濕地、紅樹林及漁鹽文化' },
  { href: '/taijiang-visitor-center/', label: '台江遊客中心', description: '白色高腳屋、水景與生態展覽' },
  { href: '/taijiang-fishing-park/', label: '台江漁樂園', description: '四草管筏與漁業生態體驗' },
  { href: '/taijiang-mangrove-decks/', label: '紅樹林植物觀賞區', description: '環境教育平台與植物觀察' },
  { href: '/taijiang-north-loop/', label: '台江學園北環步道', description: '水域、植栽與慢走觀察' },
  { href: '/taijiang-academy/', label: '台江學園', description: '濕地教育與園區散步' },
  { href: '/sicao-green-tunnel/', label: '四草綠色隧道', description: '紅樹林管筏與袖珍版亞馬遜河' },
  { href: '/sicao-whale-exhibition/', label: '四草抹香鯨陳列館', description: '母子鯨標本與海洋教育' },
  { href: '/taijiang-ecocultural-area/', label: '台江生態文化園區', description: '濕地、鹽業與漁村文化' },
  { href: '/sicao-bamboo-wharf/', label: '竹筏港碼頭', description: '四草湖水道與傳統漁筏' },
  { href: '/sicao-dazhong-temple/', label: '四草大眾廟', description: '鎮海元帥與北汕尾海防歷史' },
  { href: '/sicao-lake/', label: '四草湖', description: '紅樹林、蚵棚與古台江內海' },
  { href: '/sicao-riverside-park/', label: '四草親水公園', description: '四草河岸休憩與安全散步' },
  { href: '/sicao-fishing-harbor/', label: '四草漁港', description: '鹿耳門溪口傳統作業漁港' },
  { href: '/sicao-fort-bridge/', label: '海堡橋遺跡', description: '荷蘭海堡碑記與歷史線索' },
  { href: '/sicao-dutch-fort/', label: '荷蘭海堡遺址', description: '北汕尾十七世紀海防記憶' },
  { href: '/sicao-wanlong-garden/', label: '萬龍園', description: '四草周邊位置與順遊導航' },
  { href: '/anping-tree-house/', label: '安平樹屋', description: '榕樹與舊倉庫共生地景' },
  { href: '/former-tait-merchant-house/', label: '德記洋行', description: '安平開港時期的洋行建築' },
  { href: '/sicao-bridge/', label: '四草大橋', description: '安平港橋梁與夕照' },
  { href: '/qiaotou-beach-park/', label: '橋頭海灘公園', description: '橋南端海岸步道與沙岸' },
  { href: '/anping-waterview-park/', label: '安平水景公園', description: '水景橋、港灣與歷史水路' },
  { href: '/blue-sea-pier/', label: '碧海碼頭', description: '安平漁港海景與休閒空間' },
  { href: '/itinerary/', label: '行程建議', description: '半日、一日與無車路線' },
  { href: '/safety/', label: '海邊安全', description: '浪況、強風與夜間提醒' },
  {
    href: '/coast-science/',
    label: '海岸科普與訪客責任',
    description: '潮汐、離岸流與生態'
  },
  { href: '/faq/', label: '實用 FAQ', description: '門票、設施與常見問題' }
] as const;

export const faqItems = [
  {
    question: '觀夕平台在哪裡？',
    answer:
      '觀夕平台（觀夕平臺）位於臺灣臺南市安平區漁濱路，就在安平港灣北側的海岸線上，郵遞區號 708，Plus Code 為 X4RW+3R，座標約 22.9901592, 120.1470983。'
  },
  {
    question: '觀夕平台的日落時間大概幾點？',
    answer:
      '每天都不一樣。以臺南安平來說，一年大約落在 17:15–18:45 之間：冬季最早（12 月至 1 月約 17:15–17:30），春秋約 18:00 前後，夏季最晚（6 月至 7 月約 18:40–18:45）。本站不寫死時間，首頁天氣模組會顯示今日日出、日落與未來七日的日落時間；需要官方數值時可查中央氣象署。'
  },
  {
    question: '觀夕平台和「觀汐平台」「關夕平台」是同一處嗎？',
    answer:
      '是。官方名稱是「觀夕平臺」，旅客常寫成「觀夕平台」，也有人因輸入法選字打成「觀汐平台」「關夕平台」。這些寫法指的都是臺南市安平區漁濱路同一段海岸的賞夕據點，Plus Code X4RW+3R、座標約 22.9901592, 120.1470983。'
  },
  {
    question: '觀夕平台需要門票嗎？',
    answer:
      '觀夕平台是免費開放的戶外海岸空間，一般不需購票；但活動、交通或周邊設施可能另有規定。若行程包含安平其他景點，應分別查看票價資訊。'
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
    question: '觀夕平台停車方便嗎？有停車場嗎？',
    answer:
      '周邊設有停車空間，但容量、收費方式與開放狀態可能調整；夕陽時段、週末、連假與活動日較快滿位。建議提早抵達，依現場標示停車，不佔用私人出入口或禁止區域。'
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

/**
 * 觀夕平台（臺南安平）太陽時刻計算。
 *
 * 採用 NOAA Solar Calculator 所使用的標準公式鏈：儒略日 → 太陽平黃經與平近點角 →
 * 視黃經 → 黃赤交角 → 太陽赤緯與時差方程式 → 時角 → 日出日落。
 * 只保留本站在建置期需要的精度，不處理大氣分層折射的逐時變化。
 *
 * 臺南安平位於 UTC+8，且臺灣自 1980 年起不實施日光節約時間，因此時區以固定位移處理。
 * 與中央氣象署公告值相比，誤差通常在 1 分鐘以內；地平線遮蔽（遠方建築、雲層、
 * 堤防）不在計算範圍內，實際可見日落會略早於表中數值。
 */

const DEG = Math.PI / 180;
const toRad = (value: number) => value * DEG;
const toDeg = (value: number) => value / DEG;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** 日出與日落的幾何定義：太陽中心位於地平線下 50 角分（大氣折射 34′ + 太陽視半徑 16′） */
const SUNRISE_ZENITH = 90.833;
/** 黃金時刻起點：太陽高度 +6° */
const GOLDEN_START_ZENITH = 84;
/** 藍調時刻終點：太陽高度 −6° */
const BLUE_END_ZENITH = 96;

export const SUN_SITE = {
  latitude: 22.9901592,
  longitude: 120.1470983,
  /** 當地時區相對 UTC 的固定位移（小時） */
  utcOffset: 8,
  timeZone: 'Asia/Taipei'
} as const;

export interface SunTimes {
  /** 當地日期，格式 YYYY-MM-DD */
  date: string;
  /** 距當地零時的分鐘數；極晝／極夜時為 null */
  sunrise: number | null;
  sunset: number | null;
  solarNoon: number;
  /** 太陽升到高度 +6°（傍晚黃金時刻起點） */
  goldenHour: number | null;
  /** 太陽降到高度 −6°（藍調時刻終點） */
  blueHourEnd: number | null;
  /** 日落方位角，自正北順時針（度） */
  sunsetAzimuth: number | null;
}

interface SolarPosition {
  declination: number;
  equationOfTime: number;
}

/** 由儒略日求太陽赤緯（度）與時差方程式（分鐘） */
const solarPosition = (julianDay: number): SolarPosition => {
  const t = (julianDay - 2451545) / 36525;

  const meanLongitude = 280.46646 + t * (36000.76983 + t * 0.0003032);
  const meanAnomaly = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);

  const m = toRad(meanAnomaly);
  const center =
    Math.sin(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * m) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * m) * 0.000289;

  const omega = 125.04 - 1934.136 * t;
  const apparentLongitude =
    meanLongitude + center - 0.00569 - 0.00478 * Math.sin(toRad(omega));

  const meanObliquity =
    23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const obliquity = meanObliquity + 0.00256 * Math.cos(toRad(omega));

  const declination = toDeg(
    Math.asin(Math.sin(toRad(obliquity)) * Math.sin(toRad(apparentLongitude)))
  );

  const y = Math.tan(toRad(obliquity / 2)) ** 2;
  const l0 = toRad(meanLongitude % 360);
  const equationOfTime =
    4 *
    toDeg(
      y * Math.sin(2 * l0) -
        2 * eccentricity * Math.sin(m) +
        4 * eccentricity * y * Math.sin(m) * Math.cos(2 * l0) -
        0.5 * y * y * Math.sin(4 * l0) -
        1.25 * eccentricity * eccentricity * Math.sin(2 * m)
    );

  return { declination, equationOfTime };
};

/** 太陽通過指定天頂角時的時角（度）；無法達到該高度時回傳 null */
const hourAngleAt = (zenith: number, latitude: number, declination: number): number | null => {
  const cosHourAngle =
    Math.cos(toRad(zenith)) / (Math.cos(toRad(latitude)) * Math.cos(toRad(declination))) -
    Math.tan(toRad(latitude)) * Math.tan(toRad(declination));

  if (cosHourAngle > 1 || cosHourAngle < -1) return null;
  return toDeg(Math.acos(cosHourAngle));
};

/** 由赤緯與天頂角求方位角（度，自正北向東量測，範圍 0–180） */
const azimuthFromNorth = (zenith: number, latitude: number, declination: number): number => {
  const altitude = toRad(90 - zenith);
  const cosAzimuth =
    (Math.sin(toRad(declination)) - Math.sin(toRad(latitude)) * Math.sin(altitude)) /
    (Math.cos(toRad(latitude)) * Math.cos(altitude));

  return toDeg(Math.acos(clamp(cosAzimuth, -1, 1)));
};

/**
 * 計算指定當地日期的太陽時刻。
 * @param year 西元年
 * @param monthIndex 月份索引，0 為一月
 * @param day 日
 */
export const getSunTimes = (year: number, monthIndex: number, day: number): SunTimes => {
  const { latitude, longitude, utcOffset } = SUN_SITE;

  // 以當地正午作為計算時刻，避免日期邊界造成的偏移
  const localNoonUtcMs = Date.UTC(year, monthIndex, day, 12 - utcOffset, 0, 0);
  const julianDay = localNoonUtcMs / 86400000 + 2440587.5;

  const { declination, equationOfTime } = solarPosition(julianDay);

  // 太陽通過子午線的 UTC 分鐘數，再換算為當地分鐘數
  const solarNoonUtc = 720 - 4 * longitude - equationOfTime;
  const offsetMinutes = utcOffset * 60;
  const toLocal = (utcMinutes: number) => {
    const minutes = utcMinutes + offsetMinutes;
    return ((minutes % 1440) + 1440) % 1440;
  };

  const dayAngles =
    hourAngleAt(SUNRISE_ZENITH, latitude, declination);

  const sunset = dayAngles === null ? null : toLocal(solarNoonUtc + 4 * dayAngles);
  const sunrise = dayAngles === null ? null : toLocal(solarNoonUtc - 4 * dayAngles);

  const goldenAngle = hourAngleAt(GOLDEN_START_ZENITH, latitude, declination);
  const blueAngle = hourAngleAt(BLUE_END_ZENITH, latitude, declination);

  const goldenHour = goldenAngle === null ? null : toLocal(solarNoonUtc + 4 * goldenAngle);
  const blueHourEnd = blueAngle === null ? null : toLocal(solarNoonUtc + 4 * blueAngle);

  const sunsetAzimuth =
    dayAngles === null
      ? null
      : (360 - azimuthFromNorth(SUNRISE_ZENITH, latitude, declination) + 360) % 360;

  return {
    date: `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    sunrise,
    sunset,
    solarNoon: toLocal(solarNoonUtc),
    goldenHour,
    blueHourEnd,
    sunsetAzimuth
  };
};

/** 由距零時的分鐘數輸出 HH:MM */
export const formatClock = (minutes: number | null): string => {
  if (minutes === null) return '—';
  const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const COMPASS = [
  '正北',
  '北北東',
  '東北',
  '東北東',
  '正東',
  '東南東',
  '東南',
  '南南東',
  '正南',
  '南南西',
  '西南',
  '西南西',
  '正西',
  '西北西',
  '西北',
  '北北西'
] as const;

/** 方位角轉 16 方位中文名稱 */
export const compassName = (azimuth: number | null): string => {
  if (azimuth === null) return '—';
  return COMPASS[Math.round((((azimuth % 360) + 360) % 360) / 22.5) % 16];
};

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'] as const;

/** 由 YYYY-MM-DD 取星期中文簡寫 */
export const weekdayLabel = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
};

/** 該月天數 */
export const daysInMonth = (year: number, monthIndex: number): number =>
  new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

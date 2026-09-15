const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const MARINE_API = 'https://marine-api.open-meteo.com/v1/marine';

const FORECAST_DAYS = 7;
const LOCATION_NAME = '觀夕平台';
const LATITUDE = '22.9901592';
const LONGITUDE = '120.1470983';

const weatherDescriptions = {
  0: ['晴朗', '☀️'],
  1: ['大致晴朗', '🌤️'],
  2: ['局部多雲', '⛅'],
  3: ['陰天', '☁️'],
  45: ['有霧', '🌫️'],
  48: ['霧淞', '🌫️'],
  51: ['細雨', '🌦️'],
  53: ['細雨', '🌦️'],
  55: ['較強細雨', '🌧️'],
  56: ['凍毛雨', '🌧️'],
  57: ['凍毛雨', '🌧️'],
  61: ['小雨', '🌦️'],
  63: ['中雨', '🌧️'],
  65: ['大雨', '🌧️'],
  66: ['凍雨', '🌧️'],
  67: ['凍雨', '🌧️'],
  71: ['小雪', '🌨️'],
  73: ['降雪', '🌨️'],
  75: ['大雪', '❄️'],
  77: ['霰', '🌨️'],
  80: ['短暫陣雨', '🌦️'],
  81: ['陣雨', '🌧️'],
  82: ['強陣雨', '⛈️'],
  85: ['陣雪', '🌨️'],
  86: ['強陣雪', '🌨️'],
  95: ['雷雨', '⛈️'],
  96: ['雷雨伴隨冰雹', '⛈️'],
  99: ['強雷雨伴隨冰雹', '⛈️']
};

const THUNDER_CODES = [95, 96, 99];
const HEAVY_RAIN_CODES = [63, 65, 81, 82];
const LIGHT_RAIN_CODES = [51, 53, 55, 56, 57, 61, 80];
const FOG_CODES = [45, 48];


// 蒲福風級上限（km/h），索引即風級
const BEAUFORT_LIMITS = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117];

function beaufortLevel(kmh) {
  if (typeof kmh !== 'number' || !Number.isFinite(kmh)) return 0;
  for (let level = 0; level < BEAUFORT_LIMITS.length; level += 1) {
    if (kmh <= BEAUFORT_LIMITS[level]) return level;
  }
  return 12;
}

function describeWeather(code, isDay = true) {
  const [condition, icon] = weatherDescriptions[code] ?? ['天氣變化', '🌤️'];
  if (!isDay && code <= 1) return [condition, '🌙'];
  return [condition, icon];
}

function requiredNumber(value, field) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid weather field: ${field}`);
  }
  return value;
}

function optionalNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function clockLabel(value) {
  return typeof value === 'string' && value.length >= 16 ? value.slice(11, 16) : null;
}

function dayLabel(date, index) {
  if (index === 0) return '今天';
  if (index === 1) return '明天';
  return new Intl.DateTimeFormat('zh-TW', {
    weekday: 'short',
    timeZone: 'Asia/Taipei'
  }).format(new Date(`${date}T00:00:00+08:00`));
}

function shortDate(date) {
  const [, month, day] = date.split('-');
  return `${Number(month)}/${Number(day)}`;
}

function windDirectionText(degrees) {
  if (typeof degrees !== 'number' || !Number.isFinite(degrees)) return null;
  const directions = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
  const index = Math.round(((degrees % 360) + 360) % 360 / 45) % 8;
  return directions[index];
}

function pushUnique(list, text) {
  if (!list.includes(text)) list.push(text);
}

// leisure 標記的建議屬於「推薦型」，天氣不佳時會被過濾
function pushPlan(list, text, leisure = false) {
  if (list.some((entry) => entry.text === text)) return;
  list.push({ text, leisure });
}

function taipeiNow() {
  return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 16);
}

// 潮汐：從逐時潮位推估滿潮／乾潮時刻、目前潮位與趨勢，並輸出未來 24 小時變化
function buildTide(times, heights) {
  if (!Array.isArray(times) || !Array.isArray(heights) || times.length < 24) return null;

  const now = taipeiNow();
  const points = [];
  const future = [];
  let current = null;
  let previous = null;

  for (let index = 0; index < times.length; index += 1) {
    const time = times[index];
    const value = heights[index];
    if (typeof time !== 'string' || typeof value !== 'number' || !Number.isFinite(value)) continue;

    if (time <= now) {
      previous = current;
      current = { fullTime: time, time: time.slice(11, 16), height: value };
    } else {
      future.push({ fullTime: time, time: time.slice(11, 16), height: value });
    }

    // 局部極值：比前後一小時高／低者視為滿潮或乾潮
    const before = heights[index - 1];
    const after = heights[index + 1];
    if (typeof before !== 'number' || typeof after !== 'number') continue;

    if (value >= before && value > after) {
      points.push({ fullTime: time, time: time.slice(11, 16), height: value, type: 'high' });
    } else if (value <= before && value < after) {
      points.push({ fullTime: time, time: time.slice(11, 16), height: value, type: 'low' });
    }
  }

  if (!current || future.length < 6) return null;

  const series = [current, ...future].slice(0, 25);
  const indexByTime = new Map(series.map((entry, index) => [entry.fullTime, index]));
  const upcoming = points
    .filter((point) => point.fullTime > now && indexByTime.has(point.fullTime))
    .sort((a, b) => (a.fullTime < b.fullTime ? -1 : 1));

  const levels = series.map((point) => point.height);
  const highest = Math.max(...levels);
  const lowest = Math.min(...levels);

  let trend = 'steady';
  if (previous) {
    const delta = current.height - previous.height;
    if (delta > 0.02) trend = 'rising';
    else if (delta < -0.02) trend = 'falling';
  }

  const nextHigh = upcoming.find((point) => point.type === 'high') ?? null;
  const nextLow = upcoming.find((point) => point.type === 'low') ?? null;

  return {
    current: { time: current.time, height: current.height, trend },
    nextHigh: nextHigh ? { time: nextHigh.time, height: nextHigh.height } : null,
    nextLow: nextLow ? { time: nextLow.time, height: nextLow.height } : null,
    highest,
    lowest,
    range: highest - lowest,
    series: series.map(({ time, height }) => ({ time, height })),
    points: upcoming.map(({ time, height, type, fullTime }) => ({
      time,
      height,
      type,
      index: indexByTime.get(fullTime) ?? 0
    }))
  };
}

function dayTag(day) {
  if (THUNDER_CODES.includes(day.weatherCode)) return '雷雨';
  if (HEAVY_RAIN_CODES.includes(day.weatherCode) || day.precipitationProbability >= 60) return '帶雨具';
  if (Math.max(day.windLevel, day.gustLevel) >= 6) return '風大';
  if (day.maxTemperature >= 33) return '高溫';
  if (day.uvIndex !== null && day.uvIndex >= 8) return '防曬';
  if (day.weatherCode <= 2) return '適合賞夕';
  return '天氣平穩';
}

function umbrellaAdvice(today) {
  const chance = Math.round(today.precipitationProbability);
  const heavy = HEAVY_RAIN_CODES.includes(today.weatherCode);
  const thunder = THUNDER_CODES.includes(today.weatherCode);

  if (chance >= 60 || heavy || thunder) {
    return {
      needed: true,
      level: 'avoid',
      label: '需要雨具',
      text: `降雨機率 ${chance}%，今天請帶雨具；海邊風大時輕便雨衣比雨傘好用。`
    };
  }

  if (chance >= 30 || LIGHT_RAIN_CODES.includes(today.weatherCode)) {
    return {
      needed: true,
      level: 'watch',
      label: '建議備傘',
      text: `降雨機率 ${chance}%，帶折疊傘或輕便雨衣備用，海岸陣雨常來得突然。`
    };
  }

  return {
    needed: false,
    level: 'good',
    label: '大致不需要',
    text: `降雨機率 ${chance}%，不太需要雨具，防曬與補水反而更重要。`
  };
}

function overallStatus(current, today) {
  const windLevel = Math.max(today.windLevel, today.gustLevel);

  if (
    THUNDER_CODES.includes(current.weatherCode) ||
    HEAVY_RAIN_CODES.includes(current.weatherCode) ||
    windLevel >= 7
  ) {
    return {
      level: 'avoid',
      title: '今天不建議久留海岸',
      text: '有雷雨、強降雨或強風訊號，建議調整行程，並遠離水邊與空曠海岸。'
    };
  }

  if (
    today.precipitationProbability >= 40 ||
    windLevel >= 6 ||
    today.maxTemperature >= 33 ||
    (today.uvIndex !== null && today.uvIndex >= 9)
  ) {
    return {
      level: 'watch',
      title: '今天需要保守安排',
      text: '留意陣雨、風勢與日曬，縮短戶外停留時間，並準備雨具、飲水與防曬。'
    };
  }

  return {
    level: 'good',
    title: '天氣條件相對穩定',
    text: '仍請留意短時天氣、長浪與現場警示；天氣預報不代表海況一定安全。'
  };
}

// 依天氣組合輸出可執行建議：風險提醒 + 穿搭 + 行程 + 隨身物品
function buildGuidance({ current, today, ocean }) {
  const alerts = [];
  const outfit = [];
  const plan = [];
  const items = [];

  const maxTemperature = today.maxTemperature;
  const minTemperature = today.minTemperature;
  const range = maxTemperature - minTemperature;
  const rainChance = Math.round(today.precipitationProbability);
  const uv = today.uvIndex;
  const humidity = current.humidity;
  const windLevel = Math.max(today.windLevel, today.gustLevel);
  const code = today.weatherCode;

  const thunder = THUNDER_CODES.includes(code);
  const heavyRain = HEAVY_RAIN_CODES.includes(code);
  const lightRain = LIGHT_RAIN_CODES.includes(code);
  const foggy =
    FOG_CODES.includes(code) || (current.visibility !== null && current.visibility < 1000);
  const wet =
    thunder || heavyRain || lightRain || (current.precipitation !== null && current.precipitation > 0);
  const waveHeight = ocean?.waveHeight ?? null;

  const addAlert = (title, text) => alerts.push({ title, text });

  // 風險提醒：優先級最高
  if (thunder) {
    addAlert('今天預報有雷雨', '請避開空曠海岸、沙灘與孤立大樹，水上活動直接取消。');
  }
  if (heavyRain) {
    addAlert('今天預報雨勢較強', '避開低窪與積水處，也不要站在堤防與消波塊上。');
  }
  if (windLevel >= 7) {
    addAlert('風勢強勁', '風很大，遠離海邊礁石、消波塊與鬆動招牌，戶外行程建議取消。');
  }
  if (maxTemperature >= 34) {
    addAlert('高溫', '氣溫偏高，縮短戶外停留時間並注意補水，出現頭暈就立刻休息。');
  }
  if (foggy) {
    addAlert('能見度不佳', '視線不良，往返請開車燈、拉長車距，也不適合遠眺看海。');
  }
  if (waveHeight !== null && waveHeight >= 1.5) {
    addAlert('長浪', `浪高約 ${waveHeight.toFixed(1)} 公尺，不要下水，也不要走上礁石。`);
  }

  const severe = alerts.length > 0;

  // 出行穿搭
  if (maxTemperature >= 32) {
    pushUnique(outfit, '天氣炎熱，建議透氣排汗的短袖與寬鬆衣物，可多帶一件替換上衣。');
  } else if (maxTemperature >= 26) {
    pushUnique(outfit, '氣溫舒適偏暖，短袖加上一件薄外套就夠。');
  } else if (maxTemperature > 10) {
    pushUnique(outfit, '氣溫微涼，建議長袖搭配可穿脫的外套。');
  } else {
    pushUnique(outfit, '氣溫偏低，請穿保暖外套並注意防風。');
  }

  if (range > 8) {
    pushUnique(outfit, `早晚溫差約 ${Math.round(range)} 度，帶一件外套方便增減。`);
  }
  if (humidity !== null && humidity >= 80 && maxTemperature >= 30) {
    pushUnique(outfit, '濕度高、體感悶熱，選擇排汗快乾材質比棉質舒服。');
  }
  if (wet || rainChance >= 50) {
    pushUnique(outfit, '可能遇雨，防水外套或快乾衣物比厚重棉質實用。');
  }
  if (windLevel >= 5) {
    pushUnique(outfit, '風勢明顯，建議加一件防風外層，避免寬鬆長裙與輕薄帽子。');
  } else if (!wet) {
    pushUnique(outfit, '風力不大，一般休閒穿著即可，海邊傍晚仍建議帶防風外層。');
  }

  // 遊玩安排（leisure 標記的推薦型建議，在天氣不佳時會被過濾）
  if (thunder) {
    pushPlan(plan, '水上與海岸活動請直接取消，等天氣穩定後再安排。');
  } else if (heavyRain) {
    pushPlan(plan, '不建議長時間戶外遊玩，優先選擇博物館、賣場等室內空間。');
  } else if (lightRain) {
    pushPlan(plan, '有短暫雨，露天行程體驗較差，可改走老街騎樓或室內館舍。');
  } else if (rainChance >= 60) {
    pushPlan(plan, '降雨機率高，戶外行程建議改期，或準備室內備案。');
  } else if (rainChance >= 30) {
    pushPlan(plan, '有機會出現短暫陣雨，戶外行程請保留室內備案。');
  }

  if (windLevel >= 7) {
    pushPlan(plan, '海邊、觀景平台與水上活動都不建議，請改走室內行程。');
  } else if (windLevel >= 5) {
    pushPlan(plan, '風力偏大，觀浪請待在平台內側，不要靠近浪線。');
  } else if (!wet) {
    pushPlan(plan, '風力平穩，適合在平台與沙灘散步。', true);
  }

  if (maxTemperature >= 32) {
    pushPlan(plan, '避開 11:00–14:00 的日曬高峰，戶外活動盡量排在下午之後。');
  } else if (maxTemperature >= 26) {
    pushPlan(plan, '中午前後日照較強，可安排室內休息，傍晚再回到海岸。', true);
  }

  if (foggy) {
    pushPlan(plan, '霧氣會遮住海平線，不適合看夕陽，建議改期。');
  } else if (code <= 2) {
    pushPlan(plan, '天氣穩定，適合戶外遊覽，也是看夕陽的好條件。', true);
  } else if (code === 3) {
    pushPlan(plan, '陰天光線柔和、沒有暴曬，適合長時間散步與拍照。', true);
  }

  if (uv !== null && uv >= 8) {
    pushPlan(plan, '紫外線很強，戶外活動建議縮短並定時到陰影處休息。');
  }

  // 海岸延伸（浪況、水溫、潮汐）
  if (ocean) {
    if (waveHeight !== null) {
      if (waveHeight >= 1.5) {
        pushPlan(plan, '浪況不佳，只在平台與乾沙區活動，浪線靠近就往上移動。');
      } else if (waveHeight >= 0.8) {
        pushPlan(plan, '浪況稍有起伏，留意浪線位置，也不要背對海面拍照。');
      } else {
        pushPlan(plan, '浪況相對平穩，但沙岸仍可能出現突發大浪，不要單獨靠近水邊。', true);
      }
    }

    if (ocean.seaTemperature !== null) {
      const sea = Math.round(ocean.seaTemperature);
      if (ocean.seaTemperature < 22) {
        pushPlan(plan, `海水溫度約 ${sea} 度，偏涼，不建議長時間泡水。`);
      } else {
        pushPlan(plan, `海水溫度約 ${sea} 度，但這片沙岸沒有救生員配置，玩水仍請保守。`, true);
      }
    }

    if (ocean.tide) {
      const tideNow = ocean.tide.current;
      const schedule = [
        ocean.tide.nextHigh ? `下一次滿潮約 ${ocean.tide.nextHigh.time}` : null,
        ocean.tide.nextLow ? `下一次乾潮約 ${ocean.tide.nextLow.time}` : null
      ]
        .filter(Boolean)
        .join('、');

      if (tideNow?.trend === 'rising') {
        pushPlan(
          plan,
          `目前正在漲潮，浪線會逐步往岸上推進${schedule ? `（${schedule}）` : ''}；玩沙與取景請往平台內側移動。`
        );
      } else if (tideNow?.trend === 'falling') {
        pushPlan(
          plan,
          `目前正在退潮，沙灘活動空間較大${schedule ? `（${schedule}）` : ''}；仍請保持與浪線的安全距離。`,
          true
        );
      } else if (schedule) {
        pushPlan(plan, `${schedule}；退潮時沙灘空間較大，漲潮時請往平台內側移動。`);
      }
    }
  }

  // 隨身物品
  if (rainChance >= 60 || heavyRain || thunder) {
    pushUnique(items, '雨具（輕便雨衣優於長柄傘）');
  } else if (rainChance >= 30 || lightRain) {
    pushUnique(items, '折疊傘或輕便雨衣備用');
  }
  if (windLevel >= 5) pushUnique(items, '有綁帶的帽子');
  if (uv !== null && uv >= 5) pushUnique(items, '防曬乳、墨鏡、遮陽帽');
  if (uv !== null && uv >= 8) pushUnique(items, '高係數防曬乳，並定時補擦');
  if (maxTemperature >= 28) pushUnique(items, '充足飲水（每人 500–1000 ml）');
  if (maxTemperature <= 10) pushUnique(items, '保暖外套、圍巾');
  if (range > 8) pushUnique(items, '薄外套或防風外套');
  if (humidity !== null && humidity >= 80) pushUnique(items, '毛巾或濕紙巾');
  if (foggy) pushUnique(items, '口罩');
  if (maxTemperature >= 22 && rainChance >= 30) pushUnique(items, '防蚊液');
  pushUnique(items, '密封袋或夾鏈袋保護手機與證件');

  const summaryParts = [
    `${current.condition} ${Math.round(minTemperature)}–${Math.round(maxTemperature)}℃`,
    uv !== null && uv >= 8 ? '紫外線很強' : uv !== null && uv >= 5 ? '紫外線偏強' : null,
    windLevel >= 5 ? `風力約 ${windLevel} 級` : '風力平穩',
    rainChance >= 30 ? `降雨機率 ${rainChance}%` : null
  ].filter((part) => Boolean(part));

  const hasStorm =
    thunder || heavyRain || windLevel >= 7 || (waveHeight !== null && waveHeight >= 1.5);
  const planTexts = plan
    .filter((entry) => !(hasStorm && entry.leisure))
    .map((entry) => entry.text);

  const groups = [
    { key: 'outfit', title: '出行穿搭', icon: '👕', items: outfit },
    { key: 'plan', title: '遊玩安排', icon: '🧭', items: planTexts },
    { key: 'items', title: '隨身物品', icon: '🎒', items: items }
  ].filter((group) => group.items.length > 0);

  return {
    summary: summaryParts.join('、'),
    severe,
    alerts,
    groups
  };
}

function normalizeOcean(raw) {
  if (!raw?.current) return null;

  const current = raw.current;
  const hourly = raw.hourly;
  const waveHeight = optionalNumber(current.wave_height);
  const seaTemperature = optionalNumber(current.sea_surface_temperature);
  const tide = buildTide(hourly?.time, hourly?.sea_level_height_msl);

  if (waveHeight === null && seaTemperature === null && !tide) return null;

  return {
    waveHeight,
    wavePeriod: optionalNumber(current.wave_period),
    waveDirection: windDirectionText(current.wave_direction),
    seaTemperature,
    tide
  };
}

function normalizeForecast(raw) {
  if (!raw?.current || !raw?.daily || !Array.isArray(raw.daily.time)) {
    throw new Error('Incomplete weather response');
  }

  const currentCode = requiredNumber(raw.current.weather_code, 'current.weather_code');
  const [currentCondition, currentIcon] = describeWeather(currentCode, raw.current.is_day === 1);

  const daily = raw.daily.time.slice(0, FORECAST_DAYS).map((date, index) => {
    const code = requiredNumber(raw.daily.weather_code?.[index], `daily.weather_code.${index}`);
    const [condition, icon] = describeWeather(code);
    const maxWindSpeed = optionalNumber(raw.daily.wind_speed_10m_max?.[index]) ?? 0;
    const maxWindGust = optionalNumber(raw.daily.wind_gusts_10m_max?.[index]) ?? 0;

    const day = {
      date,
      dateLabel: shortDate(date),
      label: dayLabel(date, index),
      weatherCode: code,
      condition,
      icon,
      maxTemperature: requiredNumber(
        raw.daily.temperature_2m_max?.[index],
        `daily.temperature_2m_max.${index}`
      ),
      minTemperature: requiredNumber(
        raw.daily.temperature_2m_min?.[index],
        `daily.temperature_2m_min.${index}`
      ),
      apparentMax: optionalNumber(raw.daily.apparent_temperature_max?.[index]),
      apparentMin: optionalNumber(raw.daily.apparent_temperature_min?.[index]),
      precipitationProbability: requiredNumber(
        raw.daily.precipitation_probability_max?.[index],
        `daily.precipitation_probability_max.${index}`
      ),
      precipitationSum: optionalNumber(raw.daily.precipitation_sum?.[index]),
      maxWindSpeed,
      maxWindGust,
      windLevel: beaufortLevel(maxWindSpeed),
      gustLevel: beaufortLevel(maxWindGust),
      uvIndex: optionalNumber(raw.daily.uv_index_max?.[index]),
      sunrise: clockLabel(raw.daily.sunrise?.[index]),
      sunset: clockLabel(raw.daily.sunset?.[index])
    };

    return { ...day, tag: dayTag(day) };
  });

  if (daily.length < 3) throw new Error('Multi-day forecast unavailable');

  const current = {
    weatherCode: currentCode,
    isDay: raw.current.is_day === 1,
    condition: currentCondition,
    icon: currentIcon,
    temperature: requiredNumber(raw.current.temperature_2m, 'current.temperature_2m'),
    apparentTemperature: requiredNumber(
      raw.current.apparent_temperature,
      'current.apparent_temperature'
    ),
    humidity: optionalNumber(raw.current.relative_humidity_2m),
    precipitation: optionalNumber(raw.current.precipitation),
    visibility: optionalNumber(raw.current.visibility),
    cloudCover: optionalNumber(raw.current.cloud_cover),
    windSpeed: requiredNumber(raw.current.wind_speed_10m, 'current.wind_speed_10m'),
    windGust: optionalNumber(raw.current.wind_gusts_10m),
    windDirection: windDirectionText(raw.current.wind_direction_10m)
  };

  const today = daily[0];

  return {
    location: LOCATION_NAME,
    updatedAt: `${raw.current.time}:00+08:00`,
    current,
    today,
    daily
  };
}

function normalizeWeather(raw, marineRaw = null) {
  const forecast = normalizeForecast(raw);
  const ocean = normalizeOcean(marineRaw);

  return {
    ...forecast,
    ocean,
    advice: overallStatus(forecast.current, forecast.today),
    umbrella: umbrellaAdvice(forecast.today),
    guidance: buildGuidance({ current: forecast.current, today: forecast.today, ocean })
  };
}

function forecastUrl() {
  const url = new URL(WEATHER_API);
  url.searchParams.set('latitude', LATITUDE);
  url.searchParams.set('longitude', LONGITUDE);
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,visibility,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset'
  );
  url.searchParams.set('timezone', 'Asia/Taipei');
  url.searchParams.set('forecast_days', String(FORECAST_DAYS));
  return url;
}

function marineUrl(withTide) {
  const url = new URL(MARINE_API);
  const currentVariables = ['wave_height', 'wave_period', 'wave_direction', 'sea_surface_temperature'];
  if (withTide) currentVariables.push('sea_level_height_msl');

  url.searchParams.set('latitude', LATITUDE);
  url.searchParams.set('longitude', LONGITUDE);
  url.searchParams.set('current', currentVariables.join(','));
  url.searchParams.set('daily', 'wave_height_max,sea_surface_temperature_max,sea_surface_temperature_min');
  if (withTide) url.searchParams.set('hourly', 'sea_level_height_msl');
  url.searchParams.set('timezone', 'Asia/Taipei');
  url.searchParams.set('forecast_days', String(FORECAST_DAYS));
  return url;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Upstream returned ${response.status}`);
  return response.json();
}

// 海象資料為加值資訊：取得失敗時不影響主預報
async function fetchMarine() {
  try {
    return await fetchJson(marineUrl(true));
  } catch {
    try {
      return await fetchJson(marineUrl(false));
    } catch {
      return null;
    }
  }
}

export async function fetchWeather() {
  const [forecast, marine] = await Promise.all([fetchJson(forecastUrl()), fetchMarine()]);
  return normalizeWeather(forecast, marine);
}

export async function handleWeather(request, ctx) {
  const requestUrl = new URL(request.url);
  const cacheKey = new Request(`${requestUrl.origin}${requestUrl.pathname}`, { method: 'GET' });
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const weather = await fetchWeather();
    const response = Response.json(weather, {
      headers: {
        'Cache-Control': 'public, max-age=600, stale-while-revalidate=1800',
        'X-Content-Type-Options': 'nosniff'
      }
    });

    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    console.error(
      JSON.stringify({
        message: 'weather request failed',
        error: error instanceof Error ? error.message : String(error),
        path: requestUrl.pathname
      })
    );

    return Response.json(
      { error: 'weather_unavailable' },
      {
        status: 502,
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff'
        }
      }
    );
  }
}

export { normalizeWeather, buildGuidance, beaufortLevel };

async function loadGoogleFont(
  font: string,
  text: string,
  weight: number
): Promise<ArrayBuffer | null> {
  const API = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;

  try {
    const css = await (
      await fetch(API, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      })
    ).text();

    const resource = css.match(
      /src: url\((.+?)\) format\('(opentype|truetype|woff2)'\)/
    );

    if (!resource) return null;

    const res = await fetch(resource[1]);
    if (!res.ok) return null;

    return res.arrayBuffer();
  } catch {
    return null;
  }
}

function hasKorean(text: string): boolean {
  return /[\u3131-\u3163\uac00-\ud7a3]/.test(text);
}

async function loadGoogleFonts(
  text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "IBM Plex Mono",
      font: "IBM+Plex+Mono",
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      font: "IBM+Plex+Mono",
      weight: 700,
      style: "bold",
    },
  ];

  const fonts: Array<{
    name: string;
    data: ArrayBuffer;
    weight: number;
    style: string;
  }> = [];

  for (const { name, font, weight, style } of fontsConfig) {
    const data = await loadGoogleFont(font, text, weight);
    if (data) fonts.push({ name, data, weight, style });
  }

  // 한글 문자가 포함된 경우 Noto Sans KR 폰트 추가 로드
  if (hasKorean(text)) {
    const koreanFontsConfig = [
      {
        name: "Noto Sans KR",
        font: "Noto+Sans+KR",
        weight: 400,
        style: "normal",
      },
      {
        name: "Noto Sans KR",
        font: "Noto+Sans+KR",
        weight: 700,
        style: "bold",
      },
    ];

    for (const { name, font, weight, style } of koreanFontsConfig) {
      const data = await loadGoogleFont(font, text, weight);
      if (data) fonts.push({ name, data, weight, style });
    }
  }

  return fonts;
}

export default loadGoogleFonts;

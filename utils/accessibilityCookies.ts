export interface AccessibilitySettings {
  highContrast: boolean;
  readableFonts: boolean;
  reducedMotion: boolean;
}

const COOKIE_NAME = 'accessibility_settings';
const COOKIE_DOMAIN = '.bread.codes';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export function getAccessibilitySettings(): AccessibilitySettings {
  if (typeof document === 'undefined') {
    return {
      highContrast: false,
      readableFonts: false,
      reducedMotion: false,
    };
  }

  const cookies = document.cookie.split(';');
  const accessibilityCookie = cookies.find(cookie =>
    cookie.trim().startsWith(`${COOKIE_NAME}=`)
  );

  if (!accessibilityCookie) {
    return {
      highContrast: false,
      readableFonts: false,
      reducedMotion: false,
    };
  }

  try {
    const value = accessibilityCookie.split('=')[1];
    const decoded = decodeURIComponent(value);
    const settings = JSON.parse(decoded);

    return {
      highContrast: settings.highContrast ?? false,
      readableFonts: settings.readableFonts ?? false,
      reducedMotion: settings.reducedMotion ?? false,
    };
  } catch (error) {
    console.error('Failed to parse accessibility settings cookie:', error);
    return {
      highContrast: false,
      readableFonts: false,
      reducedMotion: false,
    };
  }
}

export function setAccessibilitySettings(settings: AccessibilitySettings): void {
  if (typeof document === 'undefined') {
    return;
  }

  const value = JSON.stringify(settings);
  const encoded = encodeURIComponent(value);

  // Set cookie on .bread.codes domain so all subdomains can access it
  const cookieString = `${COOKIE_NAME}=${encoded}; domain=${COOKIE_DOMAIN}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;

  document.cookie = cookieString;
}

export function updateAccessibilitySetting(
  key: keyof AccessibilitySettings,
  value: boolean
): void {
  const current = getAccessibilitySettings();
  const updated = {
    ...current,
    [key]: value,
  };
  setAccessibilitySettings(updated);
}

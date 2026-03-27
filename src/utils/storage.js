export function getUserStorageId(currentUser) {
  return currentUser?.uid || currentUser?.email || 'guest';
}

export function getScopedStorageKey(scope, currentUser) {
  return `${scope}:${getUserStorageId(currentUser)}`;
}

export function readStorage(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  return value;
}

export function createNotification({ type = 'alert', message, link = '/dashboard' }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    message,
    link,
    date: new Date().toISOString(),
    read: false,
  };
}

export function formatDisplayDate(value) {
  if (!value) {
    return 'Just now';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

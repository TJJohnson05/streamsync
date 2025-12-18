const HISTORY_KEY = 'streamsync_history';
const MAX_ITEMS = 30;

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addToHistory(item) {
  // item should include at least { id, title, streamerName, category }
  const entry = { ...item, viewedAt: new Date().toISOString() };

  const current = getHistory();

  // remove duplicates by id (keep newest)
  const filtered = current.filter((x) => x.id !== entry.id);

  const updated = [entry, ...filtered].slice(0, MAX_ITEMS);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}


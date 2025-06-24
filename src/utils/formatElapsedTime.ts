export function formatElapsedTime(timestamp: string | number): string {
  if (timestamp == null || isNaN(Number(timestamp))) {
    return '?';
  }

  const timeMs = Number(timestamp) * 1000;
  const elapsedTime = Date.now() - timeMs;

  if (elapsedTime < 0) {
    if (elapsedTime / 1000 > -60) {
      return 'in a few seconds';
    }
    if (elapsedTime / 1000 / 60 > -60) {
      return 'in ' + (-elapsedTime / 1000 / 60).toFixed(0) + 'min';
    }
    if (elapsedTime / 1000 / 60 / 60 > -24) {
      return 'in ' + (-elapsedTime / 1000 / 60 / 60).toFixed(0) + 'h';
    }
    return 'in the future';
  }

  if (elapsedTime / 1000 < 60) {
    return 'just now';
  }
  if (elapsedTime / 1000 / 60 < 60) {
    return (elapsedTime / 1000 / 60).toFixed(0) + 'min ago';
  }
  if (elapsedTime / 1000 / 60 / 60 < 24) {
    return (elapsedTime / 1000 / 60 / 60).toFixed(0) + 'h ago';
  }
  return (elapsedTime / 1000 / 60 / 60 / 24).toFixed(0) + 'd ago';
}

export function readableDate(timestamp: string | number): string {
  if (timestamp == null || isNaN(Number(timestamp))) {
    return '?';
  }

  const date = new Date(Number(Number(timestamp)) * 1000);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatDateCompact(timestamp: string | number): string {
  const date = new Date(Number(Number(timestamp)) * 1000);
  const dateStr = date.toString();
  const trimmed = dateStr.replace(/\s\([^)]*\)$/, '');
  return `(${trimmed})`;
}

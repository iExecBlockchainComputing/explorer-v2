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
    if (elapsedTime / 1000 / 60 / 60 / 24 > -30) {
      return 'in ' + (-elapsedTime / 1000 / 60 / 60 / 24).toFixed(0) + 'd';
    }
    if (elapsedTime / 1000 / 60 / 60 / 24 / 30.44 > -12) {
      return (
        'in ' + (-elapsedTime / 1000 / 60 / 60 / 24 / 30.44).toFixed(0) + 'mo'
      );
    }
    return (
      'in ' + (-elapsedTime / 1000 / 60 / 60 / 24 / 365.25).toFixed(0) + 'y'
    );
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
  if (elapsedTime / 1000 / 60 / 60 / 24 < 30) {
    return (elapsedTime / 1000 / 60 / 60 / 24).toFixed(0) + 'd ago';
  }
  if (elapsedTime / 1000 / 60 / 60 / 24 / 30.44 < 12) {
    return (elapsedTime / 1000 / 60 / 60 / 24 / 30.44).toFixed(0) + 'mo ago';
  }
  return (elapsedTime / 1000 / 60 / 60 / 24 / 365.25).toFixed(0) + 'y ago';
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
  return trimmed;
}

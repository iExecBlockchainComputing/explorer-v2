export function formatElapsedTime(timestamp: string): string {
  if (!timestamp) {
    return '?';
  }
  const elapsedTime = Date.now() - new Date(timestamp * 1000).getTime();
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
    return 'a few seconds ago';
  }
  if (elapsedTime / 1000 / 60 < 60) {
    return (elapsedTime / 1000 / 60).toFixed(0) + 'min ago';
  }
  if (elapsedTime / 1000 / 60 / 60 < 24) {
    return (elapsedTime / 1000 / 60 / 60).toFixed(0) + 'h ago';
  }
  return (elapsedTime / 1000 / 60 / 60 / 24).toFixed(0) + 'd ago';
}

export function readableDate(timestamp: string): string {
  if (!timestamp) {
    return '?';
  }
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    // weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

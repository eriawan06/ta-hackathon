export function getFormattedDate(date) {
  return date.toLocaleString('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function getFormattedTime(date) {
  return date.toLocaleString('en', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function toISOStringWithTimezone(date) {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    diff + pad(tzOffset / 60) +
    ':' + pad(tzOffset % 60);
};
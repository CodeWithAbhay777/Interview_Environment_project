const IST_TIME_ZONE = 'Asia/Kolkata';

const toValidDate = (value) => {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatInIST = (value, options, fallback) => {
  const date = toValidDate(value);
  if (!date) return fallback;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIME_ZONE,
    ...options,
  }).format(date);
};

export const formatUtcToIstDateTime = (value, fallback = 'Invalid Date') => {
  const formatted = formatInIST(
    value,
    {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    fallback
  );

  if (formatted === fallback) return fallback;

  const parts = formatted.split(', ');
  if (parts.length >= 3) {
    return `${parts[0]}, ${parts[1]} • ${parts.slice(2).join(', ')}`;
  }

  return formatted;
};

export const formatUtcToIstDate = (
  value,
  fallback = 'Invalid date',
  options = { month: 'short', day: '2-digit', year: 'numeric' }
) => formatInIST(value, options, fallback);

export const formatUtcToIstTime = (value, fallback = 'Invalid time') =>
  formatInIST(
    value,
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    fallback
  );

export const formatUtcToIstFullDateTime = (value, fallback = 'Invalid date') =>
  formatInIST(
    value,
    {
      weekday: 'long',
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    fallback
  );

const getIstParts = (value) => {
  const date = toValidDate(value);
  if (!date) return null;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  return parts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
};

export const toIstInputDate = (value) => {
  const parts = getIstParts(value);
  if (!parts) return '';

  return `${parts.year}-${parts.month}-${parts.day}`;
};

export const toIstInputTime = (value) => {
  const parts = getIstParts(value);
  if (!parts) return '';

  return `${parts.hour}:${parts.minute}`;
};

function pad(value) {
  return String(value).padStart(2, '0');
}

export function parseIsoDateParts(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return null;
  }

  return {
    year,
    month,
    day,
  };
}

export function normalizeDateParts(value) {
  if (value == null) {
    return null;
  }

  if (typeof value === 'string') {
    return parseIsoDateParts(value);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return {
      year: value.getUTCFullYear(),
      month: value.getUTCMonth() + 1,
      day: value.getUTCDate(),
    };
  }

  if (
    typeof value === 'object' &&
    typeof value.year === 'number' &&
    typeof value.month === 'number' &&
    typeof value.day === 'number'
  ) {
    return {
      year: value.year,
      month: value.month,
      day: value.day,
    };
  }

  return null;
}

export function compareDateParts(left, right) {
  if (left.year !== right.year) {
    return left.year - right.year;
  }

  if (left.month !== right.month) {
    return left.month - right.month;
  }

  return left.day - right.day;
}

export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function formatIsoDateParts(value) {
  const parts = normalizeDateParts(value);
  if (!parts) {
    return '';
  }

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function formatDisplayDate(value) {
  const parts = normalizeDateParts(value);
  if (!parts) {
    return '';
  }

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

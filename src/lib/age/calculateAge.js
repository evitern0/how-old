import { compareDateParts, daysInMonth, formatIsoDateParts, normalizeDateParts } from './dateMath.js';

function calculateDateDifference(startInput, endInput) {
  const start = normalizeDateParts(startInput);
  const end = normalizeDateParts(endInput);

  if (!start || !end) {
    return null;
  }

  let earlier = start;
  let later = end;

  if (compareDateParts(start, end) > 0) {
    earlier = end;
    later = start;
  }

  let years = later.year - earlier.year;
  let months = later.month - earlier.month;
  let days = later.day - earlier.day;

  if (days < 0) {
    months -= 1;
    const previousMonth = later.month === 1 ? 12 : later.month - 1;
    const previousMonthYear = later.month === 1 ? later.year - 1 : later.year;
    days += daysInMonth(previousMonthYear, previousMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years,
    months,
    days,
  };
}

export function calculateAgeBetween(birthInput, referenceInput) {
  const birth = normalizeDateParts(birthInput);
  const reference = normalizeDateParts(referenceInput);

  if (!birth || !reference) {
    return null;
  }

  if (compareDateParts(reference, birth) < 0) {
    return null;
  }

  return calculateDateDifference(birth, reference);
}

function formatParts(parts) {
  if (!parts) {
    return '';
  }

  const segments = [];

  if (parts.years > 0) {
    segments.push(`${parts.years} year${parts.years === 1 ? '' : 's'}`);
  }

  if (parts.months > 0) {
    segments.push(`${parts.months} month${parts.months === 1 ? '' : 's'}`);
  }

  if (parts.days > 0) {
    segments.push(`${parts.days} day${parts.days === 1 ? '' : 's'}`);
  }

  if (segments.length === 0) {
    return '0 days';
  }

  return segments.join(', ');
}

export function formatAgeParts(ageParts) {
  if (!ageParts) {
    return 'Not born yet';
  }

  return formatParts(ageParts);
}

export function formatCountdownLabel(birthInput, referenceInput) {
  const countdownParts = calculateDateDifference(referenceInput, birthInput);

  if (!countdownParts) {
    return null;
  }

  return `🤰 ${formatParts(countdownParts)}`;
}

export function formatPhotoDate(value) {
  return formatIsoDateParts(value);
}

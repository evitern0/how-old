import { compareDateParts, daysInMonth, formatIsoDateParts, normalizeDateParts } from './dateMath.js';

export function calculateAgeBetween(birthInput, referenceInput) {
  const birth = normalizeDateParts(birthInput);
  const reference = normalizeDateParts(referenceInput);

  if (!birth || !reference) {
    return null;
  }

  if (compareDateParts(reference, birth) < 0) {
    return null;
  }

  let years = reference.year - birth.year;
  let months = reference.month - birth.month;
  let days = reference.day - birth.day;

  if (days < 0) {
    months -= 1;
    const previousMonth = reference.month === 1 ? 12 : reference.month - 1;
    const previousMonthYear = reference.month === 1 ? reference.year - 1 : reference.year;
    days += daysInMonth(previousMonthYear, previousMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    return null;
  }

  return {
    years,
    months,
    days,
  };
}

export function formatAgeParts(ageParts) {
  if (!ageParts) {
    return 'Not born yet';
  }

  const segments = [];

  if (ageParts.years > 0) {
    segments.push(`${ageParts.years} year${ageParts.years === 1 ? '' : 's'}`);
  }

  if (ageParts.months > 0) {
    segments.push(`${ageParts.months} month${ageParts.months === 1 ? '' : 's'}`);
  }

  if (ageParts.days > 0) {
    segments.push(`${ageParts.days} day${ageParts.days === 1 ? '' : 's'}`);
  }

  if (segments.length === 0) {
    return '0 days';
  }

  return segments.join(', ');
}

export function formatPhotoDate(value) {
  return formatIsoDateParts(value);
}

import { calculateAgeBetween, formatAgeParts } from '../../src/lib/age/calculateAge.js';

describe('age formatting', () => {
  it('omits zero units and keeps non-zero units', () => {
    expect(formatAgeParts({ years: 0, months: 8, days: 0 })).toBe('8 months');
    expect(formatAgeParts({ years: 2, months: 0, days: 3 })).toBe('2 years, 3 days');
    expect(formatAgeParts({ years: 1, months: 1, days: 1 })).toBe('1 year, 1 month, 1 day');
  });

  it('returns 0 days when all parts are zero', () => {
    expect(formatAgeParts({ years: 0, months: 0, days: 0 })).toBe('0 days');
  });

  it('calculates leap-year-aware age values', () => {
    const result = calculateAgeBetween('2016-02-29', '2024-03-01');
    expect(result).toEqual({ years: 8, months: 0, days: 1 });
  });
});

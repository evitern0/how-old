import { calculateAgeBetween, formatAgeParts } from '../../src/lib/age/calculateAge.js';
import { buildAgeResults } from '../../src/state/photoSession.js';

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

  it('keeps canonical results used by integration flow assertions', () => {
    const firstPhoto = calculateAgeBetween('2020-10-10', '2021-06-10');
    const secondPhoto = calculateAgeBetween('2020-10-10', '2022-06-10');

    expect(formatAgeParts(firstPhoto)).toBe('8 months');
    expect(formatAgeParts(secondPhoto)).toBe('1 year, 8 months');
  });

  it('adds a countdown label for people who are not yet born', () => {
    const results = buildAgeResults(
      [
        {
          id: 'person-1',
          name: 'Mina',
          dateOfBirth: '2025-07-20',
          editing: false,
          done: true,
        },
      ],
      '2024-01-15',
    );

    expect(results[0].ageLabel).toBe('Not born yet');
    expect(results[0].ageAuxLabel).toBe('🤰 1 year, 6 months, 5 days');
  });
});

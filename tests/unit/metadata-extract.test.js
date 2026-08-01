import { vi } from 'vitest';
import ExifReader from 'exifreader';
import { extractCaptureDate } from '../../src/lib/metadata/extractCaptureDate.js';

vi.mock('exifreader', () => ({
  default: {
    load: vi.fn(),
  },
}));

describe('extractCaptureDate', () => {
  const file = new File(['abc'], 'photo.heic', { type: 'image/heic' });

  it('reads top-level DateTimeOriginal', async () => {
    ExifReader.load.mockResolvedValueOnce({
      DateTimeOriginal: { description: '2024:06:15 10:00:00' },
    });

    const result = await extractCaptureDate(file);
    expect(result.status).toBe('parsed');
    expect(result.capturedAt).toBe('2024-06-15');
    expect(result.sourceTag).toBe('DateTimeOriginal');
  });

  it('reads nested exif DateTimeOriginal from expanded output', async () => {
    ExifReader.load.mockResolvedValueOnce({
      exif: {
        DateTimeOriginal: { description: '2023:12:01 11:22:33' },
      },
    });

    const result = await extractCaptureDate(file);
    expect(result.status).toBe('parsed');
    expect(result.capturedAt).toBe('2023-12-01');
  });

  it('returns missing metadata when no date fields are parseable', async () => {
    ExifReader.load.mockResolvedValueOnce({
      exif: {
        DateTimeOriginal: { description: 'not-a-date' },
      },
    });

    const result = await extractCaptureDate(file);
    expect(result.status).toBe('missing-metadata');
  });

  it('returns unsupported when parser throws', async () => {
    ExifReader.load.mockRejectedValueOnce(new Error('bad image'));

    const result = await extractCaptureDate(file);
    expect(result.status).toBe('unsupported');
  });
});

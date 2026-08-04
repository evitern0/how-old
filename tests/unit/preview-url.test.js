import { vi } from 'vitest';
import heic2any from 'heic2any';
import { createPreviewUrl } from '../../src/lib/preview/createPreviewUrl.js';

vi.mock('heic2any', () => ({
  default: vi.fn(),
}));

describe('createPreviewUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = vi.fn(() => 'blob:test-preview-url');
    globalThis.Worker = vi.fn();
  });

  it('converts HEIC files before creating a preview URL', async () => {
    const sourceFile = new File(['heic-bytes'], 'iphone.heic', { type: 'image/heic' });
    const convertedBlob = new Blob(['jpeg-bytes'], { type: 'image/jpeg' });
    heic2any.mockResolvedValueOnce(convertedBlob);

    const previewUrl = await createPreviewUrl(sourceFile);

    expect(heic2any).toHaveBeenCalledWith({
      blob: sourceFile,
      toType: 'image/jpeg',
      quality: 0.9,
    });
    expect(URL.createObjectURL).toHaveBeenCalledWith(convertedBlob);
    expect(previewUrl).toBe('blob:test-preview-url');
  });

  it('uses the original file for non-HEIC uploads', async () => {
    const sourceFile = new File(['jpeg-bytes'], 'camera.jpg', { type: 'image/jpeg' });

    await createPreviewUrl(sourceFile);

    expect(heic2any).not.toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalledWith(sourceFile);
  });

  it('falls back to the original file when HEIC conversion fails', async () => {
    const sourceFile = new File(['heic-bytes'], 'iphone.heic', { type: 'image/heic' });
    heic2any.mockRejectedValueOnce(new Error('conversion failed'));

    await createPreviewUrl(sourceFile);

    expect(URL.createObjectURL).toHaveBeenCalledWith(sourceFile);
  });
});
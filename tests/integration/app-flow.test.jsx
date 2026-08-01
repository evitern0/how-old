import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App.jsx';
import { extractCaptureDate } from '../../src/lib/metadata/extractCaptureDate.js';

vi.mock('../../src/lib/metadata/extractCaptureDate.js', () => ({
  extractCaptureDate: vi.fn(),
}));

describe('App upload flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows loading and then renders parsed age result', async () => {
    let resolveUpload;
    extractCaptureDate.mockImplementationOnce(
      () => new Promise((resolve) => {
        resolveUpload = resolve;
      }),
    );

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    const input = document.querySelector('input[type="file"]');
    const file = new File(['x'], 'img.heic', { type: 'image/heic' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Reading image metadata...')).toBeInTheDocument();

    resolveUpload({
      status: 'parsed',
      fileName: 'img.heic',
      mimeType: 'image/heic',
      sourceTag: 'exif.DateTimeOriginal',
      capturedAt: '2021-06-10',
    });

    await screen.findByText(/Photo date:/i);
    await screen.findByText('8 months');
  });

  it('shows helpful error when metadata cannot be read', async () => {
    extractCaptureDate.mockResolvedValueOnce({
      status: 'missing-metadata',
      message: 'This image does not expose a readable capture date. Choose a different image file.',
    });

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'img.heic', { type: 'image/heic' })] },
    });

    await screen.findByText('This image does not expose a readable capture date. Choose a different image file.');
  });
});

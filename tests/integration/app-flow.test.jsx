import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App.jsx';
import { extractCaptureDate } from '../../src/lib/metadata/extractCaptureDate.js';
import {
  createImageFile,
  createMissingMetadataResult,
  createParsedUploadResult,
} from '../setup.js';

vi.mock('../../src/lib/metadata/extractCaptureDate.js', () => ({
  extractCaptureDate: vi.fn(),
}));

describe('App upload flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('moves through people, upload, and results screens on successful upload', async () => {
    extractCaptureDate.mockResolvedValueOnce(createParsedUploadResult());

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Photo' })).toBeInTheDocument();

    const input = document.querySelector('input[type="file"]');
    const file = createImageFile('img.heic', 'image/heic');
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Reading image metadata...')).toBeInTheDocument();

    await screen.findByRole('heading', { name: 'Results' });
    await screen.findByText('8 months');
    expect(screen.getByRole('img', { name: 'Uploaded photo preview' })).toBeInTheDocument();
  });

  it('stays on upload screen and shows error when metadata is missing', async () => {
    extractCaptureDate.mockResolvedValueOnce(createMissingMetadataResult());

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, {
      target: { files: [createImageFile('img.heic', 'image/heic')] },
    });

    await screen.findByText('This image does not expose a readable capture date. Choose a different image file.');
    expect(screen.getByRole('heading', { name: 'Photo' })).toBeInTheDocument();
  });

  it('preserves entered people when navigating back from upload', async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByRole('heading', { name: 'People' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Casey');
  });

  it('supports results screen return actions', async () => {
    extractCaptureDate.mockResolvedValue(createParsedUploadResult());

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [createImageFile('img.heic', 'image/heic')] },
    });

    await screen.findByRole('heading', { name: 'Results' });
    await userEvent.click(screen.getByRole('button', { name: 'Upload another image' }));
    expect(screen.getByRole('heading', { name: 'Photo' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [createImageFile('img-2.heic', 'image/heic')] },
    });

    await screen.findByRole('heading', { name: 'Results' });
    await userEvent.click(screen.getByRole('button', { name: 'Back to people' }));
    expect(screen.getByRole('heading', { name: 'People' })).toBeInTheDocument();
  });

  it('re-runs with a second upload from results path and refreshes output', async () => {
    extractCaptureDate
      .mockResolvedValueOnce(createParsedUploadResult({ capturedAt: '2021-06-10' }))
      .mockResolvedValueOnce(createParsedUploadResult({ capturedAt: '2022-06-10' }));

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [createImageFile('img.heic', 'image/heic')] },
    });
    await screen.findByText('8 months');

    await userEvent.click(screen.getByRole('button', { name: 'Upload another image' }));
    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [createImageFile('img-2.heic', 'image/heic')] },
    });

    await screen.findByText('1 year, 8 months');
  });

  it('resets people form and clears persisted data', async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(window.localStorage.getItem('how-old.people.v1')).toBeNull();
  });
});

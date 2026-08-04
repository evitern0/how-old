import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App.jsx';
import { extractCaptureDate } from '../../src/lib/metadata/extractCaptureDate.js';
import {
  createImageFiles,
  createMissingMetadataResult,
  createParsedUploadResult,
  createUnsupportedUploadResult,
} from '../setup.js';

vi.mock('../../src/lib/metadata/extractCaptureDate.js', () => ({
  extractCaptureDate: vi.fn(),
}));

const globalStyles = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');

describe('App upload flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('queues multiple uploads, allows removal, and waits for explicit continue', async () => {
    extractCaptureDate
      .mockResolvedValueOnce(
        createParsedUploadResult({
          fileName: 'older.heic',
          capturedAt: '2021-06-10',
        }),
      )
      .mockResolvedValueOnce(
        createParsedUploadResult({
          fileName: 'newer.heic',
          capturedAt: '2022-06-10',
        }),
      );

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Photo' })).toBeInTheDocument();

    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, {
      target: {
        files: createImageFiles(['older.heic', 'newer.heic']),
      },
    });

    expect(screen.getByText('Reading image metadata...')).toBeInTheDocument();

    await screen.findByText('older.heic');
    expect(screen.getByRole('heading', { name: 'Photo' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Results' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Remove older.heic' }));
    expect(screen.queryByText('older.heic')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Continue to results' }));
    await screen.findByRole('heading', { name: 'Results' });
    expect(screen.getByText('newer.heic')).toBeInTheDocument();
    expect(screen.getByText('1 year, 8 months')).toBeInTheDocument();
  });

  it('keeps valid photos from a mixed batch and reports invalid files by name', async () => {
    extractCaptureDate
      .mockResolvedValueOnce(
        createParsedUploadResult({
          fileName: 'valid.heic',
          capturedAt: '2021-06-10',
        }),
      )
      .mockResolvedValueOnce(
        createMissingMetadataResult({ fileName: 'missing-date.heic' }),
      )
      .mockResolvedValueOnce(
        createUnsupportedUploadResult({ fileName: 'broken.heic' }),
      );

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, {
      target: {
        files: createImageFiles(['valid.heic', 'missing-date.heic', 'broken.heic']),
      },
    });

    await screen.findByText('valid.heic');
    await screen.findByText('missing-date.heic: This image does not expose a readable capture date. Choose a different image file.');
    await screen.findByText('broken.heic: This file could not be read as a valid image. Choose a different image file.');
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

  it('supports results screen return actions while preserving the queued upload state', async () => {
    extractCaptureDate
      .mockResolvedValueOnce(
        createParsedUploadResult({ fileName: 'img.heic', capturedAt: '2021-06-10' }),
      )
      .mockResolvedValueOnce(
        createParsedUploadResult({ fileName: 'img-2.heic', capturedAt: '2022-06-10' }),
      );

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: createImageFiles(['img.heic']) },
    });

    await screen.findByText('img.heic');
    await userEvent.click(screen.getByRole('button', { name: 'Continue to results' }));
    await screen.findByRole('heading', { name: 'Results' });
    await userEvent.click(screen.getByRole('button', { name: 'Back to upload' }));
    expect(screen.getByRole('heading', { name: 'Photo' })).toBeInTheDocument();
    expect(screen.getByText('img.heic')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: createImageFiles(['img-2.heic']) },
    });

    await screen.findByText('img-2.heic');
    await userEvent.click(screen.getByRole('button', { name: 'Continue to results' }));
    await screen.findByRole('heading', { name: 'Results' });
    await userEvent.click(screen.getByRole('button', { name: 'Back to people' }));
    expect(screen.getByRole('heading', { name: 'People' })).toBeInTheDocument();
  });

  it('renders results in chronological order and keeps people in configured order', async () => {
    extractCaptureDate
      .mockResolvedValueOnce(
        createParsedUploadResult({ fileName: 'middle.heic', capturedAt: '2022-05-01' }),
      )
      .mockResolvedValueOnce(
        createParsedUploadResult({ fileName: 'oldest.heic', capturedAt: '2021-06-10' }),
      )
      .mockResolvedValueOnce(
        createParsedUploadResult({ fileName: 'latest.heic', capturedAt: '2022-05-01' }),
      );

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Ada');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Add person' }));
    const nameFields = screen.getAllByLabelText('Name');
    const dobFields = screen.getAllByLabelText('Date of birth');
    await userEvent.type(nameFields[1], 'Lin');
    fireEvent.change(dobFields[1], {
      target: { value: '2021-01-10' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: createImageFiles(['middle.heic', 'oldest.heic', 'latest.heic']) },
    });

    await screen.findByText('middle.heic');
    await userEvent.click(screen.getByRole('button', { name: 'Continue to results' }));

    await screen.findByRole('heading', { name: 'Results' });
    const fileHeadings = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(fileHeadings).toEqual(['oldest.heic', 'middle.heic', 'latest.heic']);

    const firstTimelineEntry = screen.getByRole('heading', { name: 'oldest.heic' }).closest('article');
    expect(firstTimelineEntry).not.toBeNull();
    const peopleNames = within(firstTimelineEntry).getAllByText(/Ada|Lin/).map((node) => node.textContent);
    expect(peopleNames).toEqual(['Ada', 'Lin']);

    expect(screen.getByText('Photo date: 2021-06-10')).toBeInTheDocument();
  });

  it('keeps the compact timeline readable on a narrow viewport without horizontal layout classes', async () => {
    extractCaptureDate
      .mockResolvedValueOnce(
        createParsedUploadResult({ fileName: 'older.heic', capturedAt: '2021-06-10' }),
      )
      .mockResolvedValueOnce(
        createParsedUploadResult({ fileName: 'newer.heic', capturedAt: '2022-06-10' }),
      );

    render(<App />);

    await userEvent.type(screen.getByLabelText('Name'), 'Casey');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2020-10-10' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: createImageFiles(['older.heic', 'newer.heic']) },
    });

    await screen.findByText('older.heic');
    await userEvent.click(screen.getByRole('button', { name: 'Continue to results' }));
    await screen.findByRole('heading', { name: 'Results' });

    const timelineEntries = document.querySelectorAll('.timeline-entry');
    expect(timelineEntries).toHaveLength(2);
    expect(document.querySelectorAll('.timeline-entry__marker')).toHaveLength(2);
    expect(document.querySelectorAll('.timeline-entry__media img')).toHaveLength(2);
    expect(document.querySelectorAll('.results-list--timeline')).toHaveLength(2);

    expect(globalStyles).toMatch(/@media \(max-width: 640px\)[\s\S]*\.upload-photo-card,\s*\.timeline-entry\s*\{[\s\S]*grid-template-columns:\s*1fr;/);
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

import {
  applyQueuedUploadResults,
  buildTimelineEntries,
  createInitialPhotoState,
  removeQueuedPhoto,
} from '../../src/state/photoSession.js';

describe('photo session queue helpers', () => {
  it('enforces the five-photo limit while preserving accepted photo order', () => {
    const currentState = {
      ...createInitialPhotoState(),
      photos: [
        {
          id: 'queued-1',
          fileName: 'existing-1.heic',
          mimeType: 'image/heic',
          capturedAt: '2020-01-01',
          sourceTag: 'DateTimeOriginal',
          previewUrl: 'blob:existing-1',
          status: 'parsed',
          addedOrder: 0,
        },
        {
          id: 'queued-2',
          fileName: 'existing-2.heic',
          mimeType: 'image/heic',
          capturedAt: '2020-02-01',
          sourceTag: 'DateTimeOriginal',
          previewUrl: 'blob:existing-2',
          status: 'parsed',
          addedOrder: 1,
        },
      ],
      nextAddedOrder: 2,
    };

    const nextState = applyQueuedUploadResults(currentState, [
      {
        fileName: 'batch-1.heic',
        mimeType: 'image/heic',
        sourceTag: 'DateTimeOriginal',
        capturedAt: '2020-03-01',
        status: 'parsed',
        previewUrl: 'blob:batch-1',
      },
      {
        fileName: 'batch-2.heic',
        mimeType: 'image/heic',
        sourceTag: 'DateTimeOriginal',
        capturedAt: '2020-04-01',
        status: 'parsed',
        previewUrl: 'blob:batch-2',
      },
      {
        fileName: 'batch-3.heic',
        mimeType: 'image/heic',
        sourceTag: 'DateTimeOriginal',
        capturedAt: '2020-05-01',
        status: 'parsed',
        previewUrl: 'blob:batch-3',
      },
      {
        fileName: 'overflow.heic',
        mimeType: 'image/heic',
        sourceTag: 'DateTimeOriginal',
        capturedAt: '2020-06-01',
        status: 'parsed',
        previewUrl: 'blob:overflow',
      },
    ]);

    expect(nextState.photos).toHaveLength(5);
    expect(nextState.photos.map((photo) => photo.fileName)).toEqual([
      'existing-1.heic',
      'existing-2.heic',
      'batch-1.heic',
      'batch-2.heic',
      'batch-3.heic',
    ]);
    expect(nextState.fileErrors).toEqual([
      {
        fileName: 'overflow.heic',
        message: 'You can keep up to five photos in the queue.',
      },
    ]);
  });

  it('removes one queued photo and reports its preview URL for cleanup', () => {
    const currentState = {
      ...createInitialPhotoState(),
      photos: [
        {
          id: 'queued-1',
          fileName: 'older.heic',
          mimeType: 'image/heic',
          capturedAt: '2020-01-01',
          sourceTag: 'DateTimeOriginal',
          previewUrl: 'blob:older',
          status: 'parsed',
          addedOrder: 0,
        },
        {
          id: 'queued-2',
          fileName: 'newer.heic',
          mimeType: 'image/heic',
          capturedAt: '2020-02-01',
          sourceTag: 'DateTimeOriginal',
          previewUrl: 'blob:newer',
          status: 'parsed',
          addedOrder: 1,
        },
      ],
    };

    const result = removeQueuedPhoto(currentState, 'queued-1');

    expect(result.removedPreviewUrl).toBe('blob:older');
    expect(result.photoState.photos.map((photo) => photo.fileName)).toEqual(['newer.heic']);
  });

  it('rejects duplicate photos by file fingerprint while keeping the original queued item', () => {
    const currentState = {
      ...createInitialPhotoState(),
      photos: [
        {
          id: 'queued-1',
          fileName: 'duplicate.heic',
          mimeType: 'image/heic',
          capturedAt: '2020-01-01',
          sourceTag: 'DateTimeOriginal',
          previewUrl: 'blob:duplicate-1',
          fileFingerprint: 'duplicate.heic::image/heic::12345::1700000000000',
          status: 'parsed',
          addedOrder: 0,
        },
      ],
      nextAddedOrder: 1,
    };

    const nextState = applyQueuedUploadResults(currentState, [
      {
        fileName: 'duplicate.heic',
        mimeType: 'image/heic',
        capturedAt: '2020-03-01',
        sourceTag: 'DateTimeOriginal',
        fileSize: 12345,
        lastModified: 1700000000000,
        status: 'parsed',
        previewUrl: 'blob:duplicate-2',
      },
    ]);

    expect(nextState.photos).toHaveLength(1);
    expect(nextState.photos[0].fileName).toBe('duplicate.heic');
    expect(nextState.fileErrors).toEqual([
      {
        fileName: 'duplicate.heic',
        message: 'This photo is already in the queue.',
      },
    ]);
  });

  it('builds oldest-to-newest timeline entries and preserves configured people order', () => {
    const timelineEntries = buildTimelineEntries(
      [
        {
          id: 'person-1',
          name: 'Ada',
          dateOfBirth: '1990-01-10',
          editing: false,
          done: true,
        },
        {
          id: 'person-2',
          name: 'Lin',
          dateOfBirth: '1995-03-02',
          editing: false,
          done: true,
        },
      ],
      {
        ...createInitialPhotoState(),
        photos: [
          {
            id: 'queued-2',
            fileName: 'same-day-first.heic',
            mimeType: 'image/heic',
            capturedAt: '2022-05-01',
            sourceTag: 'DateTimeOriginal',
            previewUrl: 'blob:same-day-first',
            status: 'parsed',
            addedOrder: 1,
          },
          {
            id: 'queued-1',
            fileName: 'oldest.heic',
            mimeType: 'image/heic',
            capturedAt: '2021-06-10',
            sourceTag: 'DateTimeOriginal',
            previewUrl: 'blob:oldest',
            status: 'parsed',
            addedOrder: 0,
          },
          {
            id: 'queued-3',
            fileName: 'same-day-second.heic',
            mimeType: 'image/heic',
            capturedAt: '2022-05-01',
            sourceTag: 'DateTimeOriginal',
            previewUrl: 'blob:same-day-second',
            status: 'parsed',
            addedOrder: 2,
          },
        ],
      },
    );

    expect(timelineEntries.map((entry) => entry.fileName)).toEqual([
      'oldest.heic',
      'same-day-first.heic',
      'same-day-second.heic',
    ]);
    expect(timelineEntries[0].ageResults.map((result) => result.name)).toEqual(['Ada', 'Lin']);
  });
});
import { calculateAgeBetween, formatAgeParts, formatPhotoDate } from '../lib/age/calculateAge.js';
import { validatePeopleList } from '../lib/validation/peopleValidation.js';

export const FLOW_SCREENS = Object.freeze({
  PEOPLE: 'people',
  UPLOAD: 'upload',
  RESULTS: 'results',
});

export const MAX_QUEUED_PHOTOS = 5;

function createPhotoId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createQueuedPhoto(entry, addedOrder, previewUrl) {
  return {
    id: createPhotoId(),
    fileName: entry.fileName ?? '',
    mimeType: entry.mimeType ?? 'unknown',
    capturedAt: entry.capturedAt ?? '',
    sourceTag: entry.sourceTag ?? '',
    previewUrl,
    status: 'parsed',
    addedOrder,
  };
}

function createFileError(entry, message) {
  return {
    fileName: entry?.fileName ?? 'Unknown file',
    message,
  };
}

function buildSummaryMessage(photoCount, errorCount) {
  if (photoCount === 0 && errorCount > 0) {
    return 'No usable photos were added. Review the file issues and try again.';
  }

  if (photoCount === 0) {
    return '';
  }

  const photoLabel = `${photoCount} photo${photoCount === 1 ? '' : 's'} ready for results.`;
  if (errorCount === 0) {
    return photoLabel;
  }

  return `${photoLabel} ${errorCount} file${errorCount === 1 ? '' : 's'} need attention.`;
}

function compareQueuedPhotos(left, right) {
  if (left.capturedAt < right.capturedAt) {
    return -1;
  }

  if (left.capturedAt > right.capturedAt) {
    return 1;
  }

  return left.addedOrder - right.addedOrder;
}

function sortQueuedPhotos(photos) {
  return [...photos].sort(compareQueuedPhotos);
}

function revokeQueuedPreviewUrls(photos) {
  photos.forEach((photo) => revokePreviewUrl(photo.previewUrl));
}

export function createInitialWorkflowState() {
  return FLOW_SCREENS.PEOPLE;
}

export function canContinueToUpload(validation) {
  return Boolean(validation?.isValid);
}

export function canContinueToResults(photoState) {
  return Boolean(photoState?.photos?.length) && photoState?.status !== 'loading';
}

export function createInitialPhotoState() {
  return {
    photos: [],
    fileErrors: [],
    summaryMessage: '',
    status: 'idle',
    message: '',
    nextAddedOrder: 0,
  };
}

export function createLoadingPhotoState(currentPhotoState = createInitialPhotoState()) {
  return {
    ...currentPhotoState,
    fileErrors: [],
    summaryMessage: '',
    status: 'loading',
    message: 'Reading image metadata...',
  };
}

export function revokePreviewUrl(previewUrl) {
  if (!previewUrl || typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') {
    return;
  }

  URL.revokeObjectURL(previewUrl);
}

export function resetPhotoState(currentPhotoState) {
  revokeQueuedPreviewUrls(currentPhotoState?.photos ?? []);
  return createInitialPhotoState();
}

export function dismissUploadFeedback(currentPhotoState) {
  const safePhotoState = currentPhotoState ?? createInitialPhotoState();

  return {
    ...safePhotoState,
    fileErrors: [],
    summaryMessage: '',
    status: 'idle',
    message: '',
  };
}

export function createInitialSessionResults() {
  return [];
}

export function buildAgeResults(people, photoDate) {
  const validPeople = validatePeopleList(people).validPeople;

  return validPeople.map((person) => {
    const ageParts = calculateAgeBetween(person.dateOfBirth, photoDate);

    return {
      personId: person.id,
      name: person.name,
      dateOfBirth: person.dateOfBirth,
      photoDate: formatPhotoDate(photoDate),
      ageParts,
      ageLabel: formatAgeParts(ageParts),
    };
  });
}

export function applyQueuedUploadResults(
  currentPhotoState,
  uploadResults,
  createPreviewForEntry = (entry) => entry.previewUrl ?? '',
) {
  const safePhotoState = currentPhotoState ?? createInitialPhotoState();
  const photos = [...(safePhotoState.photos ?? [])];
  const fileErrors = [];
  let nextAddedOrder = safePhotoState.nextAddedOrder ?? photos.length;

  uploadResults.forEach((entry) => {
    if (entry?.status === 'parsed' && entry?.capturedAt) {
      if (photos.length >= MAX_QUEUED_PHOTOS) {
        fileErrors.push(createFileError(entry, 'You can keep up to five photos in the queue.'));
        return;
      }

      photos.push(createQueuedPhoto(entry, nextAddedOrder, createPreviewForEntry(entry)));
      nextAddedOrder += 1;
      return;
    }

    fileErrors.push(
      createFileError(entry, entry?.message ?? 'Choose a different image file.'),
    );
  });

  return {
    ...safePhotoState,
    photos,
    fileErrors,
    summaryMessage: buildSummaryMessage(photos.length, fileErrors.length),
    status: 'ready',
    message: '',
    nextAddedOrder,
  };
}

export function removeQueuedPhoto(currentPhotoState, photoId) {
  const safePhotoState = currentPhotoState ?? createInitialPhotoState();
  let removedPreviewUrl = '';

  const photos = (safePhotoState.photos ?? []).filter((photo) => {
    if (photo.id !== photoId) {
      return true;
    }

    removedPreviewUrl = photo.previewUrl;
    return false;
  });

  return {
    removedPreviewUrl,
    photoState: {
      ...safePhotoState,
      photos,
      summaryMessage: buildSummaryMessage(photos.length, safePhotoState.fileErrors?.length ?? 0),
      status: 'ready',
      message: '',
    },
  };
}

export function buildTimelineEntries(people, photoState) {
  if (!photoState?.photos?.length) {
    return [];
  }

  const validation = validatePeopleList(people);
  if (!validation.isValid || validation.validPeople.length === 0) {
    return [];
  }

  return sortQueuedPhotos(photoState.photos).map((photo) => ({
    photoId: photo.id,
    fileName: photo.fileName,
    capturedAt: photo.capturedAt,
    thumbnailUrl: photo.previewUrl,
    sourceTag: photo.sourceTag,
    sortKey: `${photo.capturedAt}:${photo.addedOrder}`,
    ageResults: buildAgeResults(validation.validPeople, photo.capturedAt),
  }));
}

export function recalculateSessionResults(people, photoState) {
  return buildTimelineEntries(people, photoState);
}

import { calculateAgeBetween, formatAgeParts, formatPhotoDate } from '../lib/age/calculateAge.js';
import { validatePeopleList } from '../lib/validation/peopleValidation.js';

export const FLOW_SCREENS = Object.freeze({
  PEOPLE: 'people',
  UPLOAD: 'upload',
  RESULTS: 'results',
});

export function createInitialWorkflowState() {
  return FLOW_SCREENS.PEOPLE;
}

export function canContinueToUpload(validation) {
  return Boolean(validation?.isValid);
}

export function canShowResults(photoState) {
  return Boolean(photoState?.status === 'parsed' && photoState?.capturedAt);
}

export function createInitialPhotoState() {
  return {
    fileName: '',
    mimeType: '',
    capturedAt: '',
    sourceTag: '',
    previewUrl: '',
    status: 'idle',
    message: '',
  };
}

export function createLoadingPhotoState() {
  return {
    fileName: '',
    mimeType: '',
    capturedAt: '',
    sourceTag: '',
    previewUrl: '',
    status: 'loading',
    message: 'Reading image metadata...',
  };
}

export function createPreviewUrl(file) {
  if (!file || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return '';
  }

  return URL.createObjectURL(file);
}

export function revokePreviewUrl(previewUrl) {
  if (!previewUrl || typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') {
    return;
  }

  URL.revokeObjectURL(previewUrl);
}

export function resetPhotoState(currentPhotoState) {
  revokePreviewUrl(currentPhotoState?.previewUrl);
  return createInitialPhotoState();
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

export function applyUploadResult(metadataResult, previewUrl = '') {
  if (!metadataResult || metadataResult.status !== 'parsed') {
    return {
      photo: {
        fileName: metadataResult?.fileName ?? '',
        mimeType: metadataResult?.mimeType ?? '',
        capturedAt: '',
        sourceTag: '',
        previewUrl: '',
        status: metadataResult?.status ?? 'unsupported',
        message: metadataResult?.message ?? 'Choose a different image file.',
      },
      results: [],
    };
  }

  return {
    photo: {
      fileName: metadataResult.fileName,
      mimeType: metadataResult.mimeType,
      capturedAt: metadataResult.capturedAt,
      sourceTag: metadataResult.sourceTag,
      previewUrl,
      status: 'parsed',
      message: '',
    },
    results: [],
  };
}

export function recalculateSessionResults(people, photoState) {
  if (!photoState || photoState.status !== 'parsed' || !photoState.capturedAt) {
    return [];
  }

  const validation = validatePeopleList(people);
  if (!validation.isValid) {
    return [];
  }

  return buildAgeResults(validation.validPeople, photoState.capturedAt);
}

export function describePhotoState(photoState) {
  if (!photoState || photoState.status !== 'parsed' || !photoState.capturedAt) {
    return '';
  }

  return `${photoState.capturedAt} · ${photoState.sourceTag}`;
}

import { calculateAgeBetween, formatAgeParts, formatPhotoDate } from '../lib/age/calculateAge.js';
import { validatePeopleList } from '../lib/validation/peopleValidation.js';

export function createInitialPhotoState() {
  return {
    fileName: '',
    mimeType: '',
    capturedAt: '',
    sourceTag: '',
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
    status: 'loading',
    message: 'Reading image metadata...',
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

export function applyUploadResult(metadataResult) {
  if (!metadataResult || metadataResult.status !== 'parsed') {
    return {
      photo: {
        fileName: metadataResult?.fileName ?? '',
        mimeType: metadataResult?.mimeType ?? '',
        capturedAt: '',
        sourceTag: '',
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

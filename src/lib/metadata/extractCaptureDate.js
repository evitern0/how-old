import ExifReader from 'exifreader';
import { formatIsoDateParts, normalizeDateParts, parseIsoDateParts } from '../age/dateMath.js';

const CAPTURE_TAGS = [
  ['DateTimeOriginal'],
  ['exif', 'DateTimeOriginal'],
  ['CreateDate'],
  ['exif', 'CreateDate'],
  ['DateTimeDigitized'],
  ['exif', 'DateTimeDigitized'],
  ['DateTime'],
  ['exif', 'DateTime'],
  ['ModifyDate'],
  ['exif', 'ModifyDate'],
];

function readTagValue(tag) {
  if (tag == null) {
    return '';
  }

  if (typeof tag === 'string') {
    return tag;
  }

  if (Array.isArray(tag)) {
    return readTagValue(tag[0]);
  }

  if (typeof tag.description === 'string' && tag.description.trim()) {
    return tag.description;
  }

  if (typeof tag.value === 'string' && tag.value.trim()) {
    return tag.value;
  }

  if (typeof tag.value === 'number') {
    return String(tag.value);
  }

  if (typeof tag.description === 'number') {
    return String(tag.description);
  }

  return '';
}

function getNestedTagValue(tags, path) {
  let current = tags;

  for (const segment of path) {
    if (!current || typeof current !== 'object') {
      return '';
    }

    current = current[segment];
  }

  return readTagValue(current);
}

function getCaptureTag(tags, path) {
  const directValue = getNestedTagValue(tags, path);
  if (directValue) {
    return directValue;
  }

  if (path.length === 1 && tags?.exif && typeof tags.exif === 'object') {
    return readTagValue(tags.exif[path[0]]);
  }

  return '';
}

function parseCaptureDate(rawValue) {
  if (!rawValue) {
    return null;
  }

  const trimmed = String(rawValue).trim();
  const exifMatch = /^(\d{4}):(\d{2}):(\d{2})/.exec(trimmed);
  if (exifMatch) {
    return parseIsoDateParts(`${exifMatch[1]}-${exifMatch[2]}-${exifMatch[3]}`);
  }

  const isoMatch = /^(\d{4}-\d{2}-\d{2})/.exec(trimmed);
  if (isoMatch) {
    return parseIsoDateParts(isoMatch[1]);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return normalizeDateParts(parsed);
}

export async function extractCaptureDate(file) {
  if (!file) {
    return {
      status: 'unsupported',
      message: 'Choose a different image file.',
    };
  }

  try {
    const tags = await ExifReader.load(file, { expanded: true });

    for (const path of CAPTURE_TAGS) {
      const rawValue = getCaptureTag(tags, path);
      const parsedDate = parseCaptureDate(rawValue);

      if (parsedDate) {
        return {
          status: 'parsed',
          fileName: file.name,
          mimeType: file.type || 'unknown',
          sourceTag: path.join('.'),
          capturedAt: formatIsoDateParts(parsedDate),
        };
      }
    }

    return {
      status: 'missing-metadata',
      message: 'This image does not expose a readable capture date. Choose a different image file.',
    };
  } catch (error) {
    return {
      status: 'unsupported',
      message: 'This file could not be read as a valid image. Choose a different image file.',
    };
  }
}

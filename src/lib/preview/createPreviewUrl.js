const HEIC_MIME_TYPES = new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);
const HEIC_NAME_PATTERN = /\.(heic|heif)$/i;

function supportsObjectUrls() {
  return typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function';
}

function isHeicFile(file) {
  if (!file) {
    return false;
  }

  if (typeof file.type === 'string' && HEIC_MIME_TYPES.has(file.type.toLowerCase())) {
    return true;
  }

  return typeof file.name === 'string' && HEIC_NAME_PATTERN.test(file.name);
}

function canConvertHeic() {
  return typeof Worker === 'function';
}

async function convertHeicToPreviewBlob(file) {
  const { default: heic2any } = await import('heic2any');
  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  });

  if (Array.isArray(converted)) {
    return converted[0] ?? file;
  }

  return converted ?? file;
}

export async function createPreviewUrl(file) {
  if (!file || !supportsObjectUrls()) {
    return '';
  }

  let previewSource = file;

  if (isHeicFile(file) && canConvertHeic()) {
    try {
      previewSource = await convertHeicToPreviewBlob(file);
    } catch {
      previewSource = file;
    }
  }

  return URL.createObjectURL(previewSource);
}
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

export function createImageFile(name = 'photo.heic', type = 'image/heic') {
	return new File(['image-bytes'], name, { type });
}

export function createImageFiles(files) {
	return files.map((file) => {
		if (typeof file === 'string') {
			return createImageFile(file);
		}

		return createImageFile(file.name, file.type);
	});
}

export function createParsedUploadResult(overrides = {}) {
	return {
		status: 'parsed',
		fileName: 'photo.heic',
		mimeType: 'image/heic',
		sourceTag: 'exif.DateTimeOriginal',
		capturedAt: '2021-06-10',
		...overrides,
	};
}

export function createMissingMetadataResult(overrides = {}) {
	return {
		status: 'missing-metadata',
		fileName: 'photo.heic',
		mimeType: 'image/heic',
		message: 'This image does not expose a readable capture date. Choose a different image file.',
		...overrides,
	};
}

export function createUnsupportedUploadResult(overrides = {}) {
	return {
		status: 'unsupported',
		fileName: 'photo.heic',
		mimeType: 'image/heic',
		message: 'This file could not be read as a valid image. Choose a different image file.',
		...overrides,
	};
}

beforeAll(() => {
	if (typeof URL.createObjectURL !== 'function') {
		URL.createObjectURL = vi.fn(() => 'blob:test-preview-url');
	}

	if (typeof URL.revokeObjectURL !== 'function') {
		URL.revokeObjectURL = vi.fn();
	}
});

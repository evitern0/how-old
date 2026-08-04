import { MAX_QUEUED_PHOTOS } from '../state/photoSession.js';

export default function PhotoUpload({
  fileInputKey,
  photoState,
  onUpload,
  onRemovePhoto,
  onDismissErrors,
  onResetUpload,
}) {
  const isUploadDisabled = photoState.photos.length >= MAX_QUEUED_PHOTOS;

  return (
    <section className="card">
      <h2>Photo</h2>
      <p className="card__subtitle">
        Upload photos from your computer or phone. The app reads each capture date locally from file
        metadata and lets you review the queue before continuing.
      </p>

      <input
        key={fileInputKey}
        className="upload-input"
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        disabled={isUploadDisabled}
      />

      <div className="toolbar" style={{ marginTop: '16px' }}>
        <p className="help-text">
          {isUploadDisabled
            ? `Photo queue is full (${MAX_QUEUED_PHOTOS}/${MAX_QUEUED_PHOTOS}). Remove a photo or reset to upload more.`
            : `You can queue up to ${MAX_QUEUED_PHOTOS} photos total. Valid files stay queued even when other files in the same selection fail.`}
        </p>
        <button className="symbol-button" type="button" onClick={onResetUpload}>
          Reset
        </button>
      </div>

      {photoState.status === 'loading' ? (
        <div className="notice" style={{ marginTop: '16px' }}>
          <div className="feedback-banner__content">
            <span>{photoState.message}</span>
          </div>
        </div>
      ) : null}

      {photoState.summaryMessage ? (
        <div className="notice" style={{ marginTop: '16px' }}>
          <div className="feedback-banner__content">
            <span>{photoState.summaryMessage}</span>
          </div>
        </div>
      ) : null}

      {photoState.fileErrors.length > 0 ? (
        <div className="alert" style={{ marginTop: '16px' }}>
          <div className="feedback-banner__content">
            <strong>Some files could not be added.</strong>
            <button className="symbol-button" type="button" onClick={onDismissErrors} aria-label="Dismiss feedback">
              ×
            </button>
          </div>
          <ul className="file-error-list">
            {photoState.fileErrors.map((error, index) => (
              <li key={`${error.fileName}:${error.message}:${index}`}>
                {error.fileName}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {photoState.photos.length === 0 ? (
        <div className="empty-state upload-empty-state">
          <strong>No photos queued yet</strong>
          <p className="muted">Add one or more supported images to build the timeline.</p>
        </div>
      ) : (
        <ul className="upload-queue">
          {photoState.photos.map((photo) => (
            <li className="upload-queue__item" key={photo.id}>
              <article className="upload-photo-card">
                {photo.previewUrl ? (
                  <img src={photo.previewUrl} alt={`${photo.fileName} preview`} className="upload-photo-card__image" />
                ) : null}
                <div className="upload-photo-card__content">
                  <div className="upload-photo-card__header">
                    <h3>{photo.fileName}</h3>
                    <div className="upload-photo-card__header-actions">
                      <button
                        className="symbol-button symbol-button--danger"
                        type="button"
                        onClick={() => onRemovePhoto(photo.id)}
                        aria-label={`Remove ${photo.fileName}`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p className="upload-photo-card__meta">Capture date {photo.capturedAt}</p>
                  <p className="muted">Metadata field {photo.sourceTag}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

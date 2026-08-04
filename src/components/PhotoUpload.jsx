import { MAX_QUEUED_PHOTOS } from '../state/photoSession.js';

export default function PhotoUpload({ fileInputKey, photoState, onUpload, onRemovePhoto }) {
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
      />

      <p className="help-text" style={{ marginTop: '16px' }}>
        You can queue up to {MAX_QUEUED_PHOTOS} photos total. Valid files stay queued even when other
        files in the same selection fail.
      </p>

      {photoState.status === 'loading' ? (
        <div className="notice" style={{ marginTop: '16px' }}>
          {photoState.message}
        </div>
      ) : null}

      {photoState.summaryMessage ? (
        <div className="notice" style={{ marginTop: '16px' }}>
          {photoState.summaryMessage}
        </div>
      ) : null}

      {photoState.fileErrors.length > 0 ? (
        <div className="alert" style={{ marginTop: '16px' }}>
          <strong>Some files could not be added.</strong>
          <ul className="file-error-list">
            {photoState.fileErrors.map((error) => (
              <li key={`${error.fileName}:${error.message}`}>
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
                    <button
                      className="button button--secondary"
                      type="button"
                      onClick={() => onRemovePhoto(photo.id)}
                      aria-label={`Remove ${photo.fileName}`}
                    >
                      Remove
                    </button>
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

export default function PhotoUpload({ fileInputKey, photoState, onUpload }) {
  return (
    <section className="card">
      <h2>Photo</h2>
      <p className="card__subtitle">
        Upload a photo from your computer or phone. The app reads the capture date locally from the
        file metadata.
      </p>

      <input
        key={fileInputKey}
        className="upload-input"
        type="file"
        accept="image/*"
        onChange={onUpload}
      />

      {photoState.status === 'parsed' ? (
        <div className="notice" style={{ marginTop: '16px' }}>
          <strong>Photo date:</strong> {photoState.capturedAt}
          <div className="muted" style={{ marginTop: '6px' }}>
            Metadata field: {photoState.sourceTag}
          </div>
        </div>
      ) : null}

      {photoState.status === 'loading' ? (
        <div className="notice" style={{ marginTop: '16px' }}>
          {photoState.message}
        </div>
      ) : null}

      {photoState.status === 'unsupported' || photoState.status === 'missing-metadata' ? (
        <div className="alert" style={{ marginTop: '16px' }}>
          {photoState.message}
        </div>
      ) : null}

      <p className="help-text" style={{ marginTop: '16px' }}>
        If the image does not expose a readable capture date, choose a different file.
      </p>
    </section>
  );
}

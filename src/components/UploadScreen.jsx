import PhotoUpload from './PhotoUpload.jsx';

export default function UploadScreen({
  fileInputKey,
  photoState,
  onUpload,
  onBack,
  onContinue,
  onRemovePhoto,
}) {
  return (
    <section className="screen-card">
      <p className="screen-card__step">Step 2 of 3</p>
      <PhotoUpload
        fileInputKey={fileInputKey}
        photoState={photoState}
        onUpload={onUpload}
        onRemovePhoto={onRemovePhoto}
      />
      <div className="screen-actions">
        <button className="button button--secondary" type="button" onClick={onBack}>
          Back
        </button>
        <button
          className="button"
          type="button"
          onClick={onContinue}
          disabled={photoState.photos.length === 0 || photoState.status === 'loading'}
        >
          Continue to results
        </button>
      </div>
    </section>
  );
}

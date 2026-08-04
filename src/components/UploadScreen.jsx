import PhotoUpload from './PhotoUpload.jsx';

export default function UploadScreen({
  fileInputKey,
  photoState,
  canContinue,
  onUpload,
  onBack,
  onContinue,
  onRemovePhoto,
  onDismissFeedback,
  onResetUpload,
}) {
  return (
    <section className="screen-card">
      <p className="screen-card__step">Step 2 of 3</p>
      <PhotoUpload
        fileInputKey={fileInputKey}
        photoState={photoState}
        onUpload={onUpload}
        onRemovePhoto={onRemovePhoto}
        onDismissFeedback={onDismissFeedback}
        onResetUpload={onResetUpload}
      />
      <div className="screen-actions">
        <button className="button button--secondary" type="button" onClick={onBack}>
          Back
        </button>
        <button
          className="button"
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
        >
          Continue to results
        </button>
      </div>
    </section>
  );
}

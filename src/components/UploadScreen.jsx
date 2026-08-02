import PhotoUpload from './PhotoUpload.jsx';

export default function UploadScreen({ fileInputKey, photoState, onUpload, onBack }) {
  return (
    <section className="screen-card">
      <p className="screen-card__step">Step 2 of 3</p>
      <PhotoUpload fileInputKey={fileInputKey} photoState={photoState} onUpload={onUpload} />
      <div className="screen-actions screen-actions--start">
        <button className="button button--secondary" type="button" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  );
}

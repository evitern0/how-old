import AgeResults from './AgeResults.jsx';

export default function ResultsScreen({ results, photoState, onReturnToUpload, onReturnToPeople }) {
  return (
    <section className="screen-card">
      <p className="screen-card__step">Step 3 of 3</p>
      <AgeResults results={results} photoState={photoState} />
      <div className="screen-actions">
        <button className="button button--secondary" type="button" onClick={onReturnToPeople}>
          Back to people
        </button>
        <button className="button" type="button" onClick={onReturnToUpload}>
          Upload another image
        </button>
      </div>
    </section>
  );
}

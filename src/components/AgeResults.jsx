export default function AgeResults({ results, photoState }) {
  return (
    <section className="card">
      <h2>Results</h2>
      <p className="card__subtitle">
        Each age is shown as years, months, and days at the detected photo date.
      </p>

      {photoState.status === 'parsed' && photoState.previewUrl ? (
        <figure className="result-photo-preview">
          <img src={photoState.previewUrl} alt="Uploaded photo preview" />
        </figure>
      ) : null}

      {photoState.status !== 'parsed' ? (
        <div className="empty-state">
          <strong>No photo date yet</strong>
          <p className="muted">Upload a supported image to calculate ages.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <strong>Ready to calculate</strong>
          <p className="muted">Add valid people entries to see ages for this photo.</p>
        </div>
      ) : (
        <ul className="results-list">
          {results.map((result) => (
            <li className="result-item" key={result.personId}>
              <div className="result-item__head">
                <strong>{result.name}</strong>
                <span className="result-item__age">{result.ageLabel}</span>
              </div>
              <div className="muted">Born {result.dateOfBirth}</div>
              <div className="muted">Photo date {result.photoDate}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

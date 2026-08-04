export default function AgeResults({ results }) {
  const formatUnderTwoMonths = (ageParts) => {
    if (!ageParts || ageParts.years >= 2) {
      return '';
    }

    const totalMonths = (ageParts.years * 12) + ageParts.months;
    const monthLabel = totalMonths === 1 ? 'month' : 'months';
    return `👶 ${totalMonths} ${monthLabel}`;
  };

  return (
    <section className="card">
      <h2>Results</h2>
      <p className="card__subtitle">
        Photos appear from oldest to newest.
      </p>

      {results.length === 0 ? (
        <div className="empty-state">
          <strong>Ready to calculate</strong>
          <p className="muted">Add valid people entries and at least one photo to see the timeline.</p>
        </div>
      ) : (
        <div className="timeline">
          {results.map((entry) => (
            <article className="timeline-entry" key={entry.photoId}>
              <div className="timeline-entry__media">
                <img src={entry.thumbnailUrl} alt={`${entry.fileName} preview`} />
              </div>

              <div className="timeline-entry__marker" aria-hidden="true">
                <span className="timeline-entry__dot" />
              </div>

              <div className="timeline-entry__content">
                <p className="timeline-entry__meta">Photo date: {entry.capturedAt}</p>
                <h3>{entry.fileName}</h3>
                <p className="muted">Metadata field {entry.sourceTag}</p>

                <ul className="results-list results-list--timeline">
                  {entry.ageResults.map((result) => {
                    const underTwoAge = formatUnderTwoMonths(result.ageParts);
                    const secondaryLabel = result.ageAuxLabel ?? underTwoAge;

                    return (
                      <li className="result-item" key={`${entry.photoId}:${result.personId}`}>
                        <div className="result-item__head">
                          <strong>{result.name}</strong>
                          <div className="result-item__age-block">
                            <span className="result-item__age">{result.ageLabel}</span>
                            {secondaryLabel ? <span className="result-item__age-aux">{secondaryLabel}</span> : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

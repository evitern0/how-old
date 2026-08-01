export default function SessionActions({ onClearSession }) {
  return (
    <section className="card">
      <h2>Session</h2>
      <p className="card__subtitle">
        Reset the current photo and remove the saved people list from this browser.
      </p>

      <button className="button button--danger" type="button" onClick={onClearSession}>
        Clear session
      </button>
    </section>
  );
}

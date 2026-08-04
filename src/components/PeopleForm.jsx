import { canAddMorePeople, isValidIsoDate } from '../lib/validation/peopleValidation.js';

export default function PeopleForm({
  people,
  validation,
  onAddPerson,
  onUpdatePerson,
  onRemovePerson,
  onFinalizePerson,
  onEditPerson,
}) {
  const canFinalize = (person) => {
    return Boolean(person.name.trim()) && isValidIsoDate(person.dateOfBirth);
  };

  const handleKeyDown = (event, person) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    if (!canFinalize(person)) {
      return;
    }

    onFinalizePerson(person.id);
  };

  return (
    <section className="card">
      <h2>People</h2>
      <p className="card__subtitle">
        Enter one to five people. Their names and dates of birth are saved locally in your browser.
      </p>

      {validation.summary ? <div className="alert">{validation.summary}</div> : null}

      <div className="people-list">
        {people.map((person, index) => {
          const issues = validation.issuesById[person.id] ?? {};
          const isEditing = person.editing !== false;

          return (
            <article className={`person-row${person.done ? ' person-row--done' : ''}`} key={person.id}>
              <div className="person-row__header">
                <div className="person-row__title-wrap">
                  <strong>Person {index + 1}</strong>
                  {person.done ? <span className="person-row__status">Ready</span> : null}
                </div>
                <div className="person-row__actions">
                  {isEditing ? (
                    <button
                      className="symbol-button"
                      type="button"
                      onClick={() => {
                        if (!canFinalize(person)) {
                          return;
                        }
                        onFinalizePerson(person.id);
                      }}
                      aria-label={`Done ${person.name || `person ${index + 1}`}`}
                      disabled={!canFinalize(person)}
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      className="symbol-button"
                      type="button"
                      onClick={() => onEditPerson(person.id)}
                      aria-label={`Edit ${person.name || `person ${index + 1}`}`}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="symbol-button symbol-button--danger"
                    type="button"
                    onClick={() => onRemovePerson(person.id)}
                    disabled={people.length <= 1}
                    aria-label={`Remove ${person.name || `person ${index + 1}`}`}
                  >
                    ×
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="person-grid">
                  <div className="field">
                    <input
                      id={`name-${person.id}`}
                      type="text"
                      value={person.name}
                      placeholder="Name"
                      aria-label="Name"
                      onChange={(event) => onUpdatePerson(person.id, 'name', event.target.value)}
                      onKeyDown={(event) => handleKeyDown(event, person)}
                    />
                    {issues.name ? <p className="field__error">{issues.name}</p> : null}
                  </div>

                  <div className="field">
                    <input
                      className="field__date-input"
                      id={`dob-${person.id}`}
                      type="date"
                      value={person.dateOfBirth}
                      aria-label="Date of birth"
                      onChange={(event) => onUpdatePerson(person.id, 'dateOfBirth', event.target.value)}
                      onKeyDown={(event) => handleKeyDown(event, person)}
                    />
                    {issues.dateOfBirth ? <p className="field__error">{issues.dateOfBirth}</p> : null}
                  </div>
                </div>
              ) : (
                <div className="person-summary">
                  <div>
                    <p className="person-summary__name">{person.name}</p>
                    <p className="person-summary__dob">{person.dateOfBirth}</p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="toolbar" style={{ marginTop: '18px' }}>
        <p className="help-text">{people.length} of 5 people entered.</p>
        <button
          className="symbol-button"
          type="button"
          onClick={onAddPerson}
          disabled={!canAddMorePeople(people)}
          aria-label="Add person"
        >
          +
        </button>
      </div>
    </section>
  );
}

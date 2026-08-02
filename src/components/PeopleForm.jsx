import { canAddMorePeople } from '../lib/validation/peopleValidation.js';

export default function PeopleForm({
  people,
  validation,
  onAddPerson,
  onUpdatePerson,
  onRemovePerson,
}) {
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

          return (
            <article className="person-row" key={person.id}>
              <div className="person-row__header">
                <strong>Person {index + 1}</strong>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => onRemovePerson(person.id)}
                  disabled={people.length <= 1}
                >
                  Remove
                </button>
              </div>

              <div className="person-grid">
                <div className="field">
                  <label htmlFor={`name-${person.id}`}>Name</label>
                  <input
                    id={`name-${person.id}`}
                    type="text"
                    value={person.name}
                    placeholder="Ada Lovelace"
                    onChange={(event) => onUpdatePerson(person.id, 'name', event.target.value)}
                  />
                  {issues.name ? <p className="field__error">{issues.name}</p> : null}
                </div>

                <div className="field">
                  <label htmlFor={`dob-${person.id}`}>Date of birth</label>
                  <input
                    id={`dob-${person.id}`}
                    type="date"
                    value={person.dateOfBirth}
                    onChange={(event) => onUpdatePerson(person.id, 'dateOfBirth', event.target.value)}
                  />
                  {issues.dateOfBirth ? <p className="field__error">{issues.dateOfBirth}</p> : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="toolbar" style={{ marginTop: '18px' }}>
        <p className="help-text">{people.length} of 5 people entered.</p>
        <button
          className="button button--secondary"
          type="button"
          onClick={onAddPerson}
          disabled={!canAddMorePeople(people)}
        >
          Add person
        </button>
      </div>
    </section>
  );
}

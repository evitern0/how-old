import PeopleForm from './PeopleForm.jsx';

export default function PeopleScreen({
  people,
  validation,
  onAddPerson,
  onUpdatePerson,
  onRemovePerson,
  onFinalizePerson,
  onEditPerson,
  onContinue,
  onReset,
}) {
  return (
    <section className="screen-card">
      <p className="screen-card__step">Step 1 of 3</p>
      <PeopleForm
        people={people}
        validation={validation}
        onAddPerson={onAddPerson}
        onUpdatePerson={onUpdatePerson}
        onRemovePerson={onRemovePerson}
        onFinalizePerson={onFinalizePerson}
        onEditPerson={onEditPerson}
      />
      <div className="screen-actions">
        <button className="button button--secondary" type="button" onClick={onReset}>
          Reset
        </button>
        <button className="button" type="button" onClick={onContinue} disabled={!validation.isValid}>
          Continue
        </button>
      </div>
    </section>
  );
}

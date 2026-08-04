import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PeopleForm from '../../src/components/PeopleForm.jsx';
import PeopleScreen from '../../src/components/PeopleScreen.jsx';

describe('PeopleForm', () => {
  it('applies the mobile-safe date input styling hook to date of birth fields', () => {
    render(
      <PeopleForm
        people={[
          {
            id: 'person-1',
            name: 'Casey',
            dateOfBirth: '2020-10-10',
            editing: true,
            done: false,
          },
        ]}
        validation={{ summary: '', issuesById: {} }}
        onAddPerson={() => {}}
        onUpdatePerson={() => {}}
        onRemovePerson={() => {}}
        onFinalizePerson={() => {}}
        onEditPerson={() => {}}
      />,
    );

    expect(screen.getByLabelText('Date of birth')).toHaveClass('field__date-input');
  });

  it('finalizes a valid row when the done control is clicked', async () => {
    const handleFinalize = vi.fn();

    render(
      <PeopleForm
        people={[
          {
            id: 'person-1',
            name: 'Casey',
            dateOfBirth: '2020-10-10',
            editing: true,
            done: false,
          },
        ]}
        validation={{ summary: '', issuesById: {} }}
        onAddPerson={() => {}}
        onUpdatePerson={() => {}}
        onRemovePerson={() => {}}
        onFinalizePerson={handleFinalize}
        onEditPerson={() => {}}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Done Casey' }));
    expect(handleFinalize).toHaveBeenCalledWith('person-1');
  });

  it('invokes reset action from people screen controls', async () => {
    const handleReset = vi.fn();

    render(
      <PeopleScreen
        people={[
          {
            id: 'person-1',
            name: 'Casey',
            dateOfBirth: '2020-10-10',
            editing: false,
            done: true,
          },
        ]}
        validation={{ summary: '', issuesById: {}, isValid: true }}
        onAddPerson={() => {}}
        onUpdatePerson={() => {}}
        onRemovePerson={() => {}}
        onFinalizePerson={() => {}}
        onEditPerson={() => {}}
        onContinue={() => {}}
        onReset={handleReset}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});

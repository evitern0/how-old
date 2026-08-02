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
          },
        ]}
        validation={{ summary: '', issuesById: {} }}
        onAddPerson={() => {}}
        onUpdatePerson={() => {}}
        onRemovePerson={() => {}}
      />,
    );

    expect(screen.getByLabelText('Date of birth')).toHaveClass('field__date-input');
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
          },
        ]}
        validation={{ summary: '', issuesById: {}, isValid: true }}
        onAddPerson={() => {}}
        onUpdatePerson={() => {}}
        onRemovePerson={() => {}}
        onContinue={() => {}}
        onReset={handleReset}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});

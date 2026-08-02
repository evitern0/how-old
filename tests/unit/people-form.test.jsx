import { render, screen } from '@testing-library/react';
import PeopleForm from '../../src/components/PeopleForm.jsx';

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
});

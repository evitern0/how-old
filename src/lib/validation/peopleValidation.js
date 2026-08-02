export const MIN_PEOPLE = 1;
export const MAX_PEOPLE = 5;

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `person-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createBlankPerson() {
  return {
    id: createId(),
    name: '',
    dateOfBirth: '',
  };
}

export function createPerson(values = {}) {
  return {
    id: values.id ?? createId(),
    name: typeof values.name === 'string' ? values.name : '',
    dateOfBirth: typeof values.dateOfBirth === 'string' ? values.dateOfBirth : '',
  };
}

export function normalizePeople(people) {
  if (!Array.isArray(people)) {
    return [];
  }

  return people.slice(0, MAX_PEOPLE).map((person) => createPerson(person));
}

export function isValidIsoDate(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day
  );
}

export function validatePeopleList(people) {
  const normalizedPeople = normalizePeople(people);
  const issuesById = {};
  const validPeople = [];

  normalizedPeople.forEach((person) => {
    const issues = {
      name: '',
      dateOfBirth: '',
    };

    if (!person.name.trim()) {
      issues.name = 'Enter a name.';
    }

    if (!isValidIsoDate(person.dateOfBirth)) {
      issues.dateOfBirth = 'Enter a valid date of birth in YYYY-MM-DD format.';
    }

    if (issues.name || issues.dateOfBirth) {
      issuesById[person.id] = issues;
      return;
    }

    validPeople.push({
      ...person,
      name: person.name.trim(),
      dateOfBirth: person.dateOfBirth.trim(),
    });
  });

  let summary = '';
  if (normalizedPeople.length < MIN_PEOPLE) {
    summary = 'Add at least one person before uploading a photo.';
  } else if (normalizedPeople.length > MAX_PEOPLE) {
    summary = 'You can enter up to five people.';
  } else if (Object.keys(issuesById).length > 0) {
    summary = 'Finish every person entry before uploading a photo.';
  }

  return {
    normalizedPeople,
    validPeople,
    issuesById,
    summary,
    isValid:
      normalizedPeople.length >= MIN_PEOPLE &&
      normalizedPeople.length <= MAX_PEOPLE &&
      Object.keys(issuesById).length === 0,
  };
}

export function canAddMorePeople(people) {
  return normalizePeople(people).length < MAX_PEOPLE;
}

export function updatePersonById(people, id, field, value) {
  return normalizePeople(people).map((person) => {
    if (person.id !== id) {
      return person;
    }

    return {
      ...person,
      [field]: value,
    };
  });
}

export function removePersonById(people, id) {
  return normalizePeople(people).filter((person) => person.id !== id);
}

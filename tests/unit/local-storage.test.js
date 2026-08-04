import {
  clearPeopleFromStorage,
  loadPeopleFromStorage,
  loadPeopleOrDefault,
  savePeopleToStorage,
} from '../../src/state/localStorage.js';

const STORAGE_KEY = 'how-old.people.v1';

describe('localStorage people persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and restores the people list', () => {
    const people = [
      { id: '1', name: 'Ada', dateOfBirth: '1990-01-10' },
      { id: '2', name: 'Lin', dateOfBirth: '1995-03-02' },
    ];

    savePeopleToStorage(people);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeTruthy();

    const loaded = loadPeopleFromStorage();
    expect(loaded).toEqual(
      people.map((person) => ({ ...person, editing: false, done: true })),
    );
  });

  it('clears persisted people', () => {
    savePeopleToStorage([{ id: '1', name: 'Ada', dateOfBirth: '1990-01-10' }]);
    clearPeopleFromStorage();
    expect(loadPeopleFromStorage()).toEqual([]);
  });

  it('returns empty list for malformed JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, '{bad json');
    expect(loadPeopleFromStorage()).toEqual([]);
  });

  it('hydrates legacy stored people as finalized rows', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: '1', name: 'Ada', dateOfBirth: '1990-01-10' }]),
    );

    const loaded = loadPeopleFromStorage();
    expect(loaded).toEqual([
      {
        id: '1',
        name: 'Ada',
        dateOfBirth: '1990-01-10',
        editing: false,
        done: true,
      },
    ]);
  });

  it('restores default person when nothing is stored', () => {
    const defaultPerson = { id: 'new', name: '', dateOfBirth: '' };
    const loaded = loadPeopleOrDefault(() => defaultPerson);
    expect(loaded).toEqual([defaultPerson]);
  });
});

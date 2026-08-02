import { MAX_PEOPLE, normalizePeople } from '../lib/validation/peopleValidation.js';

const STORAGE_KEY = 'how-old.people.v1';

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadPeopleFromStorage() {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);
    return normalizePeople(parsedValue).slice(0, MAX_PEOPLE);
  } catch (error) {
    return [];
  }
}

export function loadPeopleOrDefault(createDefaultPerson) {
  const storedPeople = loadPeopleFromStorage();
  if (storedPeople.length > 0) {
    return storedPeople;
  }

  return [createDefaultPerson()];
}

export function savePeopleToStorage(people) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    const normalizedPeople = normalizePeople(people).slice(0, MAX_PEOPLE);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedPeople));
  } catch (error) {
    // Ignore storage failures in private browsing or restricted browser modes.
  }
}

export function clearPeopleFromStorage() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Ignore storage failures in private browsing or restricted browser modes.
  }
}

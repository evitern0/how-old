import { useEffect, useMemo, useState } from 'react';
import AgeResults from './components/AgeResults.jsx';
import PeopleForm from './components/PeopleForm.jsx';
import PhotoUpload from './components/PhotoUpload.jsx';
import SessionActions from './components/SessionActions.jsx';
import { extractCaptureDate } from './lib/metadata/extractCaptureDate.js';
import {
  createBlankPerson,
  normalizePeople,
  validatePeopleList,
  updatePersonById,
  removePersonById,
} from './lib/validation/peopleValidation.js';
import {
  clearPeopleFromStorage,
  loadPeopleFromStorage,
  savePeopleToStorage,
} from './state/localStorage.js';
import {
  applyUploadResult,
  createLoadingPhotoState,
  createInitialPhotoState,
  recalculateSessionResults,
} from './state/photoSession.js';

function createInitialPeople() {
  const storedPeople = loadPeopleFromStorage();
  if (storedPeople.length > 0) {
    return storedPeople;
  }

  return [createBlankPerson()];
}

export default function App() {
  const [people, setPeople] = useState(() => createInitialPeople());
  const [photoState, setPhotoState] = useState(() => createInitialPhotoState());
  const [results, setResults] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const validation = useMemo(() => validatePeopleList(people), [people]);

  useEffect(() => {
    if (validation.isValid) {
      savePeopleToStorage(validation.validPeople);
    }
  }, [people, validation.isValid, validation.validPeople]);

  useEffect(() => {
    if (photoState.status !== 'parsed') {
      setResults([]);
      return;
    }

    setResults(recalculateSessionResults(people, photoState));
  }, [people, photoState]);

  const handleAddPerson = () => {
    setPeople((currentPeople) => {
      if (currentPeople.length >= 5) {
        return currentPeople;
      }

      return [...normalizePeople(currentPeople), createBlankPerson()];
    });
  };

  const handleUpdatePerson = (id, field, value) => {
    setPeople((currentPeople) => updatePersonById(currentPeople, id, field, value));
  };

  const handleRemovePerson = (id) => {
    setPeople((currentPeople) => {
      const nextPeople = removePersonById(currentPeople, id);
      return nextPeople.length > 0 ? nextPeople : [createBlankPerson()];
    });
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoState(createLoadingPhotoState());

    try {
      const uploadResult = await extractCaptureDate(file);
      const nextState = applyUploadResult(uploadResult);
      setPhotoState(nextState.photo);
      setResults(nextState.results);
    } finally {
      setFileInputKey((currentKey) => currentKey + 1);
    }
  };

  const handleClearSession = () => {
    clearPeopleFromStorage();
    setPeople([createBlankPerson()]);
    setPhotoState(createInitialPhotoState());
    setResults([]);
    setFileInputKey((currentKey) => currentKey + 1);
  };

  const hasValidPeople = validation.isValid;
  const readyMessage = hasValidPeople
    ? 'Ready to read a photo date.'
    : 'Finish the people list before uploading a photo.';

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="hero__eyebrow">How Old</p>
        <h1>See how old people were when a photo was taken.</h1>
        <p>
          Add up to five people, upload an image, and the app will read the photo date from the file
          metadata locally in your browser. People are stored in browser localStorage so you can return
          later, while uploaded files stay in memory only.
        </p>
        <div className="hero__badges">
          <span className="badge">Frontend only</span>
          <span className="badge">ExifReader metadata parsing</span>
          <span className="badge">People saved locally</span>
          <span className="badge">No file persistence</span>
        </div>
      </header>

      <main className="layout">
        <div className="stack">
          <PeopleForm
            people={people}
            validation={validation}
            onAddPerson={handleAddPerson}
            onUpdatePerson={handleUpdatePerson}
            onRemovePerson={handleRemovePerson}
          />
          <PhotoUpload fileInputKey={fileInputKey} photoState={photoState} onUpload={handleUpload} />
        </div>

        <div className="stack">
          <AgeResults results={results} photoState={photoState} />
          <SessionActions onClearSession={handleClearSession} />
          <section className="card">
            <h2>Status</h2>
            <p className="card__subtitle">{readyMessage}</p>
            <p className="help-text">
              The people list persists in this browser. Uploaded images and derived metadata are not
              stored after parsing.
            </p>
          </section>
        </div>
      </main>

      <p className="footer-note">
        If the photo does not expose a readable capture date or the file is not a valid image, the app
        will ask you to choose a different image file.
      </p>
    </div>
  );
}

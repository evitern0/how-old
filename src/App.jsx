import { useEffect, useMemo, useState } from 'react';
import PeopleScreen from './components/PeopleScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import UploadScreen from './components/UploadScreen.jsx';
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
  loadPeopleOrDefault,
  savePeopleToStorage,
} from './state/localStorage.js';
import {
  applyUploadResult,
  canContinueToUpload,
  createInitialWorkflowState,
  createLoadingPhotoState,
  createPreviewUrl,
  createInitialPhotoState,
  FLOW_SCREENS,
  recalculateSessionResults,
  resetPhotoState,
  revokePreviewUrl,
} from './state/photoSession.js';

function createInitialPeople() {
  return loadPeopleOrDefault(createBlankPerson);
}

export default function App() {
  const [people, setPeople] = useState(() => createInitialPeople());
  const [currentScreen, setCurrentScreen] = useState(() => createInitialWorkflowState());
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

  useEffect(
    () => () => {
      revokePreviewUrl(photoState.previewUrl);
    },
    [photoState.previewUrl],
  );

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

    setPhotoState((currentPhotoState) => {
      revokePreviewUrl(currentPhotoState.previewUrl);
      return createLoadingPhotoState();
    });

    try {
      const uploadResult = await extractCaptureDate(file);
      const previewUrl = uploadResult.status === 'parsed' ? createPreviewUrl(file) : '';
      const nextState = applyUploadResult(uploadResult, previewUrl);
      setPhotoState(nextState.photo);
      setResults(nextState.results);

      if (uploadResult.status === 'parsed') {
        setCurrentScreen(FLOW_SCREENS.RESULTS);
      }
    } finally {
      setFileInputKey((currentKey) => currentKey + 1);
    }
  };

  const handleResetPeople = () => {
    clearPeopleFromStorage();
    setPeople([createBlankPerson()]);
    setPhotoState((currentPhotoState) => resetPhotoState(currentPhotoState));
    setResults([]);
    setCurrentScreen(FLOW_SCREENS.PEOPLE);
    setFileInputKey((currentKey) => currentKey + 1);
  };

  const handleContinueToUpload = () => {
    if (!canContinueToUpload(validation)) {
      return;
    }

    setCurrentScreen(FLOW_SCREENS.UPLOAD);
  };

  const handleBackToPeople = () => {
    setCurrentScreen(FLOW_SCREENS.PEOPLE);
  };

  const handleReturnToUpload = () => {
    setCurrentScreen(FLOW_SCREENS.UPLOAD);
  };

  const showPeopleScreen = currentScreen === FLOW_SCREENS.PEOPLE;
  const showUploadScreen = currentScreen === FLOW_SCREENS.UPLOAD;
  const showResultsScreen = currentScreen === FLOW_SCREENS.RESULTS;

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

      <main className="screen-shell">
        {showPeopleScreen ? (
          <PeopleScreen
            people={people}
            validation={validation}
            onAddPerson={handleAddPerson}
            onUpdatePerson={handleUpdatePerson}
            onRemovePerson={handleRemovePerson}
            onContinue={handleContinueToUpload}
            onReset={handleResetPeople}
          />
        ) : null}

        {showUploadScreen ? (
          <UploadScreen
            fileInputKey={fileInputKey}
            photoState={photoState}
            onUpload={handleUpload}
            onBack={handleBackToPeople}
          />
        ) : null}

        {showResultsScreen ? (
          <ResultsScreen
            results={results}
            photoState={photoState}
            onReturnToUpload={handleReturnToUpload}
            onReturnToPeople={handleBackToPeople}
          />
        ) : null}
      </main>
    </div>
  );
}

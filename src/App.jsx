import { useEffect, useMemo, useRef, useState } from 'react';
import PeopleScreen from './components/PeopleScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import UploadScreen from './components/UploadScreen.jsx';
import { extractCaptureDate } from './lib/metadata/extractCaptureDate.js';
import { createPreviewUrl } from './lib/preview/createPreviewUrl.js';
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
  applyQueuedUploadResults,
  canContinueToResults,
  canContinueToUpload,
  buildTimelineEntries,
  createInitialWorkflowState,
  createLoadingPhotoState,
  createInitialPhotoState,
  FLOW_SCREENS,
  resetPhotoState,
  removeQueuedPhoto,
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
  const latestPhotoStateRef = useRef(photoState);

  const validation = useMemo(() => validatePeopleList(people), [people]);

  latestPhotoStateRef.current = photoState;

  useEffect(() => {
    if (validation.isValid) {
      savePeopleToStorage(validation.validPeople);
    }
  }, [people, validation.isValid, validation.validPeople]);

  useEffect(() => {
    setResults(buildTimelineEntries(people, photoState));
  }, [people, photoState]);

  useEffect(
    () => () => {
      latestPhotoStateRef.current.photos.forEach((photo) => {
        revokePreviewUrl(photo.previewUrl);
      });
    },
    [],
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
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setPhotoState((currentPhotoState) => createLoadingPhotoState(currentPhotoState));

    try {
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const result = await extractCaptureDate(file);
          const previewUrl = result.status === 'parsed' ? await createPreviewUrl(file) : '';

          return {
            ...result,
            file,
            fileName: result.fileName ?? file.name,
            mimeType: result.mimeType ?? file.type ?? 'unknown',
            previewUrl,
          };
        }),
      );

      setPhotoState((currentPhotoState) =>
        applyQueuedUploadResults(currentPhotoState, uploadResults),
      );
    } finally {
      setFileInputKey((currentKey) => currentKey + 1);
    }
  };

  const handleRemovePhoto = (photoId) => {
    let removedPreviewUrl = '';

    setPhotoState((currentPhotoState) => {
      const nextState = removeQueuedPhoto(currentPhotoState, photoId);
      removedPreviewUrl = nextState.removedPreviewUrl;
      return nextState.photoState;
    });

    revokePreviewUrl(removedPreviewUrl);
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

  const handleContinueToResults = () => {
    if (!canContinueToResults(photoState)) {
      return;
    }

    setCurrentScreen(FLOW_SCREENS.RESULTS);
  };

  const showPeopleScreen = currentScreen === FLOW_SCREENS.PEOPLE;
  const showUploadScreen = currentScreen === FLOW_SCREENS.UPLOAD;
  const showResultsScreen = currentScreen === FLOW_SCREENS.RESULTS;

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="hero__eyebrow">How Old?</p>
        <h1>See how old people were when a photo was taken.</h1>
        <p>
          Add up to five people, queue up to five photos, and the app will read each capture date from
          image metadata locally in your browser. People are stored in browser localStorage so you can
          return later, while uploaded files stay in memory only.
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
            onContinue={handleContinueToResults}
            onRemovePhoto={handleRemovePhoto}
          />
        ) : null}

        {showResultsScreen ? (
          <ResultsScreen
            results={results}
            onReturnToUpload={handleReturnToUpload}
            onReturnToPeople={handleBackToPeople}
          />
        ) : null}
      </main>
    </div>
  );
}

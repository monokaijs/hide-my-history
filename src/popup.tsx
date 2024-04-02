import "@/styles/global.scss";
import "@/styles/popup.scss";
import {persistor, store, useAppDispatch, useAppSelector} from "~redux/store";
import {setIncognitoMode} from "~redux/slices/app.slice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faGear} from "@fortawesome/free-solid-svg-icons";
import {cn} from "~utils";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";

function PopupContent() {
  const {incognitoMode} = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();

  const toggleIncognito = () => dispatch(setIncognitoMode(!incognitoMode));
  const openSettings = () => chrome.runtime.openOptionsPage();

  return <div className={cn("popup-layout", incognitoMode ? "incognito" : '')}>
    <div className={'popup-content'}>
      <div className="flex flex-col">
        <span className="title">Hide My History</span>
        <span className="description">You're not in Incognito Mode. However, websites in whitelist will not be recorded in browser history.</span>
      </div>
      <div className={"flex flex-row gap-2"}>
        <button
          className="btn-toggle-incognito"
          onClick={toggleIncognito}
        >
          <FontAwesomeIcon icon={faEye} className={'mr-1'}/>
          {incognitoMode ? 'Disable' : 'Enable'} Incognito Mode
        </button>
        <button
          className="btn-settings"
          onClick={openSettings}
        >
          <FontAwesomeIcon icon={faGear}/>
        </button>
      </div>
    </div>
  </div>
}

function PopupPage() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <PopupContent/>
      </PersistGate>
    </Provider>
  )
}

export default PopupPage;

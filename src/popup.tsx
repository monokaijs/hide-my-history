import "@/styles/global.scss";
import "@/styles/popup.scss";
import styles from "@/styles/Popup.module.scss";
import PopupLayout from "@/components/layouts/PopupLayout";
import {Button} from "antd";
import {useAppDispatch, useAppSelector} from "~redux/store";
import {setIncognitoMode} from "~redux/slices/app.slice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, faGear, faKey} from "@fortawesome/free-solid-svg-icons";

function PopupContent() {
  const {incognitoMode} = useAppSelector(state => state.app);
  const {encryptedPrivateKey} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const toggleIncognito = () => dispatch(setIncognitoMode(!incognitoMode));
  const openSettings = () => chrome.runtime.openOptionsPage();

  return <div className={'flex-1 flex flex-col justify-between'}>
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
  </div>;
}

function PopupPage() {
  return (<PopupLayout>
    <PopupContent/>
  </PopupLayout>)
}

export default PopupPage;

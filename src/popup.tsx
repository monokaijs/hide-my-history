import "@/styles/popup.scss";
import styles from "@/styles/Popup.module.scss";
import PopupLayout from "@/components/layouts/PopupLayout";
import {Button} from "antd";
import {useAppDispatch, useAppSelector} from "~redux/store";
import {setIncognitoMode} from "~redux/slices/app.slice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, faGear} from "@fortawesome/free-solid-svg-icons";

function PopupContent() {
  const {incognitoMode} = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();
  return <div className={styles.pageContent}>
    <div className={styles.buttons}>
      <Button
        type={'primary'}
        className={styles.btnMode}
        icon={<FontAwesomeIcon icon={incognitoMode ? faEyeSlash : faEye}/>}
        onClick={() => {
          dispatch(setIncognitoMode(!incognitoMode));
        }}
      >
        {incognitoMode ? 'Disable Incognito Mode' : 'Enable Incognito Mode'}
      </Button>
      <Button
        onClick={() => {
          chrome.runtime.openOptionsPage();
        }}
        icon={<FontAwesomeIcon icon={faGear}/>}
      />
    </div>
  </div>;
}

function PopupPage() {
  return (<PopupLayout>
    <PopupContent/>
  </PopupLayout>)
}

export default PopupPage;

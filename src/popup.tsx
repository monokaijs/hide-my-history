import "@/styles/popup.scss";
import styles from "@/styles/Popup.module.scss";
import PopupLayout from "@/components/layouts/PopupLayout";
import {Button} from "antd";
import {SettingFilled} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "~redux/store";
import {setTheme} from "~redux/slices/app.slice";

function PopupContent() {
  const {theme} = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();
  return <div className={styles.pageContent}>
    <div className={styles.buttons}>
      <Button
        type={'primary'}
        className={styles.btnMode}
        onClick={() => {
          dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
        }}
      >
        Incognito Mode
      </Button>
      <Button
        type={'primary'}
        icon={<SettingFilled/>}
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

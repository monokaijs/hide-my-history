import styles from "./styles.module.scss";
import {ConfigProvider, Layout, theme, Typography} from "antd";
import type {ReactNode} from "react";
import {Provider} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {persistor, store, useAppSelector} from "~redux/store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock} from "@fortawesome/free-solid-svg-icons";
interface PopupLayoutProps {
  children?: ReactNode;
}

function PopupLayoutContent({children}: any) {
  const {incognitoMode} = useAppSelector(state => state.app);
  return <PersistGate persistor={persistor} loading={null}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#333333',
          fontFamily: 'Lexend Deca',
          fontSize: 14,
        },
        algorithm: incognitoMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout className={styles.popupLayout}>
        <FontAwesomeIcon icon={faLock} className={styles.lockIcon}/>
        <Typography.Title level={3} className={styles.title}>
          Hide My History
        </Typography.Title>
        <Typography.Text className={styles.description}>
          {incognitoMode && <>
            You're in Incognito Mode. No worries, browsing histories are not recorded.
          </>}
          {!incognitoMode && <>
            You're not in Incognito Mode.
          </>}
        </Typography.Text>
        <div className={styles.content}>
          {children}
        </div>
      </Layout>
    </ConfigProvider>
  </PersistGate>;
}

export default function PopupLayout({children}: PopupLayoutProps) {
  return <Provider store={store}>
    <PopupLayoutContent>
      {children}
    </PopupLayoutContent>
  </Provider>
}

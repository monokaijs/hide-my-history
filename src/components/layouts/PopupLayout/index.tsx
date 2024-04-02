import type {ReactNode} from "react";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {persistor, store, useAppSelector} from "~redux/store";
import {cn} from "~utils";

interface PopupLayoutProps {
  children?: ReactNode;
}

function PopupLayoutContent({children}: any) {
  const {incognitoMode} = useAppSelector(state => state.app);
  const {encryptedPrivateKey} = useAppSelector(state => state.auth);
  return <PersistGate persistor={persistor} loading={null}>
    <div
      className={cn("popup-layout", incognitoMode ? "incognito" : '')}
      style={{
        width: 400,
        height: 200,
        fontFamily: "'Lexend Deca', sans-serif",
      }}>
      {children}
    </div>
  </PersistGate>;
}

export default function PopupLayout({children}: PopupLayoutProps) {
  return <Provider store={store}>
    <PopupLayoutContent>
      {children}
    </PopupLayoutContent>
  </Provider>
}

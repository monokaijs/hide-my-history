import {Outlet} from "react-router";
import styles from "./styles.module.scss";
import {Card, ConfigProvider} from "antd";
import {store} from "~redux/store";
import { Provider } from "react-redux";

export default function AuthLayout() {
  return <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Lexend Deca',
          fontSize: 14,
        },
      }}
    >
    <div className={styles.authLayout}>
      <Card className={styles.authForm}>
        <Outlet/>
      </Card>
    </div>
    </ConfigProvider>
  </Provider>
}

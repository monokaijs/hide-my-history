import {Outlet} from "react-router";
import styles from "./styles.module.scss";
import {Card} from "antd";
import {store} from "~redux/store";
import { Provider } from "react-redux";

export default function AuthLayout() {
  return <Provider store={store}>
    <div className={styles.authLayout}>
      <Card className={styles.authForm}>
        <Outlet/>
      </Card>
    </div>
  </Provider>
}

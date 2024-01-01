import {Outlet} from "react-router";
import styles from "./styles.module.scss";
import {Card} from "antd";

export default function AuthLayout() {
  return <div className={styles.authLayout}>
    <Card className={styles.authForm}>
      <Outlet/>
    </Card>
  </div>
}

import {Outlet} from "react-router";
import {store} from "~redux/store";
import {Provider} from "react-redux";

export default function AuthLayout() {
  return <Provider store={store}>
    <div className={"auth-layout"}>
      <Outlet/>
    </div>
  </Provider>
}

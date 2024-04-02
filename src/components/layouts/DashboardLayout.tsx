import {persistor, store, useAppSelector} from "~redux/store";
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from "react-redux";
import {Outlet, useLocation, useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faGear, faHome, faInfoCircle, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";
import {cn} from "~utils";

const MenuItem = (props: { path: string, icon: IconDefinition, label: string }) => {
  const {pathname: currentRoute} = useLocation();
  const navigate = useNavigate();
  return <div className={cn('menu-item', currentRoute === props.path ? 'selected' : '')} onClick={() => {
    navigate(props.path);
  }}>
    <div className={'menu-icon'}>
      <FontAwesomeIcon icon={props.icon}/>
    </div>
    <div className={'menu-label'}>
      {props.label}
    </div>
  </div>
}

function DashboardLayoutContent({children}: any) {
  const {encryptedPrivateKey, loggedIn} = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!encryptedPrivateKey && !location.pathname.startsWith('/auth/setup-password')) {
      setTimeout(() => {
        navigate('/auth/setup-password');
      }, 100);
    }
    if (encryptedPrivateKey && !loggedIn) {
      setTimeout(() => {
        navigate('/auth/login');
      }, 100);
    }
  }, [encryptedPrivateKey]);

  return <PersistGate persistor={persistor} loading={null}>
    <div className={'dashboard-layout'}>
      <div className={'dashboard'}>
        <div className={'dashboard-menu'}>
          <div className={'upper-menu'}>
            <MenuItem
              path={'/'} icon={faHome} label={'Home'}
            />
            <MenuItem
              path={'/history'} icon={faClock} label={'History'}
            />
          </div>
          <div className={'bottom-menu'}>
            <MenuItem
              path={'/about'} icon={faInfoCircle} label={'About'}
            />
          </div>
        </div>
        <div className={'dashboard-content'}>
          {children}
        </div>
      </div>
    </div>
  </PersistGate>
}

export default function DashboardLayout() {
  return <Provider store={store}>
    <DashboardLayoutContent>
      <Outlet/>
    </DashboardLayoutContent>
  </Provider>
}

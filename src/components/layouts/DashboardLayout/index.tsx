import styles from "@/styles/Dashboard.module.scss";
import {ConfigProvider, Layout, Menu, theme} from "antd";
import {persistor, store, useAppSelector} from "~redux/store";
import { PersistGate } from "redux-persist/integration/react";
import {Provider} from "react-redux";
import {Outlet, useLocation, useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faHome} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";
import historyService from "~services/HistoryService";

function DashboardLayoutContent({children}: any) {
  const {encryptedPrivateKey, loggedIn} = useAppSelector(state => state.auth);
  const {
    token: {
      colorBgContainer
    }
  } = theme.useToken();
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

    historyService.register().then(() => {
      // Initialized
    })
  }, [encryptedPrivateKey]);

  return <PersistGate persistor={persistor} loading={null}>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Lexend Deca',
          fontSize: 14,
        },
      }}
    >
      <Layout className={styles.dashboard}>
        <Layout.Header
          className={styles.header}
          style={{
            backgroundColor: colorBgContainer
          }}
        >
          <div className={styles.logo}>
            Hide My History
          </div>
        </Layout.Header>
        <Layout>
          <Layout.Sider className={styles.sider}>
            <Menu
              className={styles.menu}
              items={[{
                key: 'home',
                icon: <FontAwesomeIcon icon={faHome}/>,
                label: <>Home</>,
                onClick: () => navigate('/home'),
              }, {
                key: 'history',
                icon: <FontAwesomeIcon icon={faClock}/>,
                label: <>History</>,
                onClick: () => navigate('/history'),
              }]}
            />
          </Layout.Sider>
          <Layout.Content className={styles.content}>
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  </PersistGate>
}

export default function DashboardLayout() {
  return <Provider store={store}>
    <DashboardLayoutContent>
      <Outlet/>
    </DashboardLayoutContent>
  </Provider>
}

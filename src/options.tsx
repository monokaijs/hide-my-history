import "@/styles/global.scss";
import '@/styles/options.scss';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import HomePage from "@/views/Home";
import HistoryPage from "@/views/History";
import AuthLayout from "~components/layouts/AuthLayout";
import LoginPage from "~views/Auth/Login";
import SetupPasswordPage from "~views/Auth/SetupPassword";

export default function OptionsPage() {
  return <HashRouter>
    <Routes>
      <Route path={'/'} element={<DashboardLayout/>}>
        <Route index element={<HomePage/>}/>
        <Route path={'history'} element={<HistoryPage/>}/>
        <Route path={'*'} element={<Navigate to={'/'}/>}/>
      </Route>
      <Route path={'/auth'} element={<AuthLayout/>}>
        <Route index element={<Navigate to={'/auth/login'}/>}/>
        <Route path={'login'} element={<LoginPage/>}/>
        <Route path={'setup-password'} element={<SetupPasswordPage/>}/>
        <Route path={'*'} element={<Navigate to={'/auth/login'}/>}/>
      </Route>
      <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
    </Routes>
  </HashRouter>
}

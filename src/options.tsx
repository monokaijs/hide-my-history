import '@/styles/dashboard.scss';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import HomePage from "@/views/Home";
import HistoryPage from "@/views/History";
import AuthLayout from "~components/layouts/AuthLayout";
import LoginPage from "~views/Auth/Login";

export default function OptionsPage() {
  return <HashRouter>
    <Routes>
      <Route path={'/'} element={<DashboardLayout/>}>
        <Route index element={<HomePage/>}/>
        <Route path={'history'} element={<HistoryPage/>}/>
        <Route path={'*'} element={<Navigate to={'/'}/>}/>
      </Route>
      <Route path={'/auth'} element={<AuthLayout/>}>
        <Route index element={<LoginPage/>}/>
        <Route path={'*'} element={<Navigate to={'/auth'}/>}/>
      </Route>
      <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
    </Routes>
  </HashRouter>
}

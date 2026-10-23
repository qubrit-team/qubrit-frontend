import { useCallback, useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import ClassroomPage from "./pages/ClassroomPage";
import SearchPage from "./pages/SearchPage";
import CreatePage from "./pages/CreatePage";
import MyPage from "./pages/MyPage";
import SetDetailPage from "./pages/SetDetailPage";
import SolvePage from "./pages/SolvePage";
import { getToken } from "./api/http";

const PAGES = {
  login: LoginPage,
  signup: SignupPage,
  forgot: ForgotPasswordPage,
  home: HomePage,
  classroom: ClassroomPage,
  search: SearchPage,
  create: CreatePage,
  my: MyPage,
  setDetail: SetDetailPage,
  solve: SolvePage,
};

function App() {
  const [route, setRoute] = useState(() => ({
    page: getToken() ? "home" : "login",
    params: {},
  }));
  const navigate = useCallback(
    (page, params = {}) => setRoute({ page, params }),
    [],
  );
  const Page = PAGES[route.page];
  return <Page onNavigate={navigate} params={route.params} />;
}

export default App;

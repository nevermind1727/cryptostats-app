import { useEffect } from "react";
import { useGetUserQuery } from "./apis/usersApi";
import { useAppDispatch } from "./app/hooks";
import { setAuthState } from "./app/slices/authSlice";
import "./index.css";
import Routes from "./routes/Routes";
import { useNavigate } from "react-router";

function App() {
  const { data: user } = useGetUserQuery(undefined);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(setAuthState(user));
      navigate("/");
    }
  }, [dispatch, navigate, user]);
  return <Routes />;
}

export default App;

import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import { Navigate } from "react-router-dom";
import { UserResponse } from "../utils/types";

const ProtectedRoute: React.FC<any> = ({ children }) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  console.log(user);
  return user ? children : <Navigate to="/auth/login" />;
};
export default ProtectedRoute;

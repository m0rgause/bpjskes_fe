import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

export function PrivateRoute({ children, ...rest }) {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        {...rest}
        element={user ? children : <Navigate to="/auth/signin" />}
      />
    </Routes>
  );
}

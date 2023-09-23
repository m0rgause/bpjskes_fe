import { Routes, Route, useMatch } from "react-router-dom";

import { SignIn } from "../views/auth/signIn";

export function AuthRoute() {
  const match = useMatch("/auth/*");
  if (!match) return null;

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

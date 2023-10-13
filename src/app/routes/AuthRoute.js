import { Routes, Route, useMatch } from "react-router-dom";

import { SignIn } from "../views/auth/signIn";
import { PassForgot } from "../views/auth/forgotPass";
import { PassReset } from "../views/auth/resetPass";

export function AuthRoute() {
  const match = useMatch("/auth/*");
  if (!match) return null;

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgotpass" element={<PassForgot />} />
      <Route path="/passreset" element={<PassReset />} />
    </Routes>
  );
}

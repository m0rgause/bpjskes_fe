import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./app/context/Auth";
import { AuthRoute } from "./app/routes/AuthRoute";
import { PrivateRoute } from "./app/routes/PrivateRoute";
import { AppLayout } from "./app/layout/AppLayout";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/auth/*" Component={AuthRoute} />
            <Route
              path="*"
              element={
                <PrivateRoute path="*">
                  <AppLayout />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

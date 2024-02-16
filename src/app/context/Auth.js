import React, { useContext, useState, useEffect } from "react";
import { notification } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { post } from "../functions/helper";
import QueryString from "qs";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const location = useLocation();
  const history = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session) {
      setTimeout(() => {
        localStorage.removeItem("session");
        setUser(null);
        notification.error({
          message: "Sesi anda telah berakhir, silahkan login kembali",
          placement: "top",
          duration: 2,
        });
        history("/auth/signin");
      }, session?.exp * 1000 - Date.now());
    }
    setUser(session?.user ?? null);
    setLoading(false);
    if (session !== null) {
      checkAuth(session);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async (session) => {
    let email = session?.user?.email;
    let send = QueryString.stringify({
      email: email,
      path: location.pathname,
      token: session?.token,
    });
    await post("/user/checkauth", send)
      .then(({ data }) => {
        if (data.code === 401) {
          history(data.landing);
        }
      })
      .catch((error) => {
        localStorage.removeItem("session");
        setUser(null);
        notification.error({
          message: "Sesi anda telah berakhir, silahkan login kembali",
          placement: "top",
          duration: 2,
        });
        history("/auth/signin");
        // if (error.response.status === 401) {
        //   localStorage.removeItem("session");
        //   setUser(null);
        //   notification.error({
        //     message: "Sesi anda telah berakhir, silahkan login kembali",
        //     placement: "top",
        //     duration: 2,
        //   });
        //   history("/auth/signin");
        // }
      });
  };

  const signIn = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
      const send = QueryString.stringify({
        email,
        password,
        path: location.pathname,
      });
      await post("/user/signin", send)
        .then(({ data }) => {
          if (data.code === 200) {
            let user = data.data;
            localStorage.setItem("session", JSON.stringify(user));
            setUser(user?.user);
            resolve(user);
          } else {
            reject(data.error);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

  const signOut = () => {
    localStorage.removeItem("session");
    setUser(null);
    notification.success({
      message: "Berhasil keluar dari aplikasi",
      placement: "top",
      duration: 2,
    });
    history("/auth/signin");
  };

  const value = {
    user,
    signIn: ({ email, password }) => signIn({ email, password }),
    signOut: () => signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

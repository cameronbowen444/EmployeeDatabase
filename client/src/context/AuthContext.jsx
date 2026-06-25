import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = "https://employeedatabase-d9cz.onrender.com/api";
const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const inactivityTimer = useRef(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (!user) {
      clearTimeout(inactivityTimer.current);
      return;
    }

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer.current);

      inactivityTimer.current = setTimeout(() => {
        logoutUser(true);
      }, INACTIVITY_LIMIT);
    };

    resetInactivityTimer();

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    return () => {
      clearTimeout(inactivityTimer.current);

      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [user]);

  const checkUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = async (timedOut = false) => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      clearTimeout(inactivityTimer.current);
      setUser(null);

      if (timedOut) {
        window.location.href = "/login?timeout=true";
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        loginUser,
        logoutUser,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
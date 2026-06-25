import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Navbar from "./Components/Navbar";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Display from "./Pages/Display";
import MemberForm from "./Pages/MemberForm";
import Update from "./Pages/Update";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Navbar />

          <main className="mx-auto w-full max-w-6xl px-4 py-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Display />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/new"
                element={
                  <ProtectedRoute>
                    <MemberForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <Update />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
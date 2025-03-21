import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../css/Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {isLogin ? (
          <Login toggleView={() => setIsLogin(false)} />
        ) : (
          <Register toggleView={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

export default Auth;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <span className="logo">Andrew Chat</span>
        <span className="title">Вход</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Пароль" />
          <button type="submit">Вход</button>
          {err && <span>Попробуйте в другой раз</span>}
        </form>
        <p>
          У вас нет аккаунта? <Link to="/register">Зарегистрироваться?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

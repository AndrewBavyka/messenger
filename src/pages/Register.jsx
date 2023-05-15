import React, { useState } from "react";
import Add from "../img/addAvatar.png";

import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const form = e.target;

    if (!form.checkValidity()) {
      setErr(true);
      setLoading(false);
      return;
    }

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});

            navigate("/");
          });
        }
      );
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <span className="logo">Andrew Chat</span>
        <span className="title">Регистрация</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Ваше имя" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Пароль" />
          <input
            required
            className="input-file"
            type="file"
            id="file"
            name="file"
          />
          <label htmlFor="file">
            <img src={Add} alt="add-img" />
            <span>Добавить аватар</span>
          </label>
          <button disabled={loading} type="submit">
            Регистрация
          </button>
          {loading && <span className="reg-info">Загрузка изображения пожалуйста подождите...</span>}
          {err && <span className="reg-info">Что-то пошло не так</span>}
        </form>
        <p>
          Уже есть аккаунт? <Link to="/login">Войти?</Link>
        </p>
      </div>
    </div>
  );
}

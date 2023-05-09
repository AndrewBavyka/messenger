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
          <input type="text" placeholder="Ваше имя" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Пароль" />
          <input className="input-file" type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="add-img" />
            <span>Добавить аватар</span>
          </label>
          <button disabled={loading} type="submit">
            Регистрация
          </button>
          {loading && "Загрузка изображения пожалуйста подождите..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Уже есть аккаунт? <Link to="/login">Войти?</Link>
        </p>
      </div>
    </div>
  );
}

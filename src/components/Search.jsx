import React, { useContext, useState } from "react";
import {
  collection,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const userQuery = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) {
        setUser(null);
        setErr(true); // устанавливаем значение err в true
      } else {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
          setErr(false); // если пользователь найден, устанавливаем значение err в false
        });
      }
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //проверяем существует ли группа(чаты в firestore), если нет - создаем
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
      alert("Произошла ошибка. Попробуйте еще раз позже.");
      return;
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="search-form">
        <input
          type="text"
          placeholder="Поиск"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span className="err-search">Пользователь не найден!</span>}

      {user && (
        <div className="user-chat" onClick={handleSelect}>
          <img src={user.photoURL} alt="user-img" />
          <div className="user-chat__info">
            <span>{user.displayName}</span>
            <p>Привет</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;

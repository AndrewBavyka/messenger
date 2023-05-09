import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Andrew Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="user-img" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Выход</button>
      </div>
    </div>
  );
}

export default Navbar;

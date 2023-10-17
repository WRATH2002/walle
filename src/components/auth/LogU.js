// import logo from "../assets/img/logo.png";
// import wal from "../assets/img/bg.jpg";
import { useState } from "react";
// import { auth } from "../../firebase";
import { auth } from "../../firebase";
// import { Auth } from "firebase/auth";

import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { createUserWithEmailAndPassword } from "firebase/auth";

const LogU = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toggleMode, setToggleMode] = useState(true);

  function toggle() {
    var x = document.getElementById("passtwo");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  const signU = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <form onSubmit={signU}>
        <span className="">Signup </span>

        <input
          placeholder="Enter email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>

        <input
          placeholder="Enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          //   id="passtwo"
        ></input>
      </form>
      <button type="submit" onClick={signU}>
        Sign Up
      </button>
    </>
  );
};

export default LogU;

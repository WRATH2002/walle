// import logo from "../assets/img/logo.png";
// import wal from "../assets/img/bg.jpg";
import { useState } from "react";
// import { auth } from "../../firebase";
import { auth } from "../../firebase";
// import { Auth } from "firebase/auth";

import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { signInWithEmailAndPassword } from "firebase/auth";

const LogI = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [toggleMode, setToggleMode] = useState(true);

  function toggle() {
    var x = document.getElementById("passtwo");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  const signI = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div>
        <form onSubmit={signI}>
          <span className="">Log IN </span>

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
            // id="passtwo"
          ></input>
        </form>

        <button type="submit" onClick={signI}>
          Log in
        </button>
      </div>
    </>
  );
};

export default LogI;

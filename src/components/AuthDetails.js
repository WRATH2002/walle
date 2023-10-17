import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import Body from "./Body";
// import LogI from "./auth/LogI";
import { toggleStateMode } from "../utils/chatSlice";
import Login from "./auth/Login";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./auth/Signup";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const dispatch = useDispatch();
  const mode = useSelector((store) => store.chat.signingMode);
  console.log(mode);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else setAuthUser(null);
    });
    return () => {
      listen();
    };
  }, []);

  //   const userSignOut = () => {
  //     signOut(auth)
  //       .then(() => console.log("Signed Out Successfully"))
  //       .catch((error) => console.log(error));
  //   };
  return (
    <>
      {authUser ? (
        <>
          <Body />
        </>
      ) : (
        <>{mode === 1 ? <Login /> : <Signup />}</>
      )}
      {/* <button onClick={userSignOut}>signOut</button> */}
    </>
  );
};

export default AuthDetails;

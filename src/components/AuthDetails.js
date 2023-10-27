import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import Body from "./Body";
// import LogI from "./auth/LogI";
import { toggleStateMode } from "../utils/chatSlice";
import Login from "./auth/Login";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./auth/Signup";
import Loader from "./Loader";

const Loading = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Creating a timeout within the useEffect hook
    const timer = setTimeout(() => {
      // setData("Welcome to gfg!");
      setIsLoading(false);
      return () => clearTimeout(timer);
    }, 2500);
  }, []);
  return (
    <>
      {isLoading === true ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <Body />
        </>
      )}
    </>
  );
};

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
          <Loading />
        </>
      ) : (
        <>{mode === 1 ? <Login /> : <Signup />}</>
      )}
      {/* <button onClick={userSignOut}>signOut</button> */}
    </>
  );
};

export default AuthDetails;

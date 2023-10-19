// import logo from "../assets/img/logo.png";
// import wal from "../assets/img/bg.jpg";
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
// import { Auth } from "firebase/auth";

import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { toggleStateMode, toggleDarkMode } from "../../utils/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase";
// import { createUserCollection } from "../../firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [user, setUser] = useState("");

  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const darkmode = useSelector((store) => store.chat.darkMode);
  const [toggleMode, setToggleMode] = useState(darkmode);
  // setToggleMode(darkmode);
  console.log(darkmode);
  useEffect(() => {
    setToggleMode(darkmode);
  }, [darkmode]);

  function changeDarkModeTwo() {
    if (darkmode === 1) {
      dispatch(toggleDarkMode(2));
    } else if (darkmode === 2) {
      dispatch(toggleDarkMode(1));
    }
  }

  function changeModeTwo() {
    dispatch(toggleStateMode(1));
  }

  function toggle() {
    var x = document.getElementById("passtwo");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  function createUserCollection(user) {
    db.collection("users")
      .doc(user.uid)
      .set({
        // id: user.uid,
        // // name: user,
        // email: user.email,
        uid: [{ user: "Question", assistant: "Answer", id: 1 }],
        // message: "smdvsdk",
      });
    console.log("done");
  }

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password, user)
      .then((userCredential) => {
        console.log(userCredential.user.uid);
        console.log(userCredential.user.email);
        console.log(userCredential);
        createUserCollection(userCredential.user);
        // db.collection("users")
        //   .doc(userCredential.user.uid)
        //   .set({
        //     email: userCredential.user.email,
        //     chats: ["hello"],
        //   });
      })
      .catch(
        (error) => {
          console.log(error.message);
        }
        // document.getElementById("signupError").innerHTML = error}
      );
  };

  function checkEmail() {
    // var e = email.includes("@gmail.com");
    // console.log(e);
    if (email === "") {
    } else if (email.includes("@gmail.com") === true) {
      console.log("no");
      document.getElementById("signupError").innerHTML = "";
    } else {
      document.getElementById("signupError").innerHTML = "Enter valid email";
    }
  }
  function checkPassword() {
    if (password === "") {
    } else if (password.length >= 6) {
      document.getElementById("signupError").innerHTML = "";
    } else {
      document.getElementById("signupError").innerHTML =
        "Enter atleast 6 characters";
    }
  }
  return (
    <>
      {toggleMode === 2 ? (
        <div
          className="walpaper w-full h-[100vh] bg-[#141627] flex justify-center items-center"
          style={{ transition: ".5s" }}
        >
          <div
            className="w-[300px] lg:w-[350px] md:w-[350px] rounded-lg h-[70%] bg-[#1c1f37] text-white font-semibold font-[nunitosans] p-[30px] flex flex-col justify-center"
            style={{ transition: ".5s" }}
            onSubmit={signUp}
          >
            <div className="w-full flex justify-end items-center">
              {toggleMode === 2 ? (
                <>
                  <div
                    className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#252a43] cursor-pointer mb-[-50px]"
                    onClick={() => changeDarkModeTwo()}
                  >
                    <div
                      className="w-[16px] h-[16px] ml-[20px] bg-[#5841d9] rounded-full drop-shadow-lg"
                      style={{ transition: ".5s" }}
                    ></div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#e4e6ec] cursor-pointer mb-[-50px]"
                    onClick={() => changeDarkModeTwo()}
                  >
                    <div
                      className="w-[16px] h-[16px] ml-[4px] bg-[white] rounded-full drop-shadow-lg"
                      style={{ transition: ".5s" }}
                      // onClick={() => setToggleMode(!toggleMode)}
                    ></div>
                  </div>
                </>
              )}
            </div>

            <span className="text-[32px] ">Signup </span>
            <span className="text-[14px] font-normal font-[nunitosans] ">
              old to <span className="">walle</span>,{" "}
              <span
                className="text-[#7761f2] hover:text-[#9a8af5] cursor-pointer"
                style={{ transition: ".3s" }}
                onClick={() => changeModeTwo()}
              >
                {" "}
                login to your account
              </span>
            </span>
            {/* <div className="w-full flex justify-between">
              <input
                placeholder="First name"
                className="outline-none w-[46%] h-[40px] my-[10px] mt-[30px] rounded-md px-[15px] font-normal text-[14px] text-black"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
              <input
                placeholder="Last name"
                className="outline-none w-[46%] h-[40px] my-[10px] mt-[30px] rounded-md px-[15px] font-normal text-[14px] text-black"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
            </div> */}
            {/* <input
              placeholder="Enter email"
              className="outline-none mt-[30px]    w-full h-[40px] my-[10px] rounded-md px-[15px] font-normal text-[14px] text-black"
              type="text"
              value={user}
              // onFocus={checkEmail()}
              onChange={(e) => {
                // checkEmail();
                setUser(e.target.value);
                // checkEmail();
              }}
            ></input> */}
            <input
              placeholder="Enter email"
              className="outline-none mt-[30px]    w-full h-[40px] my-[10px] rounded-md px-[15px] font-normal text-[14px] text-black"
              type="email"
              value={email}
              onFocus={checkEmail()}
              onChange={(e) => {
                // checkEmail();
                setEmail(e.target.value);
                // checkEmail();
              }}
            ></input>
            <div className="w-full flex justify-center items-center">
              <input
                placeholder="Enter password"
                className="outline-none w-full h-[40px] my-[10px] rounded-md px-[15px] font-normal text-[14px] text-black"
                type="password"
                value={password}
                onFocus={checkPassword()}
                onChange={(e) => setPassword(e.target.value)}
                id="passtwo"
              ></input>
              <div
                className="text-black mr-[10px] ml-[-30px] w-[20px]"
                onClick={() => {
                  toggle();
                  setShowPassword(!showPassword);
                }}
                style={{ zIndex: "4" }}
              >
                {showPassword === true ? (
                  <>
                    <AiOutlineEyeInvisible className=" text-[19px] text-[#5841d9]" />
                  </>
                ) : (
                  <>
                    <AiOutlineEye className=" text-[19px] text-[#5841d9]" />
                  </>
                )}
              </div>
            </div>
            <span
              id="signupError"
              className="w-full h-[20px]  font-normal text-[14px] mt-[5px]  flex justify-end cursor-pointer text-[#e75348]"
            ></span>
            {/* <span className="w-full font-normal text-[14px] mt-[5px]  flex justify-end cursor-pointer text-[#e79848]">
            forgot password ?
          </span> */}
            {/* <span id="show" onClick={myFunction}>
            click
          </span> */}
            <button
              className="w-full h-[40px] outline-none flex justify-center items-center bg-[#5841d9] hover:bg-[#9a8af5] rounded-md mt-[30px]"
              style={{ transition: ".3s" }}
              type="submit"
              onClick={signUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : (
        <div
          className="walpaper w-full h-[100vh] bg-[white] flex justify-center items-center"
          style={{ transition: ".5s" }}
        >
          <div
            className="w-[300px]  rounded-lg lg:w-[350px] md:w-[350px] h-[70%] bg-[#f8fafc] text-black font-semibold font-[nunitosans] p-[30px] flex flex-col justify-center"
            style={{ transition: ".5s" }}
            onSubmit={signUp}
          >
            <div
              className="w-full flex justify-end items-center"
              style={{ zIndex: "4" }}
            >
              {toggleMode === 2 ? (
                <>
                  <div
                    className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#252a43] cursor-pointer mb-[-50px]"
                    onClick={() => changeDarkModeTwo()}
                  >
                    <div
                      className="w-[16px] h-[16px] ml-[20px] bg-[#5841d9] rounded-full drop-shadow-lg"
                      style={{ transition: ".5s" }}
                    ></div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#e4e6ec] cursor-pointer mb-[-50px]"
                    onClick={() => changeDarkModeTwo()}
                  >
                    <div
                      className="w-[16px] h-[16px] ml-[4px] bg-[white] rounded-full drop-shadow-lg"
                      style={{ transition: ".5s" }}
                      // onClick={() => setToggleMode(!toggleMode)}
                    ></div>
                  </div>
                </>
              )}
            </div>

            <span className="text-[32px] drop-shadow-md ">Signup </span>
            <span className="text-[14px] font-normal font-[nunitosans] drop-shadow-md  ">
              old to <span className="">walle</span>,{" "}
              <span
                className="text-[#7761f2] hover:text-[#9a8af5] cursor-pointer drop-shadow-md "
                style={{ transition: ".3s" }}
                onClick={() => changeModeTwo()}
              >
                {" "}
                login to your account
              </span>
            </span>
            {/* <div className="w-full flex justify-between">
              <input
                placeholder="First name"
                className="outline-none w-[46%] h-[40px] my-[10px] mt-[30px] rounded-md px-[15px] font-normal text-[14px] text-black"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
              <input
                placeholder="Last name"
                className="outline-none w-[46%] h-[40px] my-[10px] mt-[30px] rounded-md px-[15px] font-normal text-[14px] text-black"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
            </div> */}
            <input
              placeholder="Enter email"
              className="outline-none w-full mt-[30px] h-[40px] my-[10px] rounded-md px-[15px] font-normal text-[14px] text-black"
              type="email"
              value={email}
              onFocus={checkEmail()}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <div className="w-full flex justify-center items-center">
              <input
                placeholder="Enter password"
                className="outline-none drop-shadow-sm  bg-[white] w-full h-[40px] my-[10px] rounded-md px-[15px] font-normal text-[14px] text-black"
                type="password"
                value={password}
                onFocus={checkPassword()}
                onChange={(e) => setPassword(e.target.value)}
                id="passtwo"
              ></input>
              <div
                className="text-black mr-[10px] ml-[-30px] w-[20px]"
                onClick={() => {
                  toggle();
                  setShowPassword(!showPassword);
                }}
                style={{ zIndex: "4" }}
              >
                {showPassword === true ? (
                  <>
                    <AiOutlineEyeInvisible className=" text-[19px] text-[#5841d9]" />
                  </>
                ) : (
                  <>
                    <AiOutlineEye className=" text-[19px] text-[#5841d9]" />
                  </>
                )}
              </div>
            </div>
            <span
              id="signupError"
              className="w-full h-[20px]  font-normal text-[14px] mt-[5px]  flex justify-end cursor-pointer text-[#e75348]"
            ></span>
            {/* <span className="w-full font-normal text-[14px] mt-[5px]  flex justify-end cursor-pointer text-[#e79848]">
            forgot password ?
          </span> */}
            {/* <span id="show" onClick={myFunction}>
            click
          </span> */}
            <button
              className="w-full h-[40px] text-white drop-shadow-msm  outline-none flex justify-center items-center bg-[#5841d9] hover:bg-[#9a8af5] rounded-md mt-[30px]"
              style={{ transition: ".3s" }}
              type="submit"
              onClick={signUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;

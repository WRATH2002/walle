// import logo from "../assets/img/logo.png";
// import wal from "../assets/img/bg.jpg";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { toggleStateMode, toggleDarkMode } from "../../utils/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase";
import { addMessage } from "../../utils/chatSlice";

const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const darkmode = useSelector((store) => store.chat.darkMode);
  const [toggleMode, setToggleMode] = useState(darkmode);

  const [prevChat, setPrevChat] = useState([]);
  const [userId, serUserId] = useState("");
  // setToggleMode(darkmode);
  console.log(darkmode);
  useEffect(() => {
    setToggleMode(darkmode);
  }, [darkmode]);

  useEffect(() => {
    console.log(prevChat);
  }, []);

  function changeDarkMode() {
    if (darkmode === 1) {
      dispatch(toggleDarkMode(2));
    } else if (darkmode === 2) {
      dispatch(toggleDarkMode(1));
    }
  }

  function changeMode() {
    dispatch(toggleStateMode(2));
  }

  function myFunction() {
    var x = document.getElementById("pass");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  function storePrevChat() {
    prevChat.map((chat, index) => {
      // const user = chat.user;
      // const assistant = chat.assistant;
      console.log(chat[index].user);
      dispatch(
        addMessage({ user: chat[index].user, assistant: chat[index].assistant })
      );
    });
  }

  async function getUserChatHistoy(user) {
    const userInfoSnap = await db
      .collection("users")
      .doc(user.uid)
      .get()
      .then((userInfoSnap) => {
        // .then((user) => {
        //   // if (user.length > 0) {
        //   //   // console.log(doc.data());
        //   //   // console.log(doc);
        //   //   // setPrevChat(doc.data());
        //   //   user.forEach((doc) => {
        //   //     setPrevChat((prev) => {
        //   //       return [...prev, doc.data()];
        //   //     });
        //   //   });
        //   // }
        //   console.log(user);
        // });
        // console.log(prevChat);
        const userInfo = userInfoSnap.data();
        if (userInfo) {
          console.log(userInfoSnap);
          console.log(userInfo.uid);

          setPrevChat(userInfo.uid[0]);
          console.log(userInfo.uid[0]);
          console.log(userInfo.uid[0].user);
          console.log(userInfo.uid[1].user);
          serUserId(userInfo.uid[0].user);
          console.log(userId);
          console.log(prevChat);
        }
      });
    // userInfo.map((chat, index) => {
    //   // const user = chat.user;
    //   // const assistant = chat.assistant;
    //   console.log(chat[index].user);
    //   dispatch(
    //     addMessage({ user: chat[index].user, assistant: chat[index].assistant })
    //   );
    // });
    // setPrevChat(userInfo);
  }

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        // userCredential.user.forEach((us) => {
        //   serUserId((prev) => {
        //     return [prev.uid];
        //   });
        // });
        // -------------------
        // serUserId(userCredential.user.uid);
        // console.log("id");
        // console.log(userCredential.user.uid);
        // console.log(userId);
        // getUserChatHistoy(userCredential.user);

        // storePrevChat();
        // console.log("prevchat");
        // console.log(prevChat);
      })
      .catch((error) => {
        document.getElementById("signinErrorWhite").innerHTML =
          "Invalid login credentials";
      });
  };

  const chatMessage = useSelector((store) => store.chat.messages);
  console.log("storechat");
  console.log(chatMessage);

  return (
    <>
      {toggleMode === 2 ? (
        <div
          className="walpaper w-full h-[100vh] bg-[#141627] flex justify-center items-center"
          style={{ transition: ".5s" }}
        >
          <div
            className="w-[300px] lg:w-[350px] md:w-[350px] h-[70%] rounded-lg bg-[#1c1f37] text-white font-semibold font-[nunitosans] p-[30px] flex flex-col justify-center"
            style={{ transition: ".5s" }}
            onSubmit={signIn}
          >
            <div className="w-full flex justify-end items-center">
              {toggleMode === 2 ? (
                <>
                  <div
                    className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#252a43] cursor-pointer mb-[-50px]"
                    onClick={() => changeDarkMode()}
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
                    onClick={() => changeDarkMode()}
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
            <span className="text-[32px] ">Login </span>
            <span className="text-[14px] font-normal font-[nunitosans] ">
              new to <span className="">walle</span>,{" "}
              <span
                className="text-[#7761f2] hover:text-[#9a8af5] cursor-pointer"
                style={{ transition: ".3s" }}
                onClick={() => changeMode()}
              >
                {" "}
                create an account
              </span>
            </span>
            <input
              placeholder="Enter email"
              className="outline-none w-full h-[40px] my-[10px] mt-[30px] rounded-md px-[15px] font-normal text-[14px] text-black"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <div className="w-full flex justify-center items-center">
              <input
                placeholder="Enter password"
                className="outline-none w-full h-[40px] my-[10px] rounded-md px-[15px] font-normal text-[14px] text-black"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="pass"
              ></input>
              <div
                className="text-black mr-[10px] ml-[-30px] w-[20px]"
                onClick={() => {
                  myFunction();
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
              id="signinErrorWhite"
              className="w-full h-[20px] font-normal text-[14px] mt-[5px]  flex justify-end cursor-pointer text-[#e75348]"
            ></span>
            {/* <span id="show" onClick={myFunction}>
            click
          </span> */}
            <button
              className="w-full h-[40px] outline-none flex justify-center items-center bg-[#5841d9] hover:bg-[#9a8af5] rounded-md mt-[30px]"
              style={{ transition: ".3s" }}
              type="submit"
              onClick={signIn}
            >
              Log In
            </button>
          </div>
        </div>
      ) : (
        <div
          className="walpaper w-full h-[100vh] bg-[white] flex justify-center items-center"
          style={{ transition: ".5s" }}
        >
          <div
            className="w-[300px] lg:w-[350px] md:w-[350px] h-[70%] rounded-lg drop-shadow-sm bg-[#f8fafc] text-black font-semibold font-[nunitosans] p-[30px] flex flex-col justify-center"
            style={{ transition: ".5s" }}
            onSubmit={signIn}
          >
            <div
              className="w-full flex justify-end items-center"
              style={{ zIndex: "6" }}
            >
              {toggleMode === 2 ? (
                <>
                  <div
                    className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#252a43] cursor-pointer mb-[-50px]"
                    onClick={() => changeDarkMode()}
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
                    onClick={() => changeDarkMode()}
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
            <span className="text-[32px]  drop-shadow-lg">Login </span>
            <span className="text-[14px] font-normal font-[nunitosans]  drop-shadow-lg">
              new to <span className="">walle</span>,{" "}
              <span
                className="text-[#7761f2] hover:text-[#9a8af5] cursor-pointer drop-shadow-lg"
                style={{ transition: ".3s" }}
                onClick={() => changeMode()}
              >
                {" "}
                create an account
              </span>
            </span>
            <input
              placeholder="Enter email"
              className="outline-none drop-shadow-sm w-full h-[40px] my-[10px] mt-[30px] rounded-md px-[15px] font-normal text-[14px] text-black"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <div className="w-full flex justify-center items-center">
              <input
                placeholder="Enter password"
                className="outline-none drop-shadow-sm w-full h-[40px] my-[10px] rounded-md px-[15px] font-normal text-[14px] text-black"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="pass"
              ></input>
              <div
                className="text-black mr-[10px] ml-[-30px] w-[20px]"
                onClick={() => {
                  myFunction();
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
              id="signinErrorWhite"
              className="w-full h-[20px] font-normal text-[14px] mt-[5px]  flex justify-end cursor-pointer text-[#e75348]"
            ></span>
            {/* <span id="show" onClick={myFunction}>
            click
          </span> */}
            <button
              className="w-full drop-shadow-lg h-[40px] text-white outline-none flex justify-center items-center bg-[#5841d9] hover:bg-[#9a8af5] rounded-md mt-[30px]"
              style={{ transition: ".3s" }}
              type="submit"
              onClick={signIn}
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;

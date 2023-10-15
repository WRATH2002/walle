import { IoMdSend } from "react-icons/io";
import { FiSidebar } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { BiSolidMicrophone } from "react-icons/bi";

import ai from "../assets/img/gpt.jpg";
import logo from "../assets/img/logo.png";

import eight from "../assets/img/8.jpg";
import one from "../assets/img/1.jpg";
import two from "../assets/img/2.jpg";
import three from "../assets/img/3.jpg";
import four from "../assets/img/4.jpg";
import five from "../assets/img/5.jpg";
import six from "../assets/img/6.jpg";
import seven from "../assets/img/7.jpg";
import nine from "../assets/img/9.jpg";
// import ten from "../assets/img/10.jpg";
import eleven from "../assets/img/11.jpg";
import twelve from "../assets/img/12.jpg";
import thirteen from "../assets/img/13.jpg";

import { messageges } from "../utils/constants";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, addAnswer } from "../utils/chatSlice";
import { sendMessageToOpenAI } from "./Openai";
// import { IMG_ID } from "../utils/constants";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { API_KEY } from "../utils/constants";
// import "dotenv/config";
// require("dotenv").config({ path: "../../.env" });

const IMG_ID = [
  { id: one },
  { id: two },
  { id: three },
  { id: four },
  { id: five },
  { id: six },
  { id: seven },
  { id: eight },
  { id: nine },
  // { id: ten },
  { id: eleven },
  { id: twelve },
  { id: thirteen },
];

const Body = () => {
  const [input, setInput] = useState("");
  const [tempInput, setTempInput] = useState("");
  const [result, setResult] = useState("");
  const [avatar, setAvatar] = useState(false);
  const [selectAvatar, setSelectAvatar] = useState(one);

  const [id, setId] = useState(1);

  const scrollToLast = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // console.log(process.env);

  // const [store, setStore] = useState({
  //   tempInput: "message",
  //   message: "hello world",
  // });

  // console.log(store);

  // console.log(store);

  const [isSidebar, setIsSidebar] = useState(true);

  const dispatch = useDispatch();
  //   const [liveChat, setLiveChat] = useState([]);
  const chatMessage = useSelector((store) => store.chat.messages);
  console.log(chatMessage);

  useEffect(() => {
    setAns();
    // setResult("");
    setInput("");
  }, [result]);

  useEffect(() => {
    scrollToLast.current?.scrollIntoView();
  }, [input, result]);

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  // function storeMessage() {
  //   // setId(id + 1);
  //   // setStore(store + { tempInput: "2nd", message: "2nd message" });
  //   // if (input === "") {
  //   // } else {
  //   // setTempInput(input);
  //   // setInput("");
  //   dispatch(addMessage({ user: input, id: id, assistant: tempInput }));
  //   // setInput("");
  //   dispatch(addAnswer({ id, input }));

  //   // }
  // }

  const handleSend = async () => {
    // var hello = tempInput;
    // sendMessageToOpenAI(hello);
    if (input === "") {
    } else {
      dispatch(addMessage({ user: input, id: id, assistant: tempInput }));
    }
    const res = await sendMessageToOpenAI(input);
    // const res = "Hello world my name is himadri purkait";
    console.log(res);
    setResult(res);
    console.log(result);

    // dispatch(addMessage({ user: input, id: id, assistant: input }));
    // while (result.length == 0) {}
  };

  function setAns() {
    dispatch(addAnswer({ id, result }));
    var changeId = parseInt(id);
    changeId = changeId + 1;
    setId(changeId);
  }
  return (
    <>
      <div className="w-full h-[100%] bg-[#141627] flex ">
        {isSidebar === true ? (
          <>
            <div
              className="bg-[#141627] h-[100vh] w-[25%] border-r-[2px] border-[#222326]"
              style={{ transition: ".5s" }}
            >
              <div
                className="w-full h-[70px]   p-[10px] flex justify-center items-center"
                style={{ transition: ".5s" }}
              >
                <div className="w-[calc(100%-60px)] mr-[10px] h-full   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer">
                  <BiPlus className="text-white text-[20px]" />
                  <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] ">
                    New Chat
                  </span>
                </div>
                <div
                  className="w-[50px] h-full  rounded-xl  flex justify-center items-center cursor-pointer "
                  onClick={() => setIsSidebar(!isSidebar)}
                >
                  <FiSidebar className="text-white text-[18px]" />
                </div>
              </div>
              <div
                onClick={() => setAvatar(!avatar)}
                className="text-white cursor-pointer font-[nunitosans] "
              >
                Select Avatar
              </div>
              {avatar === true ? (
                <>
                  <div
                    className="w-full py-[10px]  flex flex-wrap justify-center"
                    style={{ transition: ".5s" }}
                  >
                    {IMG_ID.map((imgid) => {
                      return (
                        <>
                          {selectAvatar === undefined ? (
                            <>
                              <div
                                className="w-[70px] h-[70px]  m-[10px] rounded-xl cursor-pointer border[5px] border-white"
                                onClick={() => {
                                  if (selectAvatar === imgid.id) {
                                    setSelectAvatar();
                                  } else {
                                    setSelectAvatar(imgid.id);
                                  }
                                }}
                              >
                                <img
                                  loading="lazy"
                                  src={imgid.id}
                                  className=" rounded-xl border[2px] border-white "
                                  style={{ transition: ".5s" }}
                                ></img>
                                {/* {imgid.id} */}
                              </div>
                            </>
                          ) : selectAvatar === imgid.id ? (
                            <>
                              <div
                                className="w-[70px] h-[70px]  m-[10px] rounded-xl cursor-pointer border[5px] border-white"
                                onClick={() => {
                                  if (selectAvatar === imgid.id) {
                                    setSelectAvatar();
                                  } else {
                                    setSelectAvatar(imgid.id);
                                  }
                                }}
                              >
                                <img
                                  loading="lazy"
                                  src={imgid.id}
                                  className=" rounded-xl border[2px] border-white "
                                  style={{ transition: ".5s" }}
                                ></img>
                                {/* {imgid.id} */}
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                className="w-[70px] h-[70px]  m-[10px] rounded-xl cursor-pointer border[5px] border-white"
                                onClick={() => {
                                  if (selectAvatar === imgid.id) {
                                    setSelectAvatar();
                                  } else {
                                    setSelectAvatar(imgid.id);
                                  }
                                }}
                              >
                                <img
                                  loading="lazy"
                                  src={imgid.id}
                                  className=" rounded-xl border[2px] border-white opacity-[.3] hover:opacity-100"
                                  style={{ transition: ".5s" }}
                                ></img>
                                {/* {imgid.id} */}
                              </div>
                            </>
                          )}
                        </>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="w-full h-[0] "
                    style={{ transition: ".5s" }}
                  ></div>
                </>
              )}
            </div>
            <div
              className=" h-[100vh] w-[75%] flex items-center flex-col"
              style={{ transition: ".5s" }}
            >
              <div className="h-[70px] w-full bg-[#141627] text-white flex justify-center items-center  font-semibold">
                <img src={logo} className="h-[40px]"></img>
                <span className="ml-[15px] text-[25px]">WALLE</span>
              </div>
              <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                <div className="w-full h-[calc(100%-80px)]  mb-[20px] overflow-y-scroll">
                  {chatMessage.map((mssg) => {
                    return (
                      <>
                        <div className="w-full flex flex-col ">
                          <span className="px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-white ">
                            <div className="  w-full flex p-[20px] border-[2px] border-[#222326] rounded-lg">
                              <div className="w-[40px] h-[40px] rounded-sm bg-slate-500">
                                <img
                                  src={selectAvatar}
                                  className="rounded-sm"
                                  loading="lazy"
                                ></img>
                              </div>
                              <span className="w-[calc(100%-65px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] ">
                                {mssg.user}
                              </span>
                            </div>
                          </span>
                          <span className="px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-gray-300 ">
                            <div className="bg-[#1c1f37]  w-full flex p-[20px] rounded-lg">
                              <img
                                src={ai}
                                className="w-[40px] h-[40px] rounded-sm bg-slate-500"
                              ></img>
                              <pre className="w-[calc(100%-65px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] whitespace-pre-wrap ">
                                {mssg.assistant.length === 0 ? (
                                  <>
                                    <div className="lds-facebook mt-[50px]">
                                      <div></div>
                                      <div></div>
                                      <div></div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <span className="">
                                      {mssg.assistant.substr(
                                        2,
                                        mssg.assistant.length - 1
                                      )}
                                    </span>
                                  </>
                                )}
                              </pre>
                              <div ref={scrollToLast}></div>
                            </div>
                          </span>
                        </div>
                      </>
                    );
                  })}
                </div>
                <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                  <button
                    className="  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
                    style={{ zIndex: "3" }}
                    onClick={SpeechRecognition.startListening}
                  >
                    {listening == true ? (
                      <>
                        <BiSolidMicrophone className="text-[#8976f2]" />
                      </>
                    ) : (
                      <>
                        <BiSolidMicrophone
                          className="text-[white] hover:text-[#5841d9]"
                          style={{ transition: ".3s" }}
                        />
                      </>
                    )}
                  </button>
                  <input
                    placeholder="Ask Anything"
                    className="w-full h-full px-[20px] pl-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[nunitosans] "
                    value={input}
                    onKeyDown={(e) => {
                      if (e.code === "Enter") {
                        console.log("enter");
                        handleSend();
                        setInput("");
                      }
                    }}
                    onChange={(e) => setInput(e.target.value)}
                  ></input>

                  <div
                    className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[white] drop-shadow-lg"
                    onClick={() => {
                      handleSend();
                      setInput("");
                    }}
                  >
                    <IoMdSend
                      className="text-[#5841d9] hover:text-[#8976f2]"
                      style={{ transition: ".3s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="bg-[#141627] h-[100vh] w-[0]"
              style={{ transition: ".5s" }}
            ></div>
            <div
              className=" h-[100vh] w-[100%] flex items-center flex-col"
              style={{ transition: ".5s" }}
            >
              <div className="h-[70px] w-full bg-[#141627] text-white flex justify-center items-center font-[wakanda] font-semibold">
                <div
                  className="w-[50px] h-[50px] ml-[10px] rounded-xl  flex justify-center items-center cursor-pointer"
                  style={{ transition: ".5s" }}
                  onClick={() => setIsSidebar(!isSidebar)}
                >
                  <FiSidebar className="text-white text-[18px]" />
                </div>

                <div className="h-[70px] w-full bg-[#141627] text-white flex justify-center items-center  font-semibold">
                  <img src={logo} className="h-[40px]"></img>
                  <span className="ml-[15px] text-[25px] font-[nunitosans]">
                    WALLE
                  </span>
                </div>
              </div>
              <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                <div className="w-full h-[calc(100%-80px)]  mb-[20px] overflow-y-scroll">
                  {chatMessage.map((mssg) => {
                    return (
                      <>
                        <div className="w-full flex flex-col ">
                          <span className="px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-white ">
                            <div className="  w-full flex p-[20px] border-[2px] border-[#222326] rounded-lg">
                              <div className="w-[40px] h-[40px] rounded-sm bg-slate-500">
                                <img
                                  src={selectAvatar}
                                  className="rounded-sm"
                                  loading="lazy"
                                ></img>
                              </div>
                              <span className="w-[calc(100%-65px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] ">
                                {mssg.user}
                              </span>
                            </div>
                          </span>
                          <span className="px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-gray-300 ">
                            <div className="bg-[#1c1f37]  w-full flex p-[20px] rounded-lg">
                              <img
                                src={ai}
                                className="w-[40px] h-[40px] rounded-sm bg-slate-500"
                              ></img>
                              <pre className="w-[calc(100%-65px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] whitespace-pre-wrap ">
                                {mssg.assistant.length === 0 ? (
                                  <>
                                    <div className="lds-facebook mt-[50px]">
                                      <div></div>
                                      <div></div>
                                      <div></div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <span className="">
                                      {mssg.assistant.substr(
                                        2,
                                        mssg.assistant.length - 1
                                      )}
                                    </span>
                                  </>
                                )}
                              </pre>
                              <div ref={scrollToLast}></div>
                            </div>
                          </span>
                        </div>
                      </>
                    );
                  })}
                </div>
                <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                  <button
                    className="  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
                    style={{ zIndex: "3" }}
                    onClick={SpeechRecognition.startListening}
                  >
                    {listening == true ? (
                      <>
                        <BiSolidMicrophone className="text-[#8976f2]" />
                      </>
                    ) : (
                      <>
                        <BiSolidMicrophone
                          className="text-[white] hover:text-[#5841d9]"
                          style={{ transition: ".3s" }}
                        />
                      </>
                    )}
                  </button>
                  <input
                    placeholder="Ask Anything"
                    className="w-full h-full px-[20px] pl-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[nunitosans] "
                    value={input}
                    onKeyDown={(e) => {
                      if (e.code === "Enter") {
                        console.log("enter");
                        handleSend();
                        setInput("");
                      }
                    }}
                    onChange={(e) => setInput(e.target.value)}
                  ></input>

                  <div
                    className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[white] drop-shadow-lg"
                    onClick={() => {
                      handleSend();
                      setInput("");
                    }}
                  >
                    <IoMdSend
                      className="text-[#5841d9] hover:text-[#8976f2]"
                      style={{ transition: ".3s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Body;
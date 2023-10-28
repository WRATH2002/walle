// -------------------------------------------------------Icons Import-----
import { IoMdSend } from "react-icons/io";
import { FiSidebar } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { BiSolidMicrophone } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDarkMode } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { BsGithub } from "react-icons/bs";
import { HiOutlineClipboard } from "react-icons/hi2";
import { BsChatSquareText } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

//
import { PiChatCenteredThin } from "react-icons/pi";
import { HiOutlineChatBubbleBottomCenter } from "react-icons/hi2";

// -------------------------------------------------------Logo Import-----
import ai from "../assets/img/gpt.jpg";
import logo from "../assets/img/logo.png";
// -------------------------------------------------------Avatar Image Import------
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
// -------------------------------------------------------Other Imports-----
import { messageges } from "../utils/constants";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  addAnswer,
  addMessageNew,
  addChatSegment,
  clearChatSegment,
} from "../utils/chatSlice";
import { sendMessageToOpenAI } from "./Openai";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toggleDarkMode, toggleStateMode } from "../utils/chatSlice";
// -------------------------------------------------------API Key Import-----
import { API_KEY } from "../utils/constants";
// -------------------------------------------------------Firebase Import-------
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import firebase from "../firebase";
import toast, { Toaster } from "react-hot-toast";
// -------------------------------------------------------Avatar Image Id Array-----
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
  const [selectAvatar, setSelectAvatar] = useState(six);
  const darkmode = useSelector((store) => store.chat.darkMode);
  const [toggleMode, setToggleMode] = useState(darkmode);
  const dispatch = useDispatch();
  const [chatHistory, setChatHistory] = useState([]);
  const [id, setId] = useState(1);
  const [isSidebar, setIsSidebar] = useState(true);
  const [tempResult, setTempResult] = useState("");
  const [chatSegmentInput, setChatSegmentInput] = useState("");
  // -------------------------------------------------------Transcript Initialization------
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // -------------------------------------------------------
  var chatMessage = null;
  chatMessage = useSelector((store) => store.chat.messages);
  console.log("chatMessage");
  console.log(chatMessage);

  // -------------------------------------------------------Toggle DarkMode------
  useEffect(() => {
    setToggleMode(darkmode);
  }, [darkmode]);

  // -------------------------------------------------------Add Answer in The React Store After Generating Answer------
  useEffect(() => {
    setAns();
    setInput("");
    // setResult("");
    // setTempResult("");
  }, [tempResult]);
  // -------------------------------------------------------Scroll To Latest Message-------
  useEffect(() => {
    scrollToLast.current?.scrollIntoView();
  }, [input, tempResult]);
  // -------------------------------------------------------To Set Input as The Transcript-------
  useEffect(() => {
    setInput(transcript);
  }, [transcript]);
  // ------------------------------------------------------- -------
  useEffect(() => {
    dispatch(addMessageNew());
  }, []);
  // -------------------------------------------------------To Store Data in Firestore-------
  useEffect(() => {
    // FetchLatestdata();
    storeToFirestore();

    setTempResult("");
    getChatHistoryFromFirestore();
    AddFetchedChatHistoryToReactStore();
    chatMessage = "";
  }, [id]);

  // ------------------------------------------------------- -------
  useEffect(() => {
    console.log("chatHistory");
    console.log(chatHistory);
    AddFetchedChatHistoryToReactStore();
  }, [chatHistory]);

  // useEffect(() => {
  //   // storeToFirestore();
  //   // storeToFirestore();
  //   getChatHistoryFromFirestore();
  //   // AddFetchedChatHistoryToReactStore();
  // }, [chatMessage]);
  // useEffect(() => {
  //   // storeToFirestore();
  //   // storeToFirestore();
  //   // getChatHistoryFromFirestore();
  //   AddFetchedChatHistoryToReactStore();
  // }, [chatMessage]);
  // ------------------------------------------------------- -------
  // useEffect(() => {
  //   storeToFirestore();
  // });
  // -------------------------------------------------------Functiomn to Toggle DarkMode-------
  function changeDarkModeThree() {
    if (darkmode === 1) {
      dispatch(toggleDarkMode(2));
    } else if (darkmode === 2) {
      dispatch(toggleDarkMode(1));
    }
  }
  // -------------------------------------------------------

  const scrollToLast = useRef(null);

  // -------------------------------------------------------Function to Fetch chat History from Firestore-----
  function getChatHistoryFromFirestore() {
    const user = firebase.auth().currentUser;
    // console.log(user);
    if (user) {
      const userDoc = db
        .collection("users")
        .doc(user.uid)
        .collection("Chat Segment")
        .doc(toggleCreateNewChatInput);
      const unsubscribe = userDoc.onSnapshot((doc) => {
        if (doc.exists) {
          // console.log("doc");
          console.log(doc.data().uid);
          setChatHistory(doc.data().uid);
          // console.log("chathistory");
          // console.log(chatHistory);
        }
      });

      return unsubscribe;
    }
  }
  // -------------------------------------------------------Function to Dispatch Chat History from Firestore to react Store------
  function AddFetchedChatHistoryToReactStore() {
    console.log("chathistory in add function");
    console.log(chatHistory);
    dispatch(addMessageNew());
    chatHistory.map((chat, index) => {
      if (index == 0) {
        // console.log("index 0");
      } else {
        // console.log("index not 0");
        dispatch(
          addMessage({
            user: chat.user,
            assistant: chat.assistant,
            id: chat.id,
          })
        );
      }
    });
  }
  // -------------------------------------------------------Function to Store ChatHistory to Firestore-------
  function storeToFirestore() {
    console.log(" storefunction");

    console.log(chatMessage);

    if (chatMessage.length != 0) {
      const user = firebase.auth().currentUser;
      if (user) {
        const userDoc = db
          .collection("users")
          .doc(user.uid)
          .collection("Chat Segment")
          .doc(toggleCreateNewChatInput);

        console.log("userDoc");
        console.log(userDoc);
        userDoc.get().then((doc) => {
          if (doc.exists) {
            console.log("Document available");
          } else {
            // db.collection("users")
            //   .doc(user.uid)
            //   .collection("Chat Segment")
            //   .doc("test 1")
            //   .set({
            //     uid: [{ user: "Question", assistant: "Answer", id: 1 }],
            //   });
            // doc.data() will be undefined in this case
            console.log("No such document");
          }
        });

        userDoc.update({
          uid: firebase.firestore.FieldValue.arrayUnion({
            user: chatMessage[chatMessage.length - 1].user,
            assistant: chatMessage[chatMessage.length - 1].assistant,
            id: chatMessage[chatMessage.length - 1].id,
          }),
        });
      }
    }
  }

  function fetchChatSegment() {
    const user = firebase.auth().currentUser;
    const userRef = db
      .collection("users")
      .doc(user.uid)
      .collection("Chat Segment");
    userRef.get().then((snapshot) => {
      console.log(snapshot);
      dispatch(clearChatSegment());
      snapshot.forEach((doc) => {
        console.log(doc.id);
        // setChatSegmentName(doc.id);

        dispatch(addChatSegment({ chatId: doc.id }));
      });
    });
    console.log(chatSegmentName);
  }
  const [toggleCreateNewChat, setToggleCreateNewChat] = useState(false);
  const [toggleCreateNewChatInput, setToggleCreateNewChatInput] =
    useState("agf");

  useEffect(() => {
    fetchChatSegment();
  }, []);

  useEffect(() => {
    getChatHistoryFromFirestore();
    AddFetchedChatHistoryToReactStore();
  }, [toggleCreateNewChatInput]);

  const [chatSegmentName, setChatSegmentName] = useState([]);
  const temp = useSelector((store) => store.chat.chatSegment);
  // -------------------------------------------------------
  function DeleteChatHistoryFromFirebase() {
    console.log("temp");
    console.log(temp);
    const user = firebase.auth().currentUser;
    // const userDoc = db.collection("users").doc(user.uid);
    // userDoc.onSnapshot((doc) => {
    //   if (doc.exists) {
    //     doc.data().delete()
    //     // console.log("doc");
    //     // console.log(doc.data().uid);
    //     // setChatHistory(doc.data().uid);
    //     // console.log("chathistory");
    //     // console.log(chatHistory);
    //   }
    // });

    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("Chat Segment")
        .doc(toggleCreateNewChatInput)
        .set({
          uid: [{ user: "Question", assistant: "Answer", id: 1 }],
        });
    }
  }

  function deleteSingleChat(index) {
    const user = firebase.auth().currentUser;
    // console.log(user);
    // db.collection("users")
    //   .doc(user.uid[index + 1])
    //   .delete();
    if (user) {
      // db.collection("users").doc(user.uid);
      const userDoc = db.collection("users").doc(user.uid);
      const unsubscribe = userDoc.onSnapshot((doc) => {
        if (doc.exists) {
          // console.log("doc");
          console.log(doc.data().uid[index + 1]);
          // const del = doc.data().uid[index + 1];
          // del.user : firebase.firestore.FieldValue.delete();
          // doc.data().uid[index + 1]: db.FieldValue.delete();
          // doc.data().uid[index].;
          // console.log("chathistory");
          // console.log(chatHistory);
        }
      });

      return unsubscribe;
    }
  }

  function checkChatlength() {
    const user = firebase.auth().currentUser;
    // console.log(user);
    if (user) {
      const userDoc = db.collection("users").doc(user.uid);
      const unsubscribe = userDoc.onSnapshot((doc) => {
        if (doc.data().uid.length > 1) {
          // console.log("doc");
          // console.log("Data Available");
          // toast.success("Success");
          // setChatHistory(doc.data().uid);
          // console.log("chathistory");
          // console.log(chatHistory);
        } else {
          // toast.error("error");
          // console.log("No data");
        }
      });

      return unsubscribe;
    }
  }

  // const FetchLatestdata = () => {
  //   // const chatMessage = useSelector((store) => store.chat.messages);
  //   // console.log(chatMessage);
  //   storeToFirestore();
  // };
  // -------------------------------------------------------Function to Generate answer to Given Query-----
  const handleSend = async () => {
    // var hello = tempInput;
    // sendMessageToOpenAI(hello);
    // const tempId = chatMessage[chatMessage.length - 1].id;
    // setId(parseInt(tempId) + 1);
    if (input === "") {
    } else {
      dispatch(addMessage({ user: input, id: id, assistant: tempInput }));
    }
    const res = await sendMessageToOpenAI(input);
    // const res = "Hello world my name is himadri purkait";
    console.log(res);
    setResult(res);
    setTempResult(res);

    // console.log(result);

    // dispatch(addMessage({ user: input, id: id, assistant: input }));
    // while (result.length == 0) {}
  };
  // -------------------------------------------------------Function to Add Generated Answer to React Store------
  function setAns() {
    dispatch(addAnswer({ id, result }));
    var changeId = parseInt(id);
    changeId = changeId + 1;
    setId(changeId);
  }
  // -------------------------------------------------------Function to Sign Out------
  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign out Successful"))
      .catch((error) => console.log("Sign out not successful"));
  };
  // -------------------------------------------------------Function to Copy to Clipboard------
  function CopyToClipboard(index) {
    // Get the text field
    var copyText = document.getElementById("2");
    console.log(copyText);

    // Select the text field
    // copyText.select();
    // For mobile devices
    const area = document.createElement("textarea");
    area.value = copyText.innerText;
    area.setSelectionRange(0, 99999);
    // area.select();
    // Copy the text inside the text field
    navigator.clipboard.writeText(area.value);

    // Alert the copied text
    // alert("Copied the text: " + copyText.value);
  }

  function createNewFirestoreChatDocument() {
    const user = firebase.auth().currentUser;
    const useRef = db
      .collection("users")
      .doc(user.uid)
      .collection("Chat Segment")
      .doc(toggleCreateNewChatInput);

    useRef.get().then((doc) => {
      if (doc.exists) {
        toast.error("Same Already Exists");
        console.log("already created");
      } else {
        toast.success("Created Succesfully");
        console.log("Not Created");
        db.collection("users")
          .doc(user.uid)
          .collection("Chat Segment")
          .doc(toggleCreateNewChatInput)
          .set({
            uid: [
              {
                user: "New Chat Question",
                assistant: "New Chat Answer",
                id: 1,
              },
            ],
          });

        const userDoc = db
          .collection("users")
          .doc(user.uid)
          .collection("Chat Segment");
        console.log(userDoc);
        userDoc.get().then((doc) => {
          if (doc.exists) {
            console.log(doc);
          }
        });
      }
    });

    // if (user) {
    //   const userDoc = db.collection("users").doc(user.uid);
    //   userDoc.get().then((doc) => {
    //     if (doc.exists) {
    //       console.log("Document available");
    //     } else {

    //       // doc.data() will be undefined in this case
    //       console.log("No such document");
    //     }
    //   });
    //   userDoc.update({
    //     uid: firebase.firestore.FieldValue.arrayUnion({
    //       user: chatMessage[chatMessage.length - 1].user,
    //       assistant: chatMessage[chatMessage.length - 1].assistant,
    //       id: chatMessage[chatMessage.length - 1].id,
    //     }),
    //   });
    // }
  }
  const [h, setH] = useState(false);
  function success() {
    console.log("temp");
    return true;
  }
  function deleteSegment(segmentId) {
    toast.success("Deleted Successfully");
    //     toast.promise(
    //       success,
    //    {
    //      loading: 'Saving...',
    //      success: "Settings saved!",
    //      error: "Could not save",
    //    }
    //  );
    const user = firebase.auth().currentUser;
    const useRef = db
      .collection("users")
      .doc(user.uid)
      .collection("Chat Segment")
      .doc(segmentId);
    useRef.delete();
  }

  function deleteSpecificChat(SingleChatId) {
    const id = SingleChatId;
    const user = firebase.auth().currentUser;
    if (user) {
      const userDoc = db
        .collection("users")
        .doc(user.uid)
        .collection("Chat Segment")
        .doc(toggleCreateNewChatInput);

      userDoc.get().then((doc) => {
        const tel = doc.data().uid;
        console.log("tel");
        console.log(tel);
        const ff = tel.filter((del, index) => del.id !== id);
        console.log("ff");
        console.log(ff);
        if (chatMessage.length != 0) {
          const user = firebase.auth().currentUser;
          if (user) {
            const userDoc = db
              .collection("users")
              .doc(user.uid)
              .collection("Chat Segment")
              .doc(toggleCreateNewChatInput)
              .set({
                uid: ff,
              });
          }
        }
      });
    }
  }

  return (
    <>
      {toggleMode === 2 ? (
        <>
          <Toaster position="bottom-center" reverseOrder={false} />
          <div
            className="w-full h-[100%] bg-[#141627] flex "
            style={{ transition: ".5s" }}
          >
            {isSidebar === true ? (
              <>
                <div
                  className="bg-[#141627] h-[100vh] w-[75%] lg:w-[20%] md:w-[20%] border-r-[1px] border-[#32365b] flex flex-col justify-between items-center fixed lg:relative md:relative"
                  style={{ transition: ".5s", zIndex: "4" }}
                >
                  <div
                    className="w-full h-[70px]   p-[10px] flex justify-center items-center "
                    style={{ transition: ".5s" }}
                  >
                    <div className="w-[calc(100%-60px)] mr-[10px] h-full   rounded-xl  flex justify-start items-center cursor-pointer">
                      {toggleCreateNewChat === false ? (
                        <>
                          <div
                            className="w-full flex justify-start items-center"
                            onClick={() => {
                              setToggleCreateNewChat(!toggleCreateNewChat);
                            }}
                          >
                            <BiPlus className="  mx-[15px] text-white text-[20px]" />
                            <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] ">
                              New Chat
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <input
                            // onClick={() =>
                            //   setToggleCreateNewChat(!toggleCreateNewChat)
                            // }
                            placeholder="Chat Name"
                            value={chatSegmentInput}
                            onChange={(e) => {
                              setChatSegmentInput(e.target.value);
                              if (e.target.value !== "") {
                                setToggleCreateNewChatInput(e.target.value);
                              } else {
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.nativeEvent.key === "Enter") {
                                // setToggleCreateNewChatInput(chatSegmentInput)
                                console.log("Enter");
                                fetchChatSegment();
                                createNewFirestoreChatDocument();
                              }
                            }}
                            className="ml-[15px] w-full text-[white] bg-[#1c1f37] rounded-lg h-[50px] overflow-hidden whitespace-nowrap font-[nunitosans] outline-none px-[15px] pr-[35px]"
                            autoFocus
                          ></input>
                          <div className="w-[30px] flex justify-center items-center ml-[-30px] h-[50px]">
                            <RxCross2
                              className="text-white  text-[20px] bg-[#1c1f37] "
                              onClick={() => {
                                setChatSegmentInput("");
                                setToggleCreateNewChat(!toggleCreateNewChat);
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      className="w-[50px] h-full  rounded-xl  flex justify-center items-center cursor-pointer "
                      onClick={() => {
                        setIsSidebar(!isSidebar);
                        setAvatar(false);
                      }}
                    >
                      <FiSidebar className="text-white text-[18px]" />
                    </div>
                  </div>
                  {/* ------------------------------- Chat Segment ------------------------------- */}
                  <div className="w-[calc(100%-20px)] px-[15px] h-[calc(100vh-270px)] py-[10px] overflow-y-scroll text-[white]">
                    {temp.map((segment) => {
                      return (
                        <>
                          {segment.chatId === toggleCreateNewChatInput ? (
                            <>
                              <div className="group w-full flex justify-center items-center my-[15px]">
                                <div
                                  className="px-[15px] pr-[27px] rounded-lg cursor-pointer  bg-[#5841d9]  whitespace-nowrap w-full h-[50px]  flex justify-start items-center"
                                  style={{ transition: ".3s" }}
                                >
                                  <span className="w-full text-ellipsis overflow-hidden ">
                                    {segment.chatId}
                                  </span>
                                </div>
                                <div
                                  className="ml-[-30px] h-[30px]  flex justify-center items-center w-[30px] opacity-100 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white hover:text-[#8976f2]"
                                  onClick={() => {
                                    deleteSegment(segment.chatId);
                                    fetchChatSegment();
                                    // setToggleCreateNewChatInput(temp[0].chatId);
                                    // getChatHistoryFromFirestore();
                                    // AddFetchedChatHistoryToReactStore();
                                  }}
                                >
                                  <MdDelete className="text-[20px]  " />
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="group w-full flex justify-center items-center my-[15px]">
                                <div
                                  className="px-[15px] pr-[27px] rounded-lg cursor-pointer  bg-[#1c1f37] hover:bg-[#8976f2]  whitespace-nowrap w-[100%] h-[50px] flex justify-start items-center"
                                  style={{ transition: ".5s" }}
                                  onClick={() => {
                                    fetchChatSegment();
                                    setToggleCreateNewChatInput(segment.chatId);
                                    setChatHistory([]);
                                    getChatHistoryFromFirestore();
                                    AddFetchedChatHistoryToReactStore();
                                  }}
                                >
                                  <span className="w-full text-ellipsis overflow-hidden ">
                                    {segment.chatId}
                                  </span>
                                </div>
                                <div
                                  className="ml-[-30px] h-[30px]  flex justify-center items-center w-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white hover:text-[#8976f2]"
                                  onClick={() => {
                                    deleteSegment(segment.chatId);
                                    fetchChatSegment();
                                  }}
                                >
                                  <MdDelete className="text-[20px]  " />
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })}
                  </div>
                  {/* ------------------------------- Bottom Part ------------------------------- */}
                  <div
                    className="w-[calc(100%-20px)] h-[200px]  mx-[10px] py-[10px] flex flex-col justify-center items-center  border-t-[2px] border-[#32365b]"
                    style={{ transition: ".5s" }}
                  >
                    {/* <div className="w-full  h-[40px] mb-[10px]  rounded-xl  px-[4px] flex justify-start items-center cursor-pointer ">
                      {selectAvatar === undefined ? (
                        <>
                          <div className="rounded-full h-full w-[40px] bg-[#5841d9]">
                            <MdAccountCircle className="text-[#aaaaaa] text-[40px] h-full" />
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={selectAvatar}
                            className="rounded-full h-full"
                            loading="lazy"
                          ></img>
                        </>
                      )}

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] ">
                        Himadri Purkait
                      </span>
                    </div> */}
                    {/* <div
                    onClick={() => setAvatar(!avatar)}
                    className="text-white cursor-pointer font-[nunitosans] "
                  >
                    Select Avatar
                  </div> */}

                    {/* ---------------------------------- */}
                    <div
                      className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                      onClick={() => setAvatar(!avatar)}
                    >
                      <IoSettingsOutline className="text-white text-[18px]" />

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                        Settings
                      </span>
                    </div>
                    <div className="w-full h-[192px]  overflow-y-scroll">
                      {avatar === false ? (
                        <>
                          <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer  my-[4px]">
                            <div className="w-[calc(100%-40px)] flex">
                              <MdDarkMode className="text-white text-[18px]" />

                              <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                                Dark Mode
                              </span>
                            </div>
                            {toggleMode === 2 ? (
                              <>
                                <div
                                  className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#252a43]"
                                  onClick={() => changeDarkModeThree()}
                                >
                                  <div
                                    className="w-[16px] h-[16px] ml-[20px] bg-[#5841d9] rounded-full"
                                    style={{ transition: ".5s" }}
                                  ></div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#e4e6ec]"
                                  onClick={() => changeDarkModeThree()}
                                >
                                  <div
                                    className="w-[16px] h-[16px] ml-[4px] bg-[white] rounded-full"
                                    style={{ transition: ".5s" }}
                                    // onClick={() => setToggleMode(!toggleMode)}
                                  ></div>
                                </div>
                              </>
                            )}
                          </div>
                          <div
                            className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                            onClick={userSignOut}
                          >
                            <FiLogOut className="text-white text-[18px]" />

                            <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                              Logout
                            </span>
                          </div>
                          <div
                            className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                            onClick={() => {
                              if (chatMessage.length > 0) {
                                toast.success("Chats Deleted Successfully");
                              } else {
                                toast.error("No Chats to Delete");
                              }
                              checkChatlength();
                              DeleteChatHistoryFromFirebase();

                              getChatHistoryFromFirestore();
                              AddFetchedChatHistoryToReactStore();
                            }}
                          >
                            <BsChatSquareText className="text-white text-[18px]" />

                            <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                              Delete Chats
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {" "}
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
                                            className="w-[40px] h-[40px]  m-[5px] rounded-full cursor-pointer border[5px] border-white"
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
                                              className=" rounded-lg border[2px] border-white "
                                              style={{ transition: ".5s" }}
                                            ></img>
                                          </div>
                                        </>
                                      ) : selectAvatar === imgid.id ? (
                                        <>
                                          <div
                                            className="w-[40px] h-[40px]  m-[5px] rounded-full cursor-pointer border[5px] border-white"
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
                                              className=" rounded-lg border[2px] border-white "
                                              style={{ transition: ".5s" }}
                                            ></img>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="w-[40px] h-[40px]  m-[5px] rounded-full cursor-pointer border[5px] border-white"
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
                                              className=" rounded-lg border[2px] border-white opacity-[.3] hover:opacity-100"
                                              style={{ transition: ".5s" }}
                                            ></img>
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
                        </>
                      )}
                    </div>

                    {/* <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer  my-[4px]">
                      <div className="w-[calc(100%-40px)] flex">
                        <MdDarkMode className="text-white text-[18px]" />

                        <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                          Dark Mode
                        </span>
                      </div>
                      {toggleMode === 2 ? (
                        <>
                          <div
                            className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#252a43]"
                            onClick={() => changeDarkModeThree()}
                          >
                            <div
                              className="w-[16px] h-[16px] ml-[20px] bg-[#5841d9] rounded-full"
                              style={{ transition: ".5s" }}
                            ></div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#e4e6ec]"
                            onClick={() => changeDarkModeThree()}
                          >
                            <div
                              className="w-[16px] h-[16px] ml-[4px] bg-[white] rounded-full"
                              style={{ transition: ".5s" }}
                              // onClick={() => setToggleMode(!toggleMode)}
                            ></div>
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                      onClick={userSignOut}
                    >
                      <FiLogOut className="text-white text-[18px]" />

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                        Logout
                      </span>
                    </div>
                    <div
                      className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                      onClick={() => {
                        if (chatMessage.length > 0) {
                          toast.success("Chats Deleted Successfully");
                        } else {
                          toast.error("No Chats to Delete");
                        }
                        checkChatlength();
                        DeleteChatHistoryFromFirebase();

                        getChatHistoryFromFirestore();
                        AddFetchedChatHistoryToReactStore();
                      }}
                    >
                      <BsChatSquareText className="text-white text-[18px]" />

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                        Delete Chats
                      </span>
                    </div> */}
                  </div>
                </div>
                <div
                  className=" h-[100vh] w-full lg:w-[80%] md:w-[80%] flex items-center flex-col"
                  style={{ transition: ".5s" }}
                >
                  <div
                    className="h-[70px] pr-[0] lg:pr-[60px] md:pr-[60px]  w-full bg-[#141627] text-white flex justify-center items-center  font-semibold"
                    style={{ transition: ".5s" }}
                  >
                    <img src={logo} className="h-[40px]"></img>
                    <span className="ml-[15px] text-[25px] font-[nunitosans]">
                      WALLE
                    </span>
                  </div>
                  {/* <div className="text-white">Hello World</div>
                   */}
                  {chatMessage.length === 0 ? (
                    <>
                      {temp.length === 0 ? (
                        <>
                          <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                            <div className="w-full h-[calc(100%-80px)] flex justify-center items-center  mb-[20px] overflow-y-scroll">
                              <img
                                src={logo}
                                className="h-[300px] opacity-5"
                              ></img>
                            </div>
                            <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                              <button
                                className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
                                style={{ zIndex: "3" }}
                                onClick={SpeechRecognition.startListening}
                              >
                                <BiSolidMicrophone
                                  className="text-[white] "
                                  style={{ transition: ".3s" }}
                                />
                              </button>
                              <input
                                placeholder="Create New Chat Segment First"
                                className="placeholder:text-orange-400 w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[nunitosans] "
                                style={{ transition: ".5s" }}
                                value={""}
                              ></input>

                              <div className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[white] drop-shadow-lg">
                                <IoMdSend
                                  className="text-[white] "
                                  style={{ transition: ".3s" }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                            <div className="w-full h-[calc(100%-80px)] flex justify-center items-center  mb-[20px] overflow-y-scroll">
                              <img
                                src={logo}
                                className="h-[300px] opacity-5"
                              ></img>
                            </div>
                            <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                              <button
                                className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
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
                                className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[nunitosans] "
                                style={{ transition: ".5s" }}
                                value={input}
                                onKeyDown={(e) => {
                                  // console.log(e);
                                  if (e.nativeEvent.key === "Enter") {
                                    // console.log("enter");
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
                                  className="text-[white] hover:text-[#8976f2]"
                                  style={{ transition: ".3s" }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                      <div className="w-full h-[calc(100%-80px)]  mb-[20px] overflow-y-scroll">
                        {chatMessage.map((mssg, index) => {
                          return (
                            <>
                              <div className="w-full flex flex-col ">
                                <span className="px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-white ">
                                  <div
                                    className="group  w-full flex p-[19px] border-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-l-[#5841d9]"
                                    style={{ transition: ".5s" }}
                                  >
                                    <div className="w-[40px] h-[40px] rounded-sm bg-slate-500">
                                      <img
                                        src={selectAvatar}
                                        className="rounded-sm"
                                        loading="lazy"
                                      ></img>
                                    </div>
                                    <span className="w-[calc(100%-70px)]  overflow-x-hidden ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] ">
                                      {mssg.user}
                                    </span>
                                    <div
                                      className="w-[30px] h-[40px]   rounded-sm opacity-0 flex justify-end items-center group-hover:opacity-100 transition-opacity duration-300 cursor-pointer "
                                      onClick={() => {
                                        deleteSpecificChat(mssg.id);
                                        toast.success("Chat Deleted");
                                      }}
                                    >
                                      <MdDelete className="text-[20px]" />
                                    </div>
                                  </div>
                                </span>
                                <span
                                  className="group px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-white "
                                  // style={{ transition: ".5s" }}
                                >
                                  <div
                                    className="bg-[#1c1f37]  w-full flex p-[19px] border-l-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-[#5841d9] "
                                    style={{ transition: ".5s" }}
                                  >
                                    <img
                                      src={ai}
                                      className="w-[40px] h-[40px] rounded-sm bg-slate-500"
                                    ></img>
                                    <pre
                                      className=" w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] whitespace-pre-wrap "
                                      // style={{ transition: ".5s" }}
                                    >
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
                                          <span id={index} className="">
                                            {mssg.assistant.substr(
                                              2,
                                              mssg.assistant.length - 1
                                            )}
                                          </span>
                                        </>
                                      )}
                                    </pre>
                                    <div
                                      className="w-[30px] h-[40px]   rounded-sm opacity-0 flex justify-end items-center group-hover:opacity-100 transition-opacity duration-300 cursor-pointer "
                                      // style={{ transition: ".3s" }}
                                      onClick={() => {
                                        // CopyToClipboard(index);
                                        navigator.clipboard.writeText(
                                          mssg.assistant.substr(
                                            2,
                                            mssg.assistant.length - 1
                                          )
                                        );
                                        toast.success("Copied to Clipboard");
                                        // deleteSingleChat(index);
                                      }}
                                    >
                                      <HiOutlineClipboard className="text-[20px]" />
                                    </div>
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
                          className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
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
                          className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[nunitosans] "
                          style={{ transition: ".5s" }}
                          value={input}
                          onKeyDown={(e) => {
                            // console.log(e);
                            if (e.nativeEvent.key === "Enter") {
                              // console.log("enter");
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
                            className="text-[white]] hover:text-[#8976f2]"
                            style={{ transition: ".3s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div
                  className="bg-[#141627] h-[100vh] w-[0]  border-r-[1px] border-[#32365b] flex flex-col justify-between items-center fixed lg:relative md:relative"
                  style={{ transition: ".5s" }}
                >
                  <div
                    className="w-full h-[70px]   p-[10px] flex justify-center items-center "
                    style={{ transition: ".5s" }}
                  >
                    <div className="w-[100%] mr-[10px] h-full   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer">
                      <BiPlus className="text-white text-[20px] mr-[15px]" />
                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] ">
                        New Chat
                      </span>
                    </div>
                    <div
                      className="w-[0] h-full  rounded-xl  flex justify-center items-center cursor-pointer "
                      onClick={() => setIsSidebar(!isSidebar)}
                    >
                      <FiSidebar className="text-white text-[18px]" />
                    </div>
                  </div>
                  {/* ----------------------------- Chat Segment ---------------------------- */}
                  <div
                    className="w-[calc(100%-20px)] px-[0] h-[calc(100vh-270px)] py-[10px] overflow-y-scroll text-[white]"
                    style={{ transition: ".5s" }}
                  >
                    {temp.map((segment) => {
                      return (
                        <>
                          {segment.chatId === toggleCreateNewChatInput ? (
                            <>
                              <div className="group w-full flex justify-center items-center my-[15px]">
                                <div
                                  className="px-[15px] pr-[27px] rounded-lg cursor-pointer  bg-[#5841d9]  whitespace-nowrap w-full h-[50px]  flex justify-start items-center"
                                  style={{ transition: ".3s" }}
                                >
                                  <span className="w-full text-ellipsis overflow-hidden ">
                                    {segment.chatId}
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="group w-full flex justify-center items-center my-[15px]">
                                <div
                                  className="px-[15px] pr-[27px] rounded-lg cursor-pointer  bg-[#1c1f37]  whitespace-nowrap w-full h-[50px] flex justify-start items-center"
                                  style={{ transition: ".3s" }}
                                >
                                  <span className="w-full text-ellipsis overflow-hidden ">
                                    {segment.chatId}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })}
                  </div>

                  {/* ------------------------------------ Bottom Section ---------------------------------- */}
                  <div className="w-[calc(100%-20px)] h-[200px]  mx-[10px] py-[10px] flex flex-col justify-center items-center  border-t-[2px] border-[#32365b]">
                    {/* <div className="w-full  h-[40px] mb-[10px]  rounded-xl  px-[4px] flex justify-start items-center cursor-pointer ">
                      <img
                        src={selectAvatar}
                        className="rounded-full h-full"
                        loading="lazy"
                      ></img>

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] ">
                        Himadri Purkait
                      </span>
                    </div> */}
                    <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] ">
                      <IoSettingsOutline className="text-white text-[18px]" />

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                        Settings
                      </span>
                    </div>
                    <div className="w-full h-[192px]  overflow-y-scroll">
                      <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] ">
                        <MdDarkMode className="text-white text-[18px]" />

                        <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                          Dark Mode
                        </span>
                      </div>
                      <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] ">
                        <FiLogOut className="text-white text-[18px]" />

                        <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                          Logout
                        </span>
                      </div>
                      <div
                        className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                        onClick={() => {
                          if (chatMessage.length > 0) {
                            toast.success("Chats Deleted Successfully");
                          } else {
                            toast.error("No Chats to Delete");
                          }
                          checkChatlength();
                          DeleteChatHistoryFromFirebase();

                          getChatHistoryFromFirestore();
                          AddFetchedChatHistoryToReactStore();
                        }}
                      >
                        <BsChatSquareText className="text-white text-[18px]" />

                        <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                          Delete Chats
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className=" h-[100vh] w-[100%] flex items-center flex-col"
                  style={{ transition: ".5s" }}
                >
                  <div className="h-[70px] w-full bg-[#141627] text-white flex justify-center items-center font-[wakanda] font-semibold">
                    <div
                      className="w-[50px] h-[50px] ml-[10px] rounded-xl  flex justify-center items-center cursor-pointer"
                      style={{ transition: ".5s", zIndex: "4" }}
                      onClick={() => setIsSidebar(!isSidebar)}
                    >
                      <FiSidebar className="text-white text-[18px]" />
                    </div>

                    <div className="h-[70px] ml-[-60px] w-full bg-[#141627] text-white flex justify-center items-center  font-semibold">
                      <img src={logo} className="h-[40px]"></img>
                      <span className="ml-[15px] text-[25px] font-[nunitosans]">
                        WALLE
                      </span>
                    </div>
                  </div>
                  {chatMessage.length === 0 ? (
                    <>
                      {temp.length === 0 ? (
                        <>
                          <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                            <div className="w-full h-[calc(100%-80px)] flex justify-center items-center  mb-[20px] overflow-y-scroll">
                              <img
                                src={logo}
                                className="h-[300px] opacity-5"
                              ></img>
                            </div>
                            <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                              <button
                                className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
                                style={{ zIndex: "3" }}
                                onClick={SpeechRecognition.startListening}
                              >
                                <BiSolidMicrophone
                                  className="text-[white] "
                                  style={{ transition: ".3s" }}
                                />
                              </button>
                              <input
                                placeholder="Create New Chat Segment First"
                                className="placeholder:text-orange-400 w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[nunitosans] "
                                style={{ transition: ".5s" }}
                                value={""}
                              ></input>

                              <div className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[white] drop-shadow-lg">
                                <IoMdSend
                                  className="text-[white] "
                                  style={{ transition: ".3s" }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                            <div className="w-full h-[calc(100%-80px)] flex justify-center items-center  mb-[20px] overflow-y-scroll">
                              <img
                                src={logo}
                                className="h-[300px] opacity-5"
                              ></img>
                            </div>
                            <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                              <button
                                className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
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
                                className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[nunitosans] "
                                style={{ transition: ".5s" }}
                                value={input}
                                onKeyDown={(e) => {
                                  // console.log(e);
                                  if (e.nativeEvent.key === "Enter") {
                                    // console.log("enter");
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
                                  className="text-[white] hover:text-[#8976f2]"
                                  style={{ transition: ".3s" }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                      <div className="w-full h-[calc(100%-80px)]  mb-[20px] overflow-y-scroll">
                        {chatMessage.map((mssg, index) => {
                          return (
                            <>
                              <div className="w-full flex flex-col ">
                                <span
                                  className="px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-white "
                                  style={{ transition: ".5s" }}
                                >
                                  <div className="group  w-full flex p-[19px] border-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-l-[#5841d9]">
                                    <div className="w-[40px] h-[40px] rounded-sm bg-slate-500">
                                      <img
                                        src={selectAvatar}
                                        className="rounded-sm"
                                        loading="lazy"
                                      ></img>
                                    </div>
                                    <span className="w-[calc(100%-70px)]  overflow-x-hidden ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] ">
                                      {mssg.user}
                                    </span>
                                    <div
                                      className="w-[30px] h-[40px]   rounded-sm opacity-0 flex justify-end items-center group-hover:opacity-100 transition-opacity duration-300 cursor-pointer "
                                      onClick={() => {
                                        deleteSpecificChat(mssg.id);
                                        toast.success("Chat Deleted");
                                      }}
                                    >
                                      <MdDelete className="text-[20px]" />
                                    </div>
                                  </div>
                                </span>
                                <span
                                  className="group px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-white "
                                  // style={{ transition: ".5s" }}
                                >
                                  <div
                                    className="bg-[#1c1f37]  w-full flex p-[19px] border-l-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-[#5841d9] "
                                    style={{ transition: ".5s" }}
                                  >
                                    <img
                                      src={ai}
                                      className="w-[40px] h-[40px] rounded-sm bg-slate-500"
                                    ></img>
                                    <pre
                                      className=" w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] whitespace-pre-wrap "
                                      // style={{ transition: ".5s" }}
                                    >
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
                                          <span id={index} className="">
                                            {mssg.assistant.substr(
                                              2,
                                              mssg.assistant.length - 1
                                            )}
                                          </span>
                                        </>
                                      )}
                                    </pre>
                                    <div
                                      className="w-[30px] h-[40px]   rounded-sm opacity-0 flex justify-end items-center group-hover:opacity-100 transition-opacity duration-300 cursor-pointer "
                                      // style={{ transition: ".3s" }}
                                      onClick={() => {
                                        // CopyToClipboard(index);
                                        navigator.clipboard.writeText(
                                          mssg.assistant.substr(
                                            2,
                                            mssg.assistant.length - 1
                                          )
                                        );
                                        toast.success("Copied to Clipboard");
                                        // deleteSingleChat(index);
                                      }}
                                    >
                                      <HiOutlineClipboard className="text-[20px]" />
                                    </div>
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
                          className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
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
                          className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[nunitosans] "
                          style={{ transition: ".5s" }}
                          value={input}
                          onKeyDown={(e) => {
                            // console.log(e);
                            if (e.nativeEvent.key === "Enter") {
                              // console.log("enter");
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
                            className="text-[white]] hover:text-[#8976f2]"
                            style={{ transition: ".3s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                    <div className="w-full h-[calc(100%-80px)]  mb-[20px] overflow-y-scroll">
                      {chatMessage.map((mssg) => {
                        return (
                          <>
                            <div className="w-full flex flex-col ">
                              <span className="px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-white ">
                                <div className="  w-full flex p-[20px]  border-[1px] border-[#32365b]   rounded-lg">
                                  <div className="w-[40px] h-[40px] rounded-sm bg-slate-500 ">
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
                              <span className="group px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-white ">
                                <div
                                  className="bg-[#1c1f37]  w-full flex p-[19px] border-l-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-[#5841d9] "
                                  style={{ transition: ".3s" }}
                                >
                                  <img
                                    src={ai}
                                    className="w-[40px] h-[40px] rounded-sm bg-slate-500"
                                  ></img>
                                  <pre className="w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] whitespace-pre-wrap ">
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
                                  <div
                                    className="w-[30px] h-[40px]   rounded-sm opacity-0 flex justify-end items-center group-hover:opacity-100 transition-opacity duration-300"
                                    // style={{ transition: ".3s" }}
                                    onClick={() => {
                                      // CopyToClipboard(index);
                                      navigator.clipboard.writeText(
                                        mssg.assistant.substr(
                                          2,
                                          mssg.assistant.length - 1
                                        )
                                      );
                                      toast.success("Copied to Clipboard");
                                      // deleteSingleChat(index);
                                    }}
                                  >
                                    <HiOutlineClipboard className="text-[20px]" />
                                  </div>
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
                        className="outline-none   h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
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
                        className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[nunitosans] "
                        value={input}
                        onKeyDown={(e) => {
                          if (e.nativeEvent.key === "Enter") {
                            // console.log("enter");
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
                  </div> */}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <Toaster position="bottom-center" reverseOrder={false} />
          <div
            className="w-full h-[100%] bg-[#f8fafc] flex "
            style={{ transition: ".5s" }}
          >
            {isSidebar === true ? (
              <>
                <div
                  className="bg-[#ffffff] h-[100vh] w-[75%] lg:w-[20%] md:w-[20%] border-r-[1px] border-[#e7e9ee] flex flex-col justify-between items-center fixed lg:relative md:relative"
                  style={{ transition: ".5s", zIndex: "4" }}
                >
                  <div
                    className="w-full h-[70px]   p-[10px] flex justify-center items-center "
                    style={{ transition: ".5s" }}
                  >
                    <div className="w-[calc(100%-60px)] mr-[10px] h-full   rounded-xl  flex justify-start items-center cursor-pointer">
                      {toggleCreateNewChat === false ? (
                        <>
                          <div
                            className="w-full flex justify-start items-center"
                            onClick={() => {
                              setToggleCreateNewChat(!toggleCreateNewChat);
                            }}
                          >
                            <BiPlus className="  mx-[15px] text-black text-[20px]" />
                            <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans] ">
                              New Chat
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <input
                            // onClick={() =>
                            //   setToggleCreateNewChat(!toggleCreateNewChat)
                            // }
                            placeholder="Chat Name"
                            value={chatSegmentInput}
                            onChange={(e) => {
                              setChatSegmentInput(e.target.value);
                              if (e.target.value !== "") {
                                setToggleCreateNewChatInput(e.target.value);
                              } else {
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.nativeEvent.key === "Enter") {
                                // setToggleCreateNewChatInput(chatSegmentInput)
                                console.log("Enter");
                                fetchChatSegment();
                                createNewFirestoreChatDocument();
                              }
                            }}
                            className="ml-[15px] w-full text-[black] bg-[#f8fafc] rounded-lg h-[50px] overflow-hidden whitespace-nowrap font-[nunitosans] outline-none px-[15px] pr-[35px]"
                            autoFocus
                          ></input>
                          <div className="w-[30px] flex justify-center items-center ml-[-30px] h-[50px]">
                            <RxCross2
                              className="text-black  text-[20px] bg-transparent "
                              onClick={() => {
                                setChatSegmentInput("");
                                setToggleCreateNewChat(!toggleCreateNewChat);
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      className="w-[50px] h-full  rounded-xl  flex justify-center items-center cursor-pointer "
                      onClick={() => {
                        setAvatar(false);
                        setIsSidebar(!isSidebar);
                      }}
                    >
                      <FiSidebar className="text-black text-[18px] drop-shadow-lg" />
                    </div>
                  </div>
                  {/* ------------------------------- Chat Segment ----------------------------- */}
                  <div
                    id="chatSegmentLight"
                    className="w-[calc(100%-20px)] px-[15px] h-[calc(100vh-270px)] py-[10px] overflow-y-scroll text-[white]"
                  >
                    {temp.map((segment) => {
                      return (
                        <>
                          {segment.chatId === toggleCreateNewChatInput ? (
                            <>
                              <div className="group w-full flex justify-center items-center my-[15px]">
                                <div
                                  className="px-[15px] pr-[27px] rounded-lg cursor-pointer text-white  bg-[#5841d9]  whitespace-nowrap w-full h-[50px]  flex justify-start items-center"
                                  style={{ transition: ".3s" }}
                                >
                                  <span className="w-full text-ellipsis overflow-hidden">
                                    {segment.chatId}
                                  </span>
                                </div>
                                <div
                                  className="ml-[-30px] h-[30px]  flex justify-center items-center w-[30px] opacity-100 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white  hover:text-[#8976f2]"
                                  onClick={() => {
                                    deleteSegment(segment.chatId);
                                    fetchChatSegment();
                                    // setToggleCreateNewChatInput(temp[0].chatId);
                                    // getChatHistoryFromFirestore();
                                    // AddFetchedChatHistoryToReactStore();
                                  }}
                                >
                                  <MdDelete className="text-[20px]  " />
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="group w-full flex justify-center items-center my-[15px]">
                                <div
                                  id="he"
                                  className="px-[15px] pr-[27px] rounded-lg cursor-pointer text-black hover:text-white bg-[#f8fafc] hover:bg-[#8976f2]  whitespace-nowrap w-[100%] h-[50px] flex justify-start items-center"
                                  style={{ transition: ".5s" }}
                                  onClick={() => {
                                    fetchChatSegment();
                                    setToggleCreateNewChatInput(segment.chatId);
                                    setChatHistory([]);
                                    getChatHistoryFromFirestore();
                                    AddFetchedChatHistoryToReactStore();
                                  }}
                                >
                                  <span className="w-full text-ellipsis overflow-hidden ">
                                    {segment.chatId}
                                  </span>
                                </div>
                                <div
                                  className="ml-[-30px] h-[30px]  flex justify-center items-center w-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white  hover:text-[#8976f2]"
                                  onClick={() => {
                                    deleteSegment(segment.chatId);
                                    fetchChatSegment();
                                  }}
                                >
                                  <MdDelete className="text-[20px]  " />
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })}
                  </div>

                  <div
                    className="w-[calc(100%-20px)] h-[200px]  mx-[10px] py-[10px] flex flex-col justify-center items-center  border-t-[2px] border-[#eff1f4]"
                    style={{ transition: ".5s" }}
                  >
                    <div
                      className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                      onClick={() => setAvatar(!avatar)}
                    >
                      <IoSettingsOutline className="text-[black] text-[18px] drop-shadow-lg" />

                      <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] drop-shadow-lg ">
                        Settings
                      </span>
                    </div>
                    <div className="w-full h-[192px]  overflow-y-scroll">
                      {avatar === false ? (
                        <>
                          <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer  my-[4px]">
                            <div className="w-[calc(100%-40px)] flex">
                              <MdDarkMode className="text-[black] text-[18px]" />

                              <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                                Dark Mode
                              </span>
                            </div>
                            {toggleMode === 2 ? (
                              <>
                                <div
                                  className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#252a43]"
                                  onClick={() => changeDarkModeThree()}
                                >
                                  <div
                                    className="w-[16px] h-[16px] ml-[20px] bg-[#5841d9] rounded-full"
                                    style={{ transition: ".5s" }}
                                  ></div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="w-[40px] h-[24px] flex  items-center rounded-full bg-[#e4e6ec]"
                                  onClick={() => changeDarkModeThree()}
                                >
                                  <div
                                    className="w-[16px] h-[16px] ml-[4px] bg-[white] rounded-full"
                                    style={{ transition: ".5s" }}
                                    // onClick={() => setToggleMode(!toggleMode)}
                                  ></div>
                                </div>
                              </>
                            )}
                          </div>
                          <div
                            className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                            onClick={userSignOut}
                          >
                            <FiLogOut className="text-black text-[18px]" />

                            <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                              Logout
                            </span>
                          </div>
                          <div
                            className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                            onClick={() => {
                              if (chatMessage.length > 0) {
                                toast.success("Chats Deleted Successfully");
                              } else {
                                toast.error("No Chats to Delete");
                              }
                              checkChatlength();
                              DeleteChatHistoryFromFirebase();

                              getChatHistoryFromFirestore();
                              AddFetchedChatHistoryToReactStore();
                            }}
                          >
                            <BsChatSquareText className="text-black text-[18px]" />

                            <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                              Delete Chats
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {" "}
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
                                            className="w-[40px] h-[40px]  m-[5px] rounded-full cursor-pointer border[5px] border-white"
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
                                              className=" rounded-lg border[2px] border-white "
                                              style={{ transition: ".5s" }}
                                            ></img>
                                          </div>
                                        </>
                                      ) : selectAvatar === imgid.id ? (
                                        <>
                                          <div
                                            className="w-[40px] h-[40px]  m-[5px] rounded-full cursor-pointer border[5px] border-white"
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
                                              className=" rounded-lg border[2px] border-white "
                                              style={{ transition: ".5s" }}
                                            ></img>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="w-[40px] h-[40px]  m-[5px] rounded-full cursor-pointer border[5px] border-white"
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
                                              className=" rounded-lg border[2px] border-white opacity-[.3] hover:opacity-100"
                                              style={{ transition: ".5s" }}
                                            ></img>
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
                        </>
                      )}
                    </div>
                    {/* <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start mt-[15px] items-center cursor-pointer ">
                      <BsLinkedin className="text-[#5841d9] text-[18px] drop-shadow-lg" />{" "}
                      <BsGithub className="text-[#5841d9] ml-[20px] text-[18px] drop-shadow-lg" />
                    </div> */}
                  </div>
                </div>
                <div
                  className=" h-[100vh] w-[100%] lg:w-[80%] md:w-[80%] flex items-center flex-col"
                  style={{ transition: ".5s" }}
                >
                  <div
                    className="h-[70px] pr-[0] lg:pr-[60px] md:pr-[60px]  w-full bg-[white] text-black flex justify-center items-center  font-semibold"
                    style={{ transition: ".5s" }}
                    // style={{ transition: ".5s" }}
                  >
                    <img src={logo} className="h-[40px] drop-shadow-lg"></img>
                    <span className="ml-[15px]  text-[25px] font-[nunitosans] drop-shadow-lg">
                      WALLE
                    </span>
                  </div>
                  {chatMessage.length === 0 ? (
                    <>
                      {temp.length === 0 ? (
                        <>
                          <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                            <div className="w-full h-[calc(100%-80px)] flex justify-center items-center  mb-[20px] overflow-y-scroll">
                              <img
                                src={logo}
                                className="h-[300px] opacity-5"
                              ></img>
                            </div>
                            <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                              <button
                                className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
                                style={{ zIndex: "3" }}
                                onClick={SpeechRecognition.startListening}
                              >
                                <BiSolidMicrophone
                                  className="text-[#5841d9] "
                                  style={{ transition: ".3s" }}
                                />
                              </button>
                              <input
                                placeholder="Create New Chat Segment First"
                                className="placeholder:text-orange-400 w-full h-full px-[60px] rounded-lg outline-none bg-[#fff] text-[black] flex justify-center items-center font-[nunitosans] "
                                style={{ transition: ".5s" }}
                                value={""}
                              ></input>

                              <div className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[white] drop-shadow-lg">
                                <IoMdSend
                                  className="text-[#5841d9] "
                                  style={{ transition: ".3s" }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                            <div className="w-full h-[calc(100%-80px)] flex justify-center items-center  mb-[20px] overflow-y-scroll">
                              <img
                                src={logo}
                                className="h-[300px] opacity-5"
                              ></img>
                            </div>
                            <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                              <button
                                className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
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
                                      className="text-[#5841d9] hover:text-[#8976f2]"
                                      style={{ transition: ".3s" }}
                                    />
                                  </>
                                )}
                              </button>
                              <input
                                placeholder="Ask Anything"
                                className="w-full h-full px-[60px] rounded-lg outline-none bg-[#fff] text-[black] flex justify-center items-center font-[nunitosans] "
                                style={{ transition: ".5s" }}
                                value={input}
                                onKeyDown={(e) => {
                                  // console.log(e);
                                  if (e.nativeEvent.key === "Enter") {
                                    // console.log("enter");
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
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                      <div className="w-full h-[calc(100%-80px)]  mb-[20px] overflow-y-scroll">
                        {chatMessage.map((mssg, index) => {
                          return (
                            <>
                              <div className="w-full flex flex-col ">
                                <span
                                  className="px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-black "
                                  // style={{ transition: ".5s" }}
                                >
                                  <div
                                    className="group  w-full flex p-[19px] border-[2px] border-[#f3f5f8] rounded-lg hover:border-l-[2px] hover:border-l-[#5841d9]"
                                    style={{ transition: ".5s" }}
                                  >
                                    <div className="w-[40px] h-[40px] rounded-sm bg-slate-500">
                                      <img
                                        src={selectAvatar}
                                        className="rounded-sm"
                                        loading="lazy"
                                      ></img>
                                    </div>
                                    <span className="w-[calc(100%-70px)]  overflow-x-hidden ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] ">
                                      {mssg.user}
                                    </span>
                                    <div
                                      className="w-[30px] h-[40px]   rounded-sm opacity-0 flex justify-end items-center group-hover:opacity-100 transition-opacity duration-300 cursor-pointer "
                                      onClick={() => {
                                        deleteSpecificChat(mssg.id);
                                        toast.success("Chat Deleted");
                                      }}
                                    >
                                      <MdDelete className="text-[20px]" />
                                    </div>
                                  </div>
                                </span>
                                <span
                                  className="group px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-black "
                                  // style={{ transition: ".5s" }}
                                >
                                  <div
                                    className="bg-[white]  w-full flex p-[19px] border-l-[2px] border-[white] rounded-lg hover:border-l-[2px] hover:border-[#5841d9] "
                                    style={{ transition: ".5s" }}
                                  >
                                    <img
                                      src={ai}
                                      className="w-[40px] h-[40px] rounded-sm bg-slate-500"
                                    ></img>
                                    <pre
                                      className=" w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] whitespace-pre-wrap "
                                      // style={{ transition: ".5s" }}
                                    >
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
                                          <span id={index} className="">
                                            {mssg.assistant.substr(
                                              2,
                                              mssg.assistant.length - 1
                                            )}
                                          </span>
                                        </>
                                      )}
                                    </pre>
                                    <div
                                      className="w-[30px] h-[40px]   rounded-sm opacity-0 flex justify-end items-center group-hover:opacity-100 transition-opacity duration-300 cursor-pointer "
                                      // style={{ transition: ".3s" }}
                                      onClick={() => {
                                        // CopyToClipboard(index);
                                        navigator.clipboard.writeText(
                                          mssg.assistant.substr(
                                            2,
                                            mssg.assistant.length - 1
                                          )
                                        );
                                        toast.success("Copied to Clipboard");
                                        // deleteSingleChat(index);
                                      }}
                                    >
                                      <HiOutlineClipboard className="text-[20px]" />
                                    </div>
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
                          className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
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
                                className="text-[#5841d9] hover:text-[#8976f2]"
                                style={{ transition: ".3s" }}
                              />
                            </>
                          )}
                        </button>
                        <input
                          placeholder="Ask Anything"
                          className="w-full h-full px-[60px] rounded-lg outline-none bg-[#white] text-[black] flex justify-center items-center font-[nunitosans] "
                          style={{ transition: ".5s" }}
                          value={input}
                          onKeyDown={(e) => {
                            // console.log(e);
                            if (e.nativeEvent.key === "Enter") {
                              // console.log("enter");
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
                  )}
                </div>
              </>
            ) : (
              <>
                <div
                  className="bg-[white] h-[100vh] w-[0] border-r-[1px] border-[#eff1f4] flex flex-col justify-between items-center  fixed lg:relative md:relative"
                  style={{ transition: ".5s", zIndex: "4" }}
                >
                  <div
                    className="w-full h-[70px]   p-[10px] flex justify-center items-center "
                    style={{ transition: ".5s" }}
                  >
                    <div className="w-[calc(100%-60px)] mr-[10px] h-full   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer">
                      <BiPlus className="text-black text-[20px] " />
                      <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans]  ">
                        New Chat
                      </span>
                    </div>
                    <div
                      className="w-[0] h-full  rounded-xl  flex justify-center items-center cursor-pointer "
                      onClick={() => setIsSidebar(!isSidebar)}
                    >
                      <FiSidebar className="text-black text-[18px] " />
                    </div>
                  </div>
                  {/* ----------------------------- Chat Segment ---------------------------- */}
                  <div
                    id="chatSegmentLightClose"
                    className="w-[calc(100%-20px)] px-[0] h-[calc(100vh-270px)] py-[10px] overflow-y-scroll text-[white]"
                    style={{ transition: ".5s" }}
                  >
                    {temp.map((segment) => {
                      return (
                        <>
                          {segment.chatId === toggleCreateNewChatInput ? (
                            <>
                              <div className="group w-full flex justify-center items-center my-[15px]">
                                <div
                                  className="px-[15px] rounded-lg cursor-pointer  bg-[#5841d9]  whitespace-nowrap w-full h-[50px]  flex justify-start items-center"
                                  style={{ transition: ".3s" }}
                                >
                                  <span className="w-full text-ellipsis overflow-hidden ">
                                    {segment.chatId}
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="group w-full flex justify-center items-center my-[15px]">
                                <div
                                  className="px-[15px] rounded-lg cursor-pointer  bg-[#f8fafc] text-black  whitespace-nowrap w-full h-[50px] flex justify-start items-center"
                                  style={{ transition: ".3s" }}
                                >
                                  <span className="w-full text-ellipsis overflow-hidden ">
                                    {segment.chatId}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })}
                  </div>
                  {/* <div
                    onClick={() => setAvatar(!avatar)}
                    style={{ transition: ".5s" }}
                    className="w-0  p-[0]  text-black cursor-pointer overflow-hidden font-[nunitosans] flex justify-start items-center
                    "
                  >
                    <span className="w-0 overflow-hidden">Select Avatar</span>
                    {avatar === true ? (
                      <IoMdArrowDropup className="text-black text-[24px] drop-shadow-lg w-[30px]  flex justify-end" />
                    ) : (
                      <IoMdArrowDropdown className="text-black text-[24px] drop-shadow-lg w-[30px]  flex justify-end" />
                    )}
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
                  )} */}
                  <div className="w-[calc(100%-20px)] h-[200px]  mx-[10px] py-[10px] flex flex-col justify-center items-center  border-t-[2px] border-[#eff1f4]">
                    <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer  my-[4px] ">
                      <IoSettingsOutline className="text-[black] drop-shadow-lg text-[18px]" />

                      <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                        Settings
                      </span>
                    </div>
                    <div className="w-full h-[192px]  overflow-y-scroll">
                      <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px]  ">
                        <MdDarkMode className="text-[black] drop-shadow-lg text-[18px]" />

                        <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                          Dark Mode
                        </span>
                      </div>
                      <div className="w-full h-[40px]    rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px]  ">
                        <FiLogOut className="text-[black] drop-shadow-lg text-[18px]" />

                        <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                          Logout
                        </span>
                      </div>
                      <div
                        className="w-full h-[40px] text-black  rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] "
                        onClick={() => {
                          if (chatMessage.length > 0) {
                            toast.success("Chats Deleted Successfully");
                          } else {
                            toast.error("No Chats to Delete");
                          }
                          checkChatlength();
                          DeleteChatHistoryFromFirebase();

                          getChatHistoryFromFirestore();
                          AddFetchedChatHistoryToReactStore();
                        }}
                      >
                        <BsChatSquareText className="text-[black] text-[18px]" />

                        <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[nunitosans] text-[14px] ">
                          Delete Chats
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className=" h-[100vh] w-[100%] flex items-center flex-col"
                  style={{ transition: ".5s" }}
                >
                  <div className="h-[70px] w-full bg-[white] text-white flex justify-center items-center font-[wakanda] font-semibold">
                    <div
                      className="w-[50px] h-[50px] ml-[10px] rounded-xl  flex justify-center items-center cursor-pointer"
                      style={{ transition: ".5s" }}
                      onClick={() => setIsSidebar(!isSidebar)}
                    >
                      <FiSidebar className="text-black text-[18px] drop-shadow-lg" />
                    </div>

                    <div className="ml-[-60px] h-[70px] w-full bg-[white] text-black flex justify-center items-center  font-semibold">
                      <img src={logo} className="h-[40px] drop-shadow-lg"></img>
                      <span className="ml-[15px] text-[25px] font-[nunitosans] drop-shadow-lg">
                        WALLE
                      </span>
                    </div>
                  </div>
                  {chatMessage.length === 0 ? (
                    <>
                      {temp.length === 0 ? (
                        <>
                          <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                            <div className="w-full h-[calc(100%-80px)] flex justify-center items-center  mb-[20px] overflow-y-scroll">
                              <img
                                src={logo}
                                className="h-[300px] opacity-5"
                              ></img>
                            </div>
                            <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                              <button
                                className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
                                style={{ zIndex: "3" }}
                                onClick={SpeechRecognition.startListening}
                              >
                                <BiSolidMicrophone
                                  className="text-[#5841d9] "
                                  style={{ transition: ".3s" }}
                                />
                              </button>
                              <input
                                placeholder="Create New Chat Segment First"
                                className="placeholder:text-orange-400 w-full h-full px-[60px] rounded-lg outline-none bg-[#fff] text-[black] flex justify-center items-center font-[nunitosans] "
                                style={{ transition: ".5s" }}
                                value={""}
                              ></input>

                              <div className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[white] drop-shadow-lg">
                                <IoMdSend
                                  className="text-[#5841d9] "
                                  style={{ transition: ".3s" }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                            <div className="w-full h-[calc(100%-80px)] flex justify-center items-center  mb-[20px] overflow-y-scroll">
                              <img
                                src={logo}
                                className="h-[300px] opacity-5"
                              ></img>
                            </div>
                            <div className="w-full h-[60px] flex justify-center items-center px-[20px] lg:px-[10%]  md:px-[10%]  ">
                              <button
                                className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
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
                                      className="text-[#5841d9] hover:text-[#8976f2]"
                                      style={{ transition: ".3s" }}
                                    />
                                  </>
                                )}
                              </button>
                              <input
                                placeholder="Ask Anything"
                                className="w-full h-full px-[60px] rounded-lg outline-none bg-[#fff] text-[black] flex justify-center items-center font-[nunitosans] "
                                style={{ transition: ".5s" }}
                                value={input}
                                onKeyDown={(e) => {
                                  // console.log(e);
                                  if (e.nativeEvent.key === "Enter") {
                                    // console.log("enter");
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
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full  h-[calc(100%-70px)] pb-[20px]  flex flex-col justify-start items-center">
                      <div className="w-full h-[calc(100%-80px)]  mb-[20px] overflow-y-scroll">
                        {chatMessage.map((mssg, index) => {
                          return (
                            <>
                              <div className="w-full flex flex-col ">
                                <span
                                  className="px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-black "
                                  style={{ transition: ".5s" }}
                                >
                                  <div className="group  w-full flex p-[19px] border-[2px] border-[#f3f5f8] rounded-lg hover:border-l-[2px] hover:border-l-[#5841d9]">
                                    <div className="w-[40px] h-[40px] rounded-sm bg-slate-500">
                                      <img
                                        src={selectAvatar}
                                        className="rounded-sm"
                                        loading="lazy"
                                      ></img>
                                    </div>
                                    <span className="w-[calc(100%-70px)]  overflow-x-hidden ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] ">
                                      {mssg.user}
                                    </span>
                                    <div
                                      className="w-[30px] h-[40px]   rounded-sm opacity-0 flex justify-end items-center group-hover:opacity-100 transition-opacity duration-300 cursor-pointer "
                                      onClick={() => {
                                        deleteSpecificChat(mssg.id);
                                        toast.success("Chat Deleted");
                                      }}
                                    >
                                      <MdDelete className="text-[20px]" />
                                    </div>
                                  </div>
                                </span>
                                <span
                                  className="group px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-black "
                                  // style={{ transition: ".5s" }}
                                >
                                  <div
                                    className="bg-[white]  w-full flex p-[19px] border-l-[2px] border-[white] rounded-lg hover:border-l-[2px] hover:border-[#5841d9] "
                                    style={{ transition: ".5s" }}
                                  >
                                    <img
                                      src={ai}
                                      className="w-[40px] h-[40px] rounded-sm bg-slate-500"
                                    ></img>
                                    <pre
                                      className=" w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[nunitosans] whitespace-pre-wrap "
                                      // style={{ transition: ".5s" }}
                                    >
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
                                          <span id={index} className="">
                                            {mssg.assistant.substr(
                                              2,
                                              mssg.assistant.length - 1
                                            )}
                                          </span>
                                        </>
                                      )}
                                    </pre>
                                    <div
                                      className="w-[30px] h-[40px]   rounded-sm opacity-0 flex justify-end items-center group-hover:opacity-100 transition-opacity duration-300 cursor-pointer "
                                      // style={{ transition: ".3s" }}
                                      onClick={() => {
                                        // CopyToClipboard(index);
                                        navigator.clipboard.writeText(
                                          mssg.assistant.substr(
                                            2,
                                            mssg.assistant.length - 1
                                          )
                                        );
                                        toast.success("Copied to Clipboard");
                                        // deleteSingleChat(index);
                                      }}
                                    >
                                      <HiOutlineClipboard className="text-[20px]" />
                                    </div>
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
                          className="outline-none  h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
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
                                className="text-[#5841d9] hover:text-[#8976f2]"
                                style={{ transition: ".3s" }}
                              />
                            </>
                          )}
                        </button>
                        <input
                          placeholder="Ask Anything"
                          className="w-full h-full px-[60px] rounded-lg outline-none bg-[#white] text-[black] flex justify-center items-center font-[nunitosans] "
                          style={{ transition: ".5s" }}
                          value={input}
                          onKeyDown={(e) => {
                            // console.log(e);
                            if (e.nativeEvent.key === "Enter") {
                              // console.log("enter");
                              handleSend();
                              setInput("");
                            }
                          }}
                          onChange={(e) => setInput(e.target.value)}
                        ></input>

                        <div
                          className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[#5841d9] drop-shadow-lg"
                          onClick={() => {
                            handleSend();
                            setInput("");
                          }}
                        >
                          <IoMdSend
                            className="text-[white]] hover:text-[#8976f2]"
                            style={{ transition: ".3s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Body;

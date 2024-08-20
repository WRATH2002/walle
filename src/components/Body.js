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
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-python";
import "prismjs/components/prism-python";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-java";
import "prismjs/components/prism-css";
import "../assets/style/prism-vsc-dark-plus.css";
// import "prismjs/themes/prism-monokai.css";
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

// function escapeHtml(text) {
//   const map = {
//     "&": "&amp;",
//     "<": "&lt;",
//     ">": "&gt;",
//     '"': "&quot;",
//     "'": "&#039;",
//   };
//   return text.replace(/[&<>"']/g, function (m) {
//     return map[m];
//   });
// }

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

    chatMessage = "";
  }, [id]);

  // ------------------------------------------------------- -------
  useEffect(() => {
    console.log("chatHistory");
    console.log(chatHistory);
    AddFetchedChatHistoryToReactStore();
  }, [chatHistory]);

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
    console.log("saving chat history to React Redux : data -->");
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
    console.log("Function to store data to Firestore: Data -->");
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

    setTempResult("");
    getChatHistoryFromFirestore();
    AddFetchedChatHistoryToReactStore();
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
  const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-exp-0801",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run(inputt) {
    const chatSession = model.startChat({
      generationConfig,
      history: prevChatHistory(),
    });

    const result = await chatSession.sendMessage(inputt);
    console.log("Gemini Generated Answer");
    console.log(result.response.text());
    setResult(result.response.text());
    setTempResult(result.response.text());
  }

  const handleSend = async () => {
    if (input === "") {
      console.log("The prompt is empty");
    } else {
      dispatch(addMessage({ user: input, id: id, assistant: tempInput }));
    }
    run(input);
  };
  // -------------------------------------------------------Function to Add Generated Answer to React Store------
  function setAns() {
    console.log("Answer set to React Redux");
    console.log(result);
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
    var copyText = document.getElementById("2");
    console.log(copyText);
    const area = document.createElement("textarea");
    area.value = copyText.innerText;
    area.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(area.value);
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

  // ------------------------------------------------------------------------- Function to format the text and dangerously set to the pre tag
  function escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }

  function formatText(text) {
    text = text.replace(/```(.*?)```/gs, (match, p1) => {
      if (p1.trim() === "") {
        return "";
      }

      const lines = p1.trim().split("\n");
      const language = lines[0].trim().toLowerCase(); // Lowercase for consistency
      const codeLines = lines.slice(1);

      // Determine minimum indentation
      const minIndentation = Math.min(
        ...codeLines
          .filter((line) => line.trim() !== "")
          .map((line) => {
            const match = line.match(/^\s*/);
            return match ? match[0].length : 0;
          })
      );

      // Remove minimum indentation
      const code = codeLines
        .map((line) => line.slice(minIndentation))
        .join("\n");

      return `
      <div style="width: 100%; height: auto; white-space: pre-wrap; background-color: #1e1e1e; color: white; border-radius: 16px; display: flex; flex-direction: column; justify-content: start; align-items: start;    padding: 0px 0px 15px 0px;">
        <div style="width: 100%; height: 40px; background-color: #000000; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0px 15px; border-radius: 16px 16px 0px 0px">
          <span style="color: #acacac">${language}</span>
          <button style="width: auto; height: auto; white-space: nowrap; color: white;">copy</button>
        </div>
        <pre style="padding: 15px; width: 100%; overflow-x: scroll"><code class="language-${language}">${escapeHtml(
        code
      )}</code></pre>
      </div>
    `;
    });

    // Inline code formatting
    text = text.replace(
      /`([^`]+)`/g,
      (match, p1) => `<code>${escapeHtml(p1)}</code>`
    );

    // Bold text formatting
    text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Bullet point replacement
    text = text.replace(/\*(?!\*|$)/g, "•");

    // Header formatting
    text = text.replace(/##(.*?)(?=\n|$)/g, "<b>$1</b>");

    // URL formatting
    text = text.replace(
      /(https:\/\/[^\s]+)/g,
      '<a href="$1" class="bold" target="_blank">$1</a>'
    );

    return text;
  }

  useEffect(() => {
    Prism.highlightAll();
  });

  // useEffect(() => {
  function prevChatHistory() {
    var array = [];
    if (chatMessage.length != 0) {
      chatMessage.map((data) => {
        array.push({ role: "user", parts: [{ text: data.user }] });
        array.push({ role: "model", parts: [{ text: data.assistant }] });
      });
    }
    return array;
  }
  // }, [chatMessage]);

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
                            <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] ">
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
                            className="ml-[15px] w-full text-[white] bg-[#1c1f37] rounded-lg h-[50px] overflow-hidden whitespace-nowrap font-[book] outline-none px-[15px] pr-[35px]"
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
                      className="w-[50px] h-full  rounded-xl  flex justify-center items-center cursor-pointer text-white"
                      onClick={() => {
                        setIsSidebar(!isSidebar);
                        setAvatar(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-minimize"
                      >
                        <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                        <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                        <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                        <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                      </svg>
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

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] ">
                        Himadri Purkait
                      </span>
                    </div> */}
                    {/* <div
                    onClick={() => setAvatar(!avatar)}
                    className="text-white cursor-pointer font-[book] "
                  >
                    Select Avatar
                  </div> */}

                    {/* ---------------------------------- */}
                    <div
                      className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] text-[white] "
                      onClick={() => setAvatar(!avatar)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-bolt"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
                        Settings
                      </span>
                    </div>
                    <div className="w-full h-[192px]  overflow-y-scroll text-[white]">
                      {avatar === false ? (
                        <>
                          <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer  my-[4px]">
                            <div className="w-[calc(100%-40px)] flex">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-moon"
                              >
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                              </svg>

                              <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-log-out"
                            >
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>

                            <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-message-square-dot"
                            >
                              <path d="M11.7 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2v-2.7" />
                              <circle cx="18" cy="6" r="3" />
                            </svg>

                            <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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

                        <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                    <span className="ml-[15px] text-[25px] font-[azonix]">
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
                                className="placeholder:text-orange-400 w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[book] "
                                style={{ transition: ".5s" }}
                                value={""}
                              ></input>

                              <div className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[white] drop-shadow-lg">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-arrow-up"
                                >
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
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
                                className="outline-none text-white h-[60px] w-[60px] flex justify-center items-center text-[23px] mr-[-60px] "
                                style={{ zIndex: "3" }}
                                onClick={SpeechRecognition.startListening}
                              >
                                {listening == true ? (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      class="lucide lucide-audio-lines"
                                    >
                                      <path d="M2 10v3" />
                                      <path d="M6 6v11" />
                                      <path d="M10 3v18" />
                                      <path d="M14 8v7" />
                                      <path d="M18 5v13" />
                                      <path d="M22 10v3" />
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      class="lucide lucide-mic"
                                    >
                                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                      <line x1="12" x2="12" y1="19" y2="22" />
                                    </svg>
                                  </>
                                )}
                              </button>
                              <input
                                placeholder="Ask Anything"
                                className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[book] "
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
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-arrow-up"
                                >
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
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
                                    className="group  w-full flex p-[19px] border-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-l-transparent"
                                    style={{ transition: ".5s" }}
                                  >
                                    <div className="w-[40px] h-[40px] rounded-lg bg-slate-500">
                                      <img
                                        src={selectAvatar}
                                        className="rounded-lg"
                                        loading="lazy"
                                      ></img>
                                    </div>
                                    <span className="w-[calc(100%-70px)]  overflow-x-hidden ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] ">
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
                                    className="bg-[#1c1f37]  w-full flex p-[19px] border-l-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-transparent "
                                    style={{ transition: ".5s" }}
                                  >
                                    <div
                                      // src={ai}
                                      className="w-[40px] h-[40px] rounded-lg bg-[#101116] text-white flex justify-center items-center "
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="lucide lucide-bot-message-square"
                                      >
                                        <path d="M12 6V2H8" />
                                        <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
                                        <path d="M2 12h2" />
                                        <path d="M9 11v2" />
                                        <path d="M15 11v2" />
                                        <path d="M20 12h2" />
                                      </svg>
                                    </div>
                                    <pre
                                      className=" w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] whitespace-pre-wrap "
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
                                          <span
                                            id={index}
                                            className=""
                                            dangerouslySetInnerHTML={{
                                              __html: formatText(
                                                mssg.assistant
                                              ),
                                            }}
                                          >
                                            {/* {mssg.assistant} */}
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
                          className="outline-none  h-[60px] w-[60px] text-white flex justify-center items-center text-[23px] mr-[-60px] "
                          style={{ zIndex: "3" }}
                          onClick={SpeechRecognition.startListening}
                        >
                          {listening == true ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-audio-lines"
                              >
                                <path d="M2 10v3" />
                                <path d="M6 6v11" />
                                <path d="M10 3v18" />
                                <path d="M14 8v7" />
                                <path d="M18 5v13" />
                                <path d="M22 10v3" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-mic"
                              >
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" x2="12" y1="19" y2="22" />
                              </svg>
                            </>
                          )}
                        </button>
                        <input
                          placeholder="Ask Anything"
                          className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[book] "
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-arrow-up"
                          >
                            <path d="m5 12 7-7 7 7" />
                            <path d="M12 19V5" />
                          </svg>
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
                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] ">
                        New Chat
                      </span>
                    </div>
                    <div
                      className="w-[0] h-full  rounded-xl  flex justify-center items-center cursor-pointer text-white "
                      onClick={() => setIsSidebar(!isSidebar)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-minimize"
                      >
                        <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                        <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                        <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                        <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                      </svg>
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

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] ">
                        Himadri Purkait
                      </span>
                    </div> */}
                    <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-bolt"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>

                      <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
                        Settings
                      </span>
                    </div>
                    <div className="w-full h-[192px]  overflow-y-scroll">
                      <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-moon"
                        >
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>

                        <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
                          Dark Mode
                        </span>
                      </div>
                      <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px] ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-log-out"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>

                        <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-message-square-dot"
                        >
                          <path d="M11.7 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2v-2.7" />
                          <circle cx="18" cy="6" r="3" />
                        </svg>

                        <span className="ml-[15px] text-[white] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                      className="w-[50px] h-[50px] ml-[10px] rounded-xl  flex justify-center items-center cursor-pointer text-white"
                      style={{ transition: ".5s", zIndex: "4" }}
                      onClick={() => setIsSidebar(!isSidebar)}
                    >
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-maximize"
                      >
                        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                      </svg>
                    </div>

                    <div className="h-[70px] ml-[-60px] w-full bg-[#141627] text-white flex justify-center items-center  font-semibold">
                      <img src={logo} className="h-[40px]"></img>
                      <span className="ml-[15px] text-[25px] font-[azonix]">
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
                                className="placeholder:text-orange-400 w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[book] "
                                style={{ transition: ".5s" }}
                                value={""}
                              ></input>

                              <div className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[white] drop-shadow-lg">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-arrow-up"
                                >
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
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
                                className="outline-none  h-[60px] w-[60px] text-white flex justify-center items-center text-[23px] mr-[-60px] "
                                style={{ zIndex: "3" }}
                                onClick={SpeechRecognition.startListening}
                              >
                                {listening == true ? (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      class="lucide lucide-audio-lines"
                                    >
                                      <path d="M2 10v3" />
                                      <path d="M6 6v11" />
                                      <path d="M10 3v18" />
                                      <path d="M14 8v7" />
                                      <path d="M18 5v13" />
                                      <path d="M22 10v3" />
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      class="lucide lucide-mic"
                                    >
                                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                      <line x1="12" x2="12" y1="19" y2="22" />
                                    </svg>
                                  </>
                                )}
                              </button>
                              <input
                                placeholder="Ask Anything"
                                className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[book] "
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
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-arrow-up"
                                >
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
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
                                  <div className="group  w-full flex p-[19px] border-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-l-transparent">
                                    <div className="w-[40px] h-[40px] rounded-lg bg-slate-500">
                                      <img
                                        src={selectAvatar}
                                        className="rounded-lg"
                                        loading="lazy"
                                      ></img>
                                    </div>
                                    <span className="w-[calc(100%-70px)]  overflow-x-hidden ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] ">
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
                                    className="bg-[#1c1f37]  w-full flex p-[19px] border-l-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-transparent "
                                    style={{ transition: ".5s" }}
                                  >
                                    <div
                                      // src={ai}
                                      className="w-[40px] h-[40px] rounded-lg bg-[#101116] text-white flex justify-center items-center "
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="lucide lucide-bot-message-square"
                                      >
                                        <path d="M12 6V2H8" />
                                        <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
                                        <path d="M2 12h2" />
                                        <path d="M9 11v2" />
                                        <path d="M15 11v2" />
                                        <path d="M20 12h2" />
                                      </svg>
                                    </div>
                                    <pre
                                      className=" w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] whitespace-pre-wrap "
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
                                          <span
                                            id={index}
                                            className=""
                                            dangerouslySetInnerHTML={{
                                              __html: formatText(
                                                mssg.assistant
                                              ),
                                            }}
                                          >
                                            {/* {mssg.assistant} */}
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
                          className="outline-none  h-[60px] w-[60px] text-white flex justify-center items-center text-[23px] mr-[-60px] "
                          style={{ zIndex: "3" }}
                          onClick={SpeechRecognition.startListening}
                        >
                          {listening == true ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-audio-lines"
                              >
                                <path d="M2 10v3" />
                                <path d="M6 6v11" />
                                <path d="M10 3v18" />
                                <path d="M14 8v7" />
                                <path d="M18 5v13" />
                                <path d="M22 10v3" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-mic"
                              >
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" x2="12" y1="19" y2="22" />
                              </svg>
                            </>
                          )}
                        </button>
                        <input
                          placeholder="Ask Anything"
                          className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[book] "
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-arrow-up"
                          >
                            <path d="m5 12 7-7 7 7" />
                            <path d="M12 19V5" />
                          </svg>
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
                                      className="rounded-lg"
                                      loading="lazy"
                                    ></img>
                                  </div>
                                  <span className="w-[calc(100%-65px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] ">
                                    {mssg.user}
                                  </span>
                                </div>
                              </span>
                              <span className="group px-[20px] lg:px-[10%]  md:px-[10%]  py-[15px] flex  items-start w-full text-white ">
                                <div
                                  className="bg-[#1c1f37]  w-full flex p-[19px] border-l-[2px] border-[#1c1f37] rounded-lg hover:border-l-[2px] hover:border-transparent "
                                  style={{ transition: ".3s" }}
                                >
                                  <img
                                    src={ai}
                                    className="w-[40px] h-[40px] rounded-lg bg-slate-500"
                                  ></img>
                                  <pre className="w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] whitespace-pre-wrap ">
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
                        className="w-full h-full px-[60px] rounded-lg outline-none bg-[#1c1f37] text-[white] flex justify-center items-center font-[book] "
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
                            <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book] ">
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
                            className="ml-[15px] w-full text-[black] bg-[#f8fafc] rounded-lg h-[50px] overflow-hidden whitespace-nowrap font-[book] outline-none px-[15px] pr-[35px]"
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-minimize"
                      >
                        <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                        <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                        <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                        <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-bolt"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>

                      <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book] text-[14px] drop-shadow-lg ">
                        Settings
                      </span>
                    </div>
                    <div className="w-full h-[192px]  overflow-y-scroll">
                      {avatar === false ? (
                        <>
                          <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer  my-[4px]">
                            <div className="w-[calc(100%-40px)] flex">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-moon"
                              >
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                              </svg>

                              <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-log-out"
                            >
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>

                            <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-message-square-dot"
                            >
                              <path d="M11.7 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2v-2.7" />
                              <circle cx="18" cy="6" r="3" />
                            </svg>

                            <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                    <span className="ml-[15px]  text-[25px] font-[azonix] drop-shadow-lg">
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
                                className="placeholder:text-orange-400 w-full h-full px-[60px] rounded-lg outline-none bg-[#fff] text-[black] flex justify-center items-center font-[book] "
                                style={{ transition: ".5s" }}
                                value={""}
                              ></input>

                              <div className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[#000000] drop-shadow-lg">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-arrow-up"
                                >
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
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
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      class="lucide lucide-audio-lines"
                                    >
                                      <path d="M2 10v3" />
                                      <path d="M6 6v11" />
                                      <path d="M10 3v18" />
                                      <path d="M14 8v7" />
                                      <path d="M18 5v13" />
                                      <path d="M22 10v3" />
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      class="lucide lucide-mic"
                                    >
                                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                      <line x1="12" x2="12" y1="19" y2="22" />
                                    </svg>
                                  </>
                                )}
                              </button>
                              <input
                                placeholder="Ask Anything"
                                className="w-full h-full px-[60px] rounded-lg outline-none bg-[#fff] text-[black] flex justify-center items-center font-[book] "
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
                                className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[#000000] drop-shadow-lg"
                                onClick={() => {
                                  handleSend();
                                  setInput("");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-arrow-up"
                                >
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
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
                                    className="group  w-full flex p-[19px] border-[2px] border-[#f3f5f8] rounded-lg hover:border-l-[2px] hover:border-l-transparent"
                                    style={{ transition: ".5s" }}
                                  >
                                    <div className="w-[40px] h-[40px] rounded-lg bg-slate-500">
                                      <img
                                        src={selectAvatar}
                                        className="rounded-lg"
                                        loading="lazy"
                                      ></img>
                                    </div>
                                    <span className="w-[calc(100%-70px)]  overflow-x-hidden ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] ">
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
                                    className="bg-[white]  w-full flex p-[19px] border-l-[2px] border-[white] rounded-lg hover:border-l-[2px] hover:border-transparent "
                                    style={{ transition: ".5s" }}
                                  >
                                    <div
                                      // src={ai}
                                      className="w-[40px] h-[40px] rounded-lg bg-[#101116] text-white flex justify-center items-center "
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="lucide lucide-bot-message-square"
                                      >
                                        <path d="M12 6V2H8" />
                                        <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
                                        <path d="M2 12h2" />
                                        <path d="M9 11v2" />
                                        <path d="M15 11v2" />
                                        <path d="M20 12h2" />
                                      </svg>
                                    </div>
                                    <pre
                                      className=" w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] whitespace-pre-wrap "
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
                                          <span
                                            id={index}
                                            className=""
                                            dangerouslySetInnerHTML={{
                                              __html: formatText(
                                                mssg.assistant
                                              ),
                                            }}
                                          >
                                            {/* {mssg.assistant} */}
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-audio-lines"
                              >
                                <path d="M2 10v3" />
                                <path d="M6 6v11" />
                                <path d="M10 3v18" />
                                <path d="M14 8v7" />
                                <path d="M18 5v13" />
                                <path d="M22 10v3" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-mic"
                              >
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" x2="12" y1="19" y2="22" />
                              </svg>
                            </>
                          )}
                        </button>
                        <input
                          placeholder="Ask Anything"
                          className="w-full h-full px-[60px] rounded-lg outline-none bg-[#white] text-[black] flex justify-center items-center font-[book] "
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
                          className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[#000000] drop-shadow-lg"
                          onClick={() => {
                            handleSend();
                            setInput("");
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-arrow-up"
                          >
                            <path d="m5 12 7-7 7 7" />
                            <path d="M12 19V5" />
                          </svg>
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
                      <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book]  ">
                        New Chat
                      </span>
                    </div>
                    <div
                      className="w-[0] h-full  rounded-xl  flex justify-center items-center cursor-pointer "
                      onClick={() => setIsSidebar(!isSidebar)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-minimize"
                      >
                        <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                        <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                        <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                        <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                      </svg>
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
                    className="w-0  p-[0]  text-black cursor-pointer overflow-hidden font-[book] flex justify-start items-center
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-bolt"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>

                      <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
                        Settings
                      </span>
                    </div>
                    <div className="w-full h-[192px]  overflow-y-scroll">
                      <div className="w-full h-[40px]   rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px]  ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-moon"
                        >
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>

                        <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
                          Dark Mode
                        </span>
                      </div>
                      <div className="w-full h-[40px]    rounded-xl  px-[15px] flex justify-start items-center cursor-pointer my-[4px]  ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-log-out"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>

                        <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-message-square-dot"
                        >
                          <path d="M11.7 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2v-2.7" />
                          <circle cx="18" cy="6" r="3" />
                        </svg>

                        <span className="ml-[15px] text-[black] overflow-hidden whitespace-nowrap font-[book] text-[14px] ">
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
                  <div className="h-[70px] w-full bg-[white]  flex justify-center items-center font-[wakanda] font-semibold">
                    <div
                      className="w-[50px] h-[50px] ml-[10px] rounded-xl  flex justify-center items-center cursor-pointer z-50"
                      style={{ transition: ".5s" }}
                      onClick={() => setIsSidebar(!isSidebar)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-maximize"
                      >
                        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                      </svg>
                    </div>

                    <div className="ml-[-60px] h-[70px] w-full bg-[white] text-black flex justify-center items-center  font-semibold">
                      <img src={logo} className="h-[40px] drop-shadow-lg"></img>
                      <span className="ml-[15px] text-[25px] font-[azonix] drop-shadow-lg">
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
                                className="placeholder:text-orange-400 w-full h-full px-[60px] rounded-lg outline-none bg-[#fff] text-[black] flex justify-center items-center font-[book] "
                                style={{ transition: ".5s" }}
                                value={""}
                              ></input>

                              <div className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[#000000] drop-shadow-lg">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-arrow-up"
                                >
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
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
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      class="lucide lucide-audio-lines"
                                    >
                                      <path d="M2 10v3" />
                                      <path d="M6 6v11" />
                                      <path d="M10 3v18" />
                                      <path d="M14 8v7" />
                                      <path d="M18 5v13" />
                                      <path d="M22 10v3" />
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      class="lucide lucide-mic"
                                    >
                                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                      <line x1="12" x2="12" y1="19" y2="22" />
                                    </svg>
                                  </>
                                )}
                              </button>
                              <input
                                placeholder="Ask Anything"
                                className="w-full h-full px-[60px] rounded-lg outline-none bg-[#fff] text-[black] flex justify-center items-center font-[book] "
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
                                className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[#000000] drop-shadow-lg"
                                onClick={() => {
                                  handleSend();
                                  setInput("");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-arrow-up"
                                >
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
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
                                  <div className="group  w-full flex p-[19px] border-[2px] border-[#f3f5f8] rounded-lg hover:border-l-[2px] hover:border-l-transparent">
                                    <div className="w-[40px] h-[40px] rounded-lg bg-slate-500">
                                      <img
                                        src={selectAvatar}
                                        className="rounded-lg"
                                        loading="lazy"
                                      ></img>
                                    </div>
                                    <span className="w-[calc(100%-70px)]  overflow-x-hidden ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] ">
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
                                    className="bg-[white]  w-full flex p-[19px] border-l-[2px] border-[white] rounded-lg hover:border-l-[2px] hover:border-transparent "
                                    style={{ transition: ".5s" }}
                                  >
                                    <div
                                      // src={ai}
                                      className="w-[40px] h-[40px] rounded-lg bg-[#101116] text-white flex justify-center items-center "
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="lucide lucide-bot-message-square"
                                      >
                                        <path d="M12 6V2H8" />
                                        <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
                                        <path d="M2 12h2" />
                                        <path d="M9 11v2" />
                                        <path d="M15 11v2" />
                                        <path d="M20 12h2" />
                                      </svg>
                                    </div>
                                    <pre
                                      className=" w-[calc(100%-70px)] ml-[16px] text-[15px] tracking-[1px] leading-[25px] font-[book] whitespace-pre-wrap "
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
                                          <span
                                            id={index}
                                            className=""
                                            dangerouslySetInnerHTML={{
                                              __html: formatText(
                                                mssg.assistant
                                              ),
                                            }}
                                          >
                                            {/* {mssg.assistant} */}
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-audio-lines"
                              >
                                <path d="M2 10v3" />
                                <path d="M6 6v11" />
                                <path d="M10 3v18" />
                                <path d="M14 8v7" />
                                <path d="M18 5v13" />
                                <path d="M22 10v3" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-mic"
                              >
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" x2="12" y1="19" y2="22" />
                              </svg>
                            </>
                          )}
                        </button>
                        <input
                          placeholder="Ask Anything"
                          className="w-full h-full px-[60px] rounded-lg outline-none bg-[#white] text-[black] flex justify-center items-center font-[book] "
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
                          className="mx-[0] h-full w-[60px] flex justify-center items-center  text-[23px] ml-[-59px] cursor-pointer  text-[#000000] drop-shadow-lg"
                          onClick={() => {
                            handleSend();
                            setInput("");
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width=""
                            height=""
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-arrow-up"
                          >
                            <path d="m5 12 7-7 7 7" />
                            <path d="M12 19V5" />
                          </svg>
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

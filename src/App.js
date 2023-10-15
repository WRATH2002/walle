import logo from "./logo.svg";
import "./App.css";
import { sendMessageToOpenAI } from "./components/Openai";
import Body from "./components/Body";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./utils/store";

// const response = await openai.listEngines();

function App() {
  const [result, setResult] = useState("");

  // const handleSend = async () => {
  //   var hello = "who is shah rukh khan";
  //   // sendMessageToOpenAI(hello);
  //   const res = await sendMessageToOpenAI(hello);
  //   console.log(res);
  //   setResult(res);
  // };

  return (
    <>
      <Provider store={store}>
        <Body />
      </Provider>
      {/* <div className="">hello</div> */}
      {/* <button onClick={handleSend}>Click Me</button> */}
      {/* <p>{result}</p> */}
    </>
  );
}

export default App;

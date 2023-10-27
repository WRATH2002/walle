import { useDispatch, useSelector } from "react-redux";

const Loader = () => {
  const darkmode = useSelector((store) => store.chat.darkMode);
  return (
    <>
      {darkmode === 2 ? (
        <>
          <div className="w-full h-[100vh] flex justify-center items-center bg-[#141627]">
            {/* <div class="lds-ripple">
          <div></div>
          <div></div>
        </div> */}
            <span className="loader"></span>
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-[100vh] flex justify-center items-center bg-white">
            {/* <div class="lds-ripple">
          <div></div>
          <div></div>
        </div> */}
            <span className="loader"></span>
          </div>
        </>
      )}
    </>
  );
};

export default Loader;

import "./Loader.scss";
import { useSelector } from "react-redux";
import loaderImg from "../../../assets/images/loader.gif";
import { RootState } from "../../../Redux/store";
import { ReactElement } from "react";

function Loader(): ReactElement {
  const loader = useSelector((state: RootState) => state.loader);

  return (
    <div>
      {loader.count ? (
        <div>
          <div className="loading-box">
            <div className="progress-bar">
              <img src={loaderImg} alt="loading" />
            </div>
            <div className="message">{loader.message}</div>
          </div>
          <div className="loader-wrapper"></div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Loader;

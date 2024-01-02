import { createContext, useContext, useState } from "react";
import loaderImg from "../../assets/images/loader.gif";
import "./Loader.scss";

const LoaderContext = createContext<
  | {
      loader: { count: number; message: string };
      showLoader: (message?: string) => void;
      hideLoader: () => void;
    }
  | undefined
>(undefined);

// Custom hook for using loader context
export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

// Hook component with provider
export default function LoaderProvider({ children }: any) {
  const [loader, setLoader] = useState({ count: 0, message: "" });

  const showLoader = (message = "Loading...") => {
    setLoader({ count: 1, message: message });
  };

  const hideLoader = () => {
    setLoader({ count: 0, message: "" });
  };

  // Loader UI
  const loaderUI = loader.count ? (
    <div>
      <div className="loading-box">
        <div className="progress-bar">
          <img src={loaderImg} alt="loading" />
        </div>
        <div className="message">{loader.message}</div>
      </div>
      <div className="loader-wrapper"></div>
    </div>
  ) : null;

  return (
    <LoaderContext.Provider value={{ loader, showLoader, hideLoader }}>
      {children}
      {loaderUI}
    </LoaderContext.Provider>
  );
}

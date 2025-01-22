import React from 'react'
import BeatLoader from "react-spinners/BeatLoader";

interface Props {
    isLoading :boolean
}
const WaitLoader: React.FC<Props> = ({isLoading}) => {
  return (
    <div className="text-white z-50 absolute  justify-center items-center ">
      <BeatLoader
        color={"#5A473A"}
        loading={isLoading}
        className=" block m-auto border-black"
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
          />
        searching....
    </div>
  );
}

export default WaitLoader
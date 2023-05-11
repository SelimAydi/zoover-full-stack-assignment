import React from "react";

const Bar = ({ percentage }) => {
  const barStyle = {
    width: `${percentage}%`,
    minWidth: "10px",
    height: "20px",
    borderRadius: "5px",
    backgroundColor: "#5252ff",
    position: "absolute",
    top: 0,
    left: 0,
  };

  const backgroundBarStyle = {
    width: "100%",
    height: "20px",
    borderRadius: "5px",
    backgroundColor: "#f4f4f4",
    position: "relative",
  };

  return (
    <div style={backgroundBarStyle}>
      <div style={barStyle}></div>
    </div>
  );
};

export default Bar;

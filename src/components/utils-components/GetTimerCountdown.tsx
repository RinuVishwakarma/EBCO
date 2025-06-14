import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(0); // Initial value: 3 minutes (180 seconds)

  useEffect(() => {
    let time = localStorage.getItem("timer");
    if (time && Number(time) > 0) {
      setSeconds(Number(localStorage.getItem("timer")));
    } else {
      setSeconds(10);
    }
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds - 1;
        localStorage.setItem("timer", newSeconds.toString()); // Persist timer value
        if (newSeconds <= 0) {
          localStorage.removeItem("timer");
        }
        return newSeconds >= 0 ? newSeconds : 0; // Prevent seconds from going below 0
      });
    }, 1000);

    return () => {
      //console.log("USE EFFECT CLEARED")
      clearInterval(interval);
    };
  }, []); // Removed dependency array

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <Box sx={{ margin: "1rem" }}>
      <Typography
        sx={{
          fontSize: "1.5rem",
          color: customColors.lightBlueEbco,
          fontFamily: "Uniform Medium",
        }}
      >{`${minutes < 10 ? "0" : ""}${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`}</Typography>
    </Box>
  );
};

export default Timer;

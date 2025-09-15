import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Timer = ({ initialDuration = 0, onComplete, onClose, taskId }) => {
  const [time, setTime] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, time, onComplete]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => setIsRunning(true);

  const handlePause = async () => {
    setIsRunning(false);
    if (taskId && initialDuration !== undefined && time !== undefined) {
      try {
        await axios.post(
          `http://localhost:8081/api/tasks/${taskId}/pause-timer`,
          {
            initialDuration,
            currentTime: time,
          }
        );
        console.log("Timer paused and updated estimatedDuration");
      } catch (error) {
        console.error("Error pausing timer:", error);
      }
    }
  };

  return (
    <div className="timer-container">
      <div className="timer-display">{formatTime(time)}</div>
      <div className="timer-controls">
        <button onClick={handleStart} disabled={isRunning || time <= 0}>
          Bắt Đâu
        </button>
        <button onClick={handlePause} disabled={!isRunning}>
          Tạm Dừng
        </button>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default Timer;

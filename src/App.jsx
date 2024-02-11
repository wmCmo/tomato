import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import TimeButton from "./components/TimeButton";
import ControlButton from "./components/ControlButton";
let audio = new Audio();
audio.src = "./src/assets/Note_block_click_scale.ogg";

const App = () => {
  const [status, setStatus] = useState("Pomodoro");
  const [counting, setCounting] = useState(false);
  const [sec, setSec] = useState(1500)
  const [session, setSession] = useState(1)
  let message;

  useEffect(() => {
    let work;
    if (counting) {
      work = setInterval(() => {
        countdown();
      }, 1000);
    } else {
      clearInterval(work);
    }
    return () => {
      clearInterval(work);
    }
  }, [counting])

  const setTime = (newStatus) => {
    setStatus(newStatus)
    setCounting(false)
    if (newStatus === "Pomodoro") {
      setSec(1500);
    } else if (newStatus === "Short Break") {
      setSec(300);
    } else {
      setSec(900);
    }
  }

  const makeMessage = () => { //Determine the message for user
    if (!counting) {
      message = "Click Start and let's get things done!";
    } else if (counting && status === "Pomodoro") {
      message = "Time to Work!";
    } else {
      message = "Time to Rest!"
    }
    return message
  }

  const resetClock = () => { //When user clicks reset button
    setCounting(false);
    setStatus("Pomodoro");
    setSec(1500);
    setSession(1);
  }

  const countdown = () => {//Responsible for counting down
    setSec(prevSec => prevSec - 1);
  }

  const rewind = () => { //When user clicks backward button
    setTime(status);
  }

  const toggleCountdown = () => {
    setCounting(prevCounting => !prevCounting)
  }

  const skipClock = () => {
    setSec(0);
  }

  const min = Math.floor(sec / 60);
  const secs = sec % 60;

  //When time is up
  if (sec === 0) {
    audio.play();
    if ((status === "Pomodoro") && (session % 2 === 0)) {
      setStatus("Long Break");
      setTime("Long Break");
      setSession(prevSession => prevSession + 1);
    } else if (status === "Pomodoro") {
      setStatus("Short Break");
      setTime("Short Break");
      setSession(prevSession => prevSession + 1)
    } else {
      setStatus("Pomodoro");
      setTime("Pomodoro");
    }
    setCounting(true)
  }

  return (
    <div id="App">
      <Navbar />
      <main>
        <div className="clock">
          <div className="counter">
            <h1>{min < 10 ? "0" + min : min} : {secs < 10 ? "0" + secs : secs}</h1>
          </div>

          <div className="select-time">
            <TimeButton name="Pomodoro" onClick={setTime} />
            <TimeButton name="Short Break" onClick={setTime} />
            <TimeButton name="Long Break" onClick={setTime} />
          </div>

          <div className="control-section">
            <ControlButton file="reset" reset={resetClock} />
            <ControlButton file="backward" rewind={rewind} />
            <ControlButton file={counting ? "pause" : "play"} toggle={toggleCountdown} />
            <ControlButton file="forward" forward={skipClock} />
          </div>
        </div>

        <div className="message">
          <b>Session {session}</b>: {makeMessage()}
        </div>
      </main>
    </div>
  )
}

export default App;

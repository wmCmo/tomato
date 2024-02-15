import { useEffect, useState } from "react";
import { setInterval, clearInterval } from 'worker-timers'
import Navbar from "./components/Navbar";
import TimeButton from "./components/TimeButton";
import ControlButton from "./components/ControlButton";
let audio = new Audio();
audio.src = "ticks.ogg";

const App = () => {
  const choices = ['Pomodoro', 'Short Break', 'Long Break'];
  const [status, setStatus] = useState(choices[0]);
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

  const setTime = newStatus => {
    setStatus(newStatus)
    setCounting(false)
    if (newStatus === choices[0]) {
      setSec(1500);
    } else if (newStatus === choices[1]) {
      setSec(300);
    } else {
      setSec(900);
    }
  }

  const makeMessage = () => {
    if (!counting) {
      message = "Click Start and let's get things done!";
    } else if (counting && status === choices[0]) {
      message = "Time to Work!";
    } else {
      message = "Time to Rest!"
    }
    return message
  }

  const resetClock = () => {
    setCounting(false);
    setStatus(choices[0]);
    setSec(1500);
    setSession(1);
  }

  const countdown = () => {
    setSec(prevSec => prevSec - 1);
  }

  const rewind = () => {
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

  if (sec === 0) {
    audio.play();
    if ((status === choices[0]) && (session % 2 === 0)) {
      setTime(choices[2]);
    } else if (status === choices[0]) {
      setTime(choices[1]);
    } else {
      setTime(choices[0]);
      setSession(prevSession => prevSession + 1);
    }
    setCounting(true)
  }

  const selectTime = choices.map((choice) => {
    return (
      <TimeButton name={choice} onClick={setTime} key={choice} />
    )
  })

  return (
    <div id="App">
      <div className="wrapper">
        <Navbar />
        <main>
          <div className={`clock ${status.toLowerCase()}`}>
            <div className={`counter ${status.toLocaleLowerCase()}`}>
              <h1>{min < 10 ? "0" + min : min} : {secs < 10 ? "0" + secs : secs}</h1>
            </div>
            <div className={`select ${status.toLocaleLowerCase()}`}>
              {selectTime}
            </div>

            <div className={`ctrl ${status.toLocaleLowerCase()}`}>
              <ControlButton file="reset" btnFunc={resetClock} />
              <ControlButton file="backward" btnFunc={rewind} />
              <ControlButton file={counting ? "pause" : "play"} btnFunc={toggleCountdown} />
              <ControlButton file="forward" btnFunc={skipClock} />
            </div>
          </div>
          <div className="message">
            <b>Session {session}</b>: {makeMessage()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App;

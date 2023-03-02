import React from 'react';

class PomodoroTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: 1500,
      timerPhase: 'Session',
      isRunning: false,
      initialSessionTime: 1500,
      numSessions: 1,
      isOnBreak: false,
    };
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.formatTime = this.formatTime.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  startStopTimer() {
    const { isRunning, timeRemaining, timerPhase, isOnBreak, numSessions } = this.state;
    let newTimerPhase = timerPhase;
    let newTimeRemaining = timeRemaining;
    let newNumSessions = numSessions;

    if (isRunning) {
      clearInterval(this.timerId);
    } else {
      if (isOnBreak) {
        newTimeRemaining = 300;
        newTimerPhase = 'Break';
      } else {
        newTimeRemaining = this.state.initialSessionTime;
        newTimerPhase = 'Session';
      }

      if (numSessions === 0 && !isOnBreak) {
        newTimeRemaining = 0;
      }

      this.timerId = setInterval(() => {
        this.setState(prevState => ({
          timeRemaining: prevState.timeRemaining - 1
        }));
      }, 1000);
    }

    this.setState(prevState => ({
      timerPhase: newTimerPhase,
      timeRemaining: newTimeRemaining,
      isRunning: !prevState.isRunning,
      isOnBreak: !prevState.isOnBreak && newTimerPhase === 'Session',
      numSessions: prevState.numSessions === 0 && newTimerPhase === 'Session' ? 3 : prevState.numSessions,
    }));
  }

  resetTimer() {
    this.setState({
      timeRemaining: 1500,
      timerPhase: 'Session',
      isRunning: false,
      numSessions: 1,
      isOnBreak: false,
    });
  }

  formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${seconds}`;
  }

  handleChangeNumSessions = e => {
    const newNumSessions = parseInt(e.target.value, 10);

    if (newNumSessions >= 1 && newNumSessions <= 4) {
      this.setState({ numSessions: newNumSessions });
    }
  };

  render() {
    const { timeRemaining, timerPhase, isRunning, numSessions } = this.state;

    const ProgressBar = ({ timeRemaining, totalTime }) => {
      const progress = (1 - timeRemaining / totalTime) * 100;

      return (
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      );
    };

    return (
        <div>
          <h1>{timerPhase}</h1>
          <h2>{this.formatTime(timeRemaining)}</h2>
          <ProgressBar timeRemaining={timeRemaining} totalTime={this.state.initialSessionTime} />
          <div className="sessions-box">
            <label htmlFor="num-sessions" className="sessions-label">
              Number of Sessions:
            </label>
            <input
              id="num-sessions"
              type="number"
              value={numSessions}
              min={1}
              max={4}
              onChange={this.handleChangeNumSessions}
              className="sessions-input"
            />
          </div>
          <div className="buttons">
            <button onClick={this.startStopTimer} className={isRunning ? 'pause' : ''}>
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={this.resetTimer}>Reset</button>
          </div>
        </div>
      );      
    }
}

export default PomodoroTimer;

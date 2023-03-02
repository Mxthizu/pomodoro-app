import React, { Component } from 'react';
import PomodoroTimer from './PomodoroTimer';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Pomodoro Timer</h1>
        <PomodoroTimer />
      </div>
    );
  }
}

export default App;

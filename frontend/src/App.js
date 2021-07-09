import React,{useEffect} from 'react';
import { Route,Redirect } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import VisualizerScreen from './screens/VisualizerScreen';
import MultiplayerScreen from './screens/MultiplayerScreen';
import GamePlayScreen from './screens/GamePlayScreen';
function App() {
  
  return (
    <>
      <Route path="/" exact component={HomeScreen} />
      <Route path="/visualizer" component={VisualizerScreen} />
      <Route path="/multiplayer" component={MultiplayerScreen} />
      <Route path="/arena" component={GamePlayScreen} />
      <Redirect to="/" component={HomeScreen} />
    </>
  );
}

export default App;

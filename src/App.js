import React, { useEffect } from 'react'
import OBSWebScoket from 'obs-websocket-js'
import './App.css';

const PASSWORD = process.env.REACT_APP_PASSWORD

function App() {
  useEffect(() => {
    ( async () => {
      const obs = new OBSWebScoket()
      const password = PASSWORD || ''

      await obs.connect({
        address: 'localhost:4444',
        password
      }).catch( err => {throw err})

      console.log( 'succeeded connecting to obss')

      const sceneList = await obs.send('GetSceneList')
      console.log( 'current-scene:', sceneList.currentScene )
      sceneList.scenes.forEach( (scene, idx) => {
        console.log( `[${idx}] ${scene.name}` )
      })
    })()
  }, [])
  return (
    <div className="App">
      <header>
        <h1>kokutele OBS control</h1>
      </header>
    </div>
  );
}

export default App;

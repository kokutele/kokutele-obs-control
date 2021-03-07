import React, { useEffect, useRef, useState } from 'react'
import OBSWebScoket from 'obs-websocket-js'
import { 
  Button,
  Checkbox,
  Input 
} from 'antd'
import './App.css';

const PASSWORD = process.env.REACT_APP_PASSWORD
const medias = [
  "Timelapse03_720.mov",
  "Timelapse09_720.mov",
  "polygon01_720.mp4",
  "polygon09_720.mp4",
  "trailer_big_buck_bunny.ogg",
]

function App() {
  const _obs = useRef()
  const [ _mediaSourceType, setMediaSourceType ] = useState('')
  const [ _mediaSourceSettings, setMediaSourceSettings ] = useState(null)
  const [ _telopText, setTelopText ] = useState('')

  useEffect(() => {
    ( async () => {
      _obs.current = new OBSWebScoket()
      const password = PASSWORD || ''

      await _obs.current.connect({
        address: 'localhost:4444',
        password
      }).catch( err => {throw err})

      console.log( 'succeeded connecting to obss')

      const telop = await _obs.current.send('GetTextFreetype2Properties', {source: 'telop'})
      setTelopText( telop.text )
      console.log( telop )

      const mediaSettings = await _obs.current.send('GetSourceSettings', {sourceName: 'media'})
      setMediaSourceType( mediaSettings.sourceType )
      setMediaSourceSettings( mediaSettings.sourceSettings )

      const browserSettings = await _obs.current.send('GetSourceSettings', {sourceName: 'browser'})
      console.log( browserSettings.sourceType )
      console.log( browserSettings.sourceSettings )

      const sceneList = await _obs.current.send('GetSceneList')
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
      <main>
        <div>
          Telop: <Input style={{width: "30vw"}} value={_telopText} onChange={ async e => {
            const text = e.target.value
            setTelopText( text )
            if( _obs.current ) {
              await _obs.current.send('SetTextFreetype2Properties', {
                source: 'telop',
                text
              })
            }
          }}/>
          &nbsp;
          render - 
          <Checkbox onChange={ async e => {
            const checked = e.target.checked
            if( _obs.current ) {
              await _obs.current.send('SetSceneItemRender', {
                source: 'telop',
                render: checked
              })
            }
          } }/>
        </div>
        <div>
          Media:<br/>
          source type: {_mediaSourceType}<br/>
          source settings:
          { _mediaSourceSettings ? 
            (<pre>{ JSON.stringify(_mediaSourceSettings, null, 2 ) }</pre>) : 
            (<div></div>)
          }
          { medias.map( (media, idx) => (
            <Button onClick={ async () => {
              const input = `http://localhost:3000/video/${media}`
              const sourceSettings = Object.assign( {}, _mediaSourceSettings, { input })
              setMediaSourceSettings(sourceSettings)
              await _obs.current.send('SetSourceSettings', { 
                sourceName: 'media',
                sourceType: _mediaSourceType,
                sourceSettings
              })
            }}>change{media}</Button>
          ))}

        </div>

      </main>
    </div>
  );
}

export default App;

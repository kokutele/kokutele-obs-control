import React, {  useEffect, useRef, useState } from 'react'
import OBSWebScoket from 'obs-websocket-js'
import { 
  Button,
  Checkbox,
  Form,
  Input 
} from 'antd'
import './App.css';

const PASSWORD = process.env.REACT_APP_PASSWORD

function App() {
  const _obs = useRef()
  const [ _obsAddress, setObsAddress] = useState('')
  const [ _sceneItems, setSceneItems ] = useState([])
  const [ _telop, setTelop ] = useState('')

  useEffect(() => {
    if( _obsAddress === '' ) return
    ( async () => {
      _obs.current = new OBSWebScoket()
      const password = PASSWORD || ''

      console.log( _obsAddress )
      await _obs.current.connect({
        address: `${_obsAddress}:4444`,
        password
      }).catch( err => {throw err})

      console.log( 'succeeded connecting to obs')

      const res = await _obs.current.send('GetSceneItemList')
      console.log( res )
      const sceneItems = res.sceneItems
      for( let item of sceneItems ) {
        const res = await _obs.current.send('GetSceneItemProperties', { item: { id: item.itemId } } )
          .catch( err => console.warn( err ))
        console.log( item, res )
        if( item.sourceKind === "text_gdiplus_v2" ) {
          console.log( item.itemId )
          const resTextSource = await _obs.current.send('GetTextGDIPlusProperties', { source: item.sourceName } )
          console.log( resTextSource.text)
          setTelop( resTextSource.text )
          item.text = resTextSource.text
        }
        item.visible = res.visible
      }

      console.log( sceneItems )
      setSceneItems( sceneItems )
    })()
  }, [ _obsAddress ])
  return (
    <div className="App">
      <header>
        <h1>kokutele OBS control</h1>
      </header>
      <main>
        <div>
          <Form
            name="connect"
            initialValues={{
              obsAddress: _obsAddress,
            }}
            onFinish={obj => setObsAddress(obj.obsAddress)}
            onFinishFailed={e => console.error(e)}
          >
            <Form.Item
              label="obsAddress"
              name="obsAddress"
              rules={[
                {
                  required: true,
                  message: 'Please input obs address!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Connect
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div>
          <h3>Video</h3>
          { _sceneItems.filter( o => o.sourceKind === "ffmpeg_source")
            .map( (item, idx) => (
              <div key={idx}>
                {item.itemId}: {item.sourceName}
                <Checkbox 
                  defaultChecked={ item.visible }
                  onClick={ async e => {
                    const checked = e.target.checked
                    if(_obs.current) {
                      await _obs.current.send( 'SetSceneItemProperties', { item: {id: item.itemId }, visible: checked })
                      console.log("sent")
                    }
                  }}
                />
              </div>
            ))
          }
        </div>
        <div>
          <h3>Text</h3>
          { _sceneItems.filter( o => o.sourceKind === "text_gdiplus_v2")
            .map( (item, idx) => (
              <div key={idx}>
                {item.itemId}: {item.sourceName}
                <Input 
                  value={_telop} 
                  onChange={ e => {
                    const telop= e.target.value
                    setTelop(telop)
                  }}
                />
                <Button 
                  type="primary"
                  onClick={ async () => {
                    await _obs.current.send('SetTextGDIPlusProperties', {
                      source: item.sourceName,
                      text: _telop
                    })
                  }}
                  danger
                >
                  update
                </Button>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react'
import {
  Col, Row, Space
} from 'antd'
import OBSWebScoket from 'obs-websocket-js'

import Info from './info'
import Text from './text'
import Camera from './camera'
import Video from './video'
import Image from './image'

export default function Controller(props) {
  const { obsAddress, password } = props

  const [ _obs, setObs ] = useState()
  const [ _sceneItems, setSceneItems ] = useState([])

  const span=6

  useEffect(() => {
    if( !obsAddress ) return

    ( async () => {
      const obs = new OBSWebScoket()

      await obs.connect({
        address: `${obsAddress}:4444`,
        password
      })

      console.log( 'succeeded connecting to obs')

      const res = await obs.send('GetSceneItemList')

      const sceneItems = res.sceneItems
      for( let item of sceneItems ) {
        const res = await obs.send('GetSceneItemProperties', { item: { id: item.itemId } } )
          .catch( err => console.warn( err ))

        if( item.sourceKind === "text_gdiplus_v2" ) {
          const resTextSource = await obs.send('GetTextGDIPlusProperties', { source: item.sourceName } )
          item.text = resTextSource.text
        }

        if( item.sourceKind === "text_ft2_source_v2" ) {
          const resTextSource = await obs.send('GetTextFreetype2Properties', { source: item.sourceName } )
          item.text = resTextSource.text
        }

        item.visible = res.visible
        console.log( item, res )
      }

      setSceneItems( sceneItems )
      setObs( obs )
    })()
  }, [ obsAddress, password ])
 
  return (
    <div className="Controller">
      <Space direction="vertical" style={{
        width: "100%"
      }}>
        <Row gutter={16}>
          <Col span={span}>
            <Video 
              title="video" 
              sceneItems={ _sceneItems } 
              cm={false}
              obs={ _obs } 
            />
          </Col>
          <Col span={span}>
            <Video 
              title="CM" 
              sceneItems={ _sceneItems } 
              cm={true}
              obs={ _obs } 
          />
          </Col>
          <Col span={span}>
            <Image 
              title="image" 
              sceneItems={ _sceneItems } 
              obs={ _obs } 
          />
          </Col>
          <Col span={span}>
            <Camera 
              title="camera" 
              sceneItems={ _sceneItems } 
              cm={true}
              obs={ _obs } 
          />
          </Col>
          <Col span={24}>
            <Text 
              title="telop"
              sceneItems={ _sceneItems } 
              obs={ _obs } 
            />
          </Col>
        </Row>
        <Info obsAddress={obsAddress} obs={_obs} />
      </Space>
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Col,
  Checkbox,
  Input,
  Row,
  Typography,
} from 'antd'

import { EditOutlined } from '@ant-design/icons'

import LyricsTabs from './lyrics-tabs'

const { Title } = Typography

export default function Text( props ) {
  const { sceneItems, obs, title } = props
  const [ _telop, setTelop ] = useState('')

  useEffect( () => {
    sceneItems.filter(o => (
      o.sourceKind === "text_gdiplus_v2" ||
      o.sourceKind === "text_ft2_source_v2"
    ))
    .forEach( item => {
      setTelop( item.text )
    })
  }, [ sceneItems ])

  return (
    <div className="Text">
      <Card title={<Title level={3}>
        <EditOutlined/>&nbsp;
        item: {title}
      </Title>}>
      { sceneItems.filter(o => (
        o.sourceKind === "text_gdiplus_v2" ||
        o.sourceKind === "text_ft2_source_v2"
      ))
        .map((item, idx) => (
          <Row gutter={16} key={idx}>
            <Col span={3} style={{ textAlign: "right" }}>
              <Checkbox 
                defaultChecked={ item.visible }
                onClick={ async e => {
                  const checked = e.target.checked
                  if(obs) {
                    await obs.send( 'SetSceneItemProperties', { item: {id: item.itemId }, visible: checked })
                  }
                }}
              >
              {item.sourceName}
              </Checkbox>
            </Col>
            <Col span={15}>
              <Input
                value={_telop}
                onChange={e => {
                  const text = e.target.value
                  setTelop( text )
                }}
              />
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                danger
                onClick={async () => {
                  const cmd = item.sourceKind === "text_gdiplus_v2" ?
                    'SetTextGDIPlusProperties' :
                    'SetTextFreetype2Properties'

                  await obs.send(cmd, {
                    source: item.sourceName,
                    text: _telop
                  })
                }}
              >
                update
              </Button>
            </Col>
            <Col span={24}>
              <LyricsTabs onUpdate={ setTelop } />
            </Col>
          </Row>
        ))
      }
      </Card>
    </div>
  )
}
import React from 'react'
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

const { Title } = Typography

export default function Text( props ) {
  const { sceneItems, obs, title } = props

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
                defaultValue={item.text}
                onChange={e => {
                  const text = e.target.value
                  item.text = text
                }}
              />
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                onClick={async () => {
                  const cmd = item.sourceKind === "text_gdiplus_v2" ?
                    'SetTextGDIPlusProperties' :
                    'SetTextFreetype2Properties'

                  await obs.send(cmd, {
                    source: item.sourceName,
                    text: item.text
                  })
                }}
              >
                update
              </Button>
            </Col>
          </Row>
        ))
      }
      </Card>
    </div>
  )
}
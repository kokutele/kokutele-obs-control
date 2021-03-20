import React from 'react'
import {
  Card,
  Checkbox,
  Typography
} from 'antd'
import { CameraOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function Camera(props) {
  const { sceneItems, obs, title } = props

  return (
    <div className="Camera">
      <Card title={
        <Title level={3}>
          <CameraOutlined/>&nbsp;
          item: {title}
        </Title>}>
      { sceneItems
        .filter( item => item.sourceKind === "av_capture_input")
        .map( (item, idx) => (
          <div key={idx}>
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
          </div>
        ))
      }
      </Card>
    </div>
  )
}


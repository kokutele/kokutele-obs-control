import React from 'react'
import {
  Card,
  Checkbox,
  Typography
} from 'antd'
import { PlaySquareOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function Video(props) {
  const { sceneItems, obs, cm, title } = props

  return (
    <div className="Video">
      <Card title={
        <Title level={3}>
          <PlaySquareOutlined/>&nbsp;
          item: {title}
        </Title>}>
      { sceneItems
        .filter( item => item.sourceKind === "ffmpeg_source")
        .filter( item => cm ? item.sourceName.toLowerCase().includes('cm') : !item.sourceName.toLowerCase().includes('cm') )
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


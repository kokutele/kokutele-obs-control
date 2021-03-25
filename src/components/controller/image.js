import React from 'react'
import {
  Card,
  Checkbox,
  Typography
} from 'antd'
import { FileImageOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function Image(props) {
  const { sceneItems, obs, title } = props

  return (
    <div className="Image">
      <Card title={
        <Title level={3}>
          <FileImageOutlined/>&nbsp;
          item: {title}
        </Title>}>
      { sceneItems
        .filter( item => item.sourceKind === "image_source")
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


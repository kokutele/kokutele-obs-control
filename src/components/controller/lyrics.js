import React, { useState, useEffect } from 'react'

import {
  Button,
  Col,
  Input,
  Row
} from 'antd'

import { ArrowUpOutlined } from '@ant-design/icons'

const { TextArea } = Input

const PREFIX='arrLyrics'

export default function Lyrics(props) {
  const { id, title, onUpdate } = props
  const key = `${PREFIX}-${id}`

  const [ _lyrics, setLyrics ] = useState([])
  const [ _selectedId, setSelectedId ] = useState(-1)

  const onChange = (e) => {
    const lines = e.target.value.split("\n")
    setLyrics( lines )
    localStorage.setItem( key, JSON.stringify( lines )  )
  }

  // initialize local storage
  useEffect( () => {
    if( !localStorage.getItem(key) ) {
      localStorage.setItem(key, "[]")
    }

    setLyrics( JSON.parse( localStorage.getItem(key) ))
  }, [ key ])

  return (
    <div className="Lyrics">
      <Row gutter={16}>
        <Col span={24}>
          <div>
            <b>{title}</b>, id: {id}
          </div>
        </Col>
        <Col span={12}>
          <div>
            <TextArea value={ _lyrics.join("\n") } rows={24} onChange={ onChange }></TextArea>
          </div>
        </Col>
        <Col>
        { _lyrics.length === 0 ? (
          <>
          Updated lyrics here.
          </>
        ):(
          <div style={{width: "45vw", height: "50vh", overflow: "scroll", border: "2px solid #ccc", padding: "6px"}}>
          {_lyrics.map( (line, idx) => (
            <div key={idx}>
              <Button 
                type="default" 
                icon={<ArrowUpOutlined/>}
                onClick={ () => {
                  setSelectedId( idx )
                  onUpdate(line) 
                }}
              />
              &nbsp; { _selectedId === idx ? (<b>[{idx}] {line}</b>) : (<span>[{idx}] {line}</span>) }
            </div>
          ))}
          </div>
        )}
        </Col>
      </Row>
    </div>
  )
}
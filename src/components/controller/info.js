import React, { useState, useEffect } from 'react'
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons'

import {
  Card, Col, Row, Statistic, Typography
} from 'antd'

const { Title } = Typography

export default function Info(props) {
  const [ _obsStudioVersion, setObsStudioVersion ] = useState('---')
  const [ _averageFrameTime, setAverageFrameTime ] = useState( 0 )
  const [ _cpuUsage, setCpuUsage ] = useState( 0 )
  const [ _fps, setFps ] = useState( 0 )
  const [ _freeDiskSpace, setFreeDiskSpace ] = useState( 0 )
  const [ _memoryUsage, setMemoryUsage ] = useState( 0 )
  const [ _outputSkippedFrames, setOutputSkippedFrames ] = useState( 0 )
  const [ _outputTotalFrames, setOutputTotalFrames ] = useState( 0 )
  const [ _renderMissedFrames, setRenderMissedFrames ] = useState( 0 )
  const [ _renderTotalFrames, setRenderTotalFrames ] = useState( 0 )
  const { obsAddress, obs } = props

  const span = 4

  useEffect( () => {
    let timer

    if( !obs ) return;

    ( async () => {
      const res = await obs.send('GetVersion')
      setObsStudioVersion( res['obs-studio-version'])

      timer = setInterval( async () => {
        const res = await obs.send('GetStats')
        console.log( res.stats )

        if( res.status === 'ok' ) {
          setAverageFrameTime( res.stats['average-frame-time'].toFixed(2) )
          setCpuUsage( res.stats['cpu-usage'].toFixed(2) )
          setFps( res.stats['fps'].toFixed(2) )
          setFreeDiskSpace( res.stats['free-disk-space'].toFixed(2) )
          setMemoryUsage( res.stats['memory-usage'].toFixed(2) )
          setOutputSkippedFrames( res.stats['output-skipped-frames'] )
          setOutputTotalFrames( res.stats['output-total-frames'] )
          setRenderMissedFrames( res.stats['render-missed-frames'] ) 
          setRenderTotalFrames( res.stats['render-total-frames'] )
        }
      }, 1000)
    })()

    return function cleanup() {
      if( timer ) clearInterval( timer )
    }
  }, [ obs ])

  return (
    <div className="Info">
      <Card title={
        <Title level={3}>
          <InfoCircleOutlined />&nbsp;
          OBS Info &amp; Stats
        </Title>
      }>
        <Row gutter={16}>
          <Col span={span}>
            <Statistic
              title={<><HomeOutlined /> obs address</>}
              value={obsAddress}
            />
          </Col>
          <Col span={span}>
        <Statistic title="obs studio version" value={_obsStudioVersion} />
          </Col>
          <Col span={span}>
        <Statistic title="average frame time" value={_averageFrameTime} />
          </Col>
          <Col span={span}>
        <Statistic title="cpu usage" value={_cpuUsage} />
          </Col>
          <Col span={span}>
        <Statistic title="fps" value={_fps} />
          </Col>
          <Col span={span}>
        <Statistic title="free disk space" value={_freeDiskSpace} />
          </Col>
          <Col span={span}>
        <Statistic title="memory usage" value={_memoryUsage} />
          </Col>
          <Col span={span}>
        <Statistic title="output skipped frames" value={_outputSkippedFrames} />
          </Col>
          <Col span={span}>
        <Statistic title="output total frames" value={_outputTotalFrames} />
          </Col>
          <Col span={span}>
        <Statistic title="render missed frames" value={_renderMissedFrames} />
          </Col>
          <Col span={span}>
        <Statistic title="render total frames" value={_renderTotalFrames} />
          </Col>
        </Row>
      </Card>
    </div>
  )

}
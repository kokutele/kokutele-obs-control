import React from 'react'

import { Tabs } from 'antd';

import Lyrics from './lyrics'

const { TabPane } = Tabs;

function callback(key) {
  // console.log(key);
}

const tabNames = [
  '定形',
  'Opening',
  'M1',
  'MC1',
  'M2',
  'MC2',
  'Ending',
];

export default function LyricsTabs( props ){
  const { onUpdate } = props
  return (
    <div className="LyricsTabs">
      <Tabs defaultActiveKey="0" onChange={callback}>
        { tabNames.map( (name, idx) => (
        <TabPane tab={name} key={idx}>
          <Lyrics id={idx} title={name} onUpdate={onUpdate} />
        </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
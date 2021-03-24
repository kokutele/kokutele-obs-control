import React from 'react'
import { Button, Card, Input, Form, Typography } from 'antd'

const { Title } = Typography

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

export default function Login(props) {
  const { onSubmit } = props

  const key = 'obs-address'

  if( !localStorage.getItem(key) ) {
    localStorage.setItem( key, '' )
  }

  const _obsAddress = localStorage.getItem( key )


  return (
    <div className="Login">
      <Card title={<Title level={3}>Connect to OBS</Title>}>
        {_obsAddress}
        <Form
          {...layout}
          name="connect"
          initialValues={{
            obsAddress: _obsAddress,
            password: ''
          }}
          onFinish={ item => {
            localStorage.setItem( key, item.obsAddress )
            onSubmit( item )
          }}
          onFinishFailed={e => console.warn(e)}
        >
          <Form.Item
            label="obs address"
            name="obsAddress"
            rules={[
              {
                required: true,
                message: 'Please input obs address!',
              },
            ]}
          >
            <Input 
              placeholder="e.g. localhost"
            />
          </Form.Item>
          <Form.Item
            label="password"
            name="password"
            rules={[
              {
                required: false,
                message: 'obs password (when configured)',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            {...tailLayout}
          >
            <Button type="primary" htmlType="submit">
              Connect
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
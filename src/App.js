import React, {  useState } from 'react'
import { 
  Typography
} from 'antd'

import Login from './components/login'
import Controller from './components/controller'
import './App.css';

const { Title } = Typography

function App() {
  const [ _obsAddress, setObsAddress] = useState('')
  const [ _password, setPassword] = useState('')

  return (
    <div className="App">
      <header>
        <Title level={1}>
          kokutele OBS control
        </Title>
      </header>
      <main>
        { _obsAddress === '' ? (
        <div>
          <Login 
            onSubmit={ item => {
              setObsAddress( item.obsAddress )
              setPassword( item.password )
            } } 
          />
        </div>
        ):(
        <div>
          <Controller 
            obsAddress={ _obsAddress } 
            password={ _password } 
          />
        </div>
        )}
      </main>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './assets/App.css';
import logo from './assets/pp.jpg';
import 'semantic-ui-css/semantic.min.css';
import { Message, Input, Card, Image, Button } from 'semantic-ui-react';
import './assets/my.css';
import Routes from './routes';
import {RecoilRoot} from 'recoil';
import axios from "axios";
import { HOST } from './components/global.js'

function App() {
  const [isLogged, setLogin] = useState(false);
  const [userPass, setUserPass] = useState('');
  const [errorPass, setEp] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function refreshClients() {
      var url = HOST + `/api/clients/inadimplente`;
      const response = await axios.get(url);
      if (response?.data?.length > 0) {

        if (!isCancelled) {
          //
        }
      }
    }

    refreshClients();
    return () => {
      isCancelled = true;
    };
  }, []);

  function logout() {

    setLogin(false);
  }

  function logar(e) {
    if (userPass === 33) {


      setLogin(true);

    } else {
      setEp(true);
    }

  }

  return (
    <div>
      {isLogged ? (
        <RecoilRoot>
          <Routes logout={logout} />
        </RecoilRoot>
      ) : (<div className="ContainerLogin">

        <Card centered={true} style={{ minWidth: "350px", }}>
          <Image src={logo} alt="logo" size="large" wrapped ui={false} />
          <Card.Content textAlign="center">
            <Input id="UserLogin" type="text"
              size="massive"
              placeholder="Digite seu usuário"

            ></Input>
            <Input id="PassLogin" value={userPass}
              onChange={e => setUserPass(parseInt(e.target.value, 10))}
              size="massive"
              type="password" placeholder="Digite sua senha"></Input>
            <Button size='big' id="BtnEntrar" onClick={() => logar()} primary >Entrar</Button>
            {errorPass ? (
              <Message negative>
                <Message.Header>Senha Incorreta</Message.Header>
              </Message>
            ) : (<i></i>)}
          </Card.Content>
        </Card>
      </div>)}
    </div>

  );
}

export default App;

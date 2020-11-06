import React from 'react';
import '../assets/login.css';
import logo from '../assets/pp.jpg';

export default function Login() {

  async function handleSubmit() {

  }

  return (
    <div className="ContainerLogin">
      <form onSubmit={handleSubmit}>
        <img src={logo} id="logo" alt="logo" />
        <input id="UserLogin" type="text"
          placeholder="Digite seu usuário"

            /*onChange={e =>setUsername(e.target.value)}*/></input>
        <input id="PassLogin" type="password" placeholder="Digite sua senha"></input>
        <button id="BtnEntrar" >Entrar</button>
      </form>
    </div>

  );
}


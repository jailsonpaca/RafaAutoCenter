

import React from 'react';
import './main.css';
import logo from './logo.png';
//import {Link} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import {Image} from 'semantic-ui-react';
export default function controle() {

  
  
  

  return (
      <div className="ContainerMain">
  
        <Image id="logo" style={{backgroundColor:'white',width:140,margin: 10}} alt="logo" src={logo}></Image>       
           
    
    </div>
   
  );
}
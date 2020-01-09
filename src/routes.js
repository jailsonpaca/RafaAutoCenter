import React   from 'react';
import {BrowserRouter,Link,Route,Redirect} from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import Inicio from './pages/main';
import Caixa from './pages/caixa';
import Problemas from './pages/problemas';
import Vendas from './pages/vendas';
import Clientes from './pages/clientes';
import Controle from './pages/controle';
import Estoque from './pages/estoque';
import logo from './assets/pp.jpg';
import 'semantic-ui-css/semantic.min.css';
import {Grid,Image, Icon, Menu, Segment, Sidebar} from 'semantic-ui-react';
import './my.css';


export default function Routes(props){
  
  const exec = require('child_process').exec;
         //ConsoleSystemTray.exe -p index-win.exe
    exec(`ConsoleSystemTray.exe -p index-win.exe`, (error, stdout, stderr) => { 
      console.log(error);
      console.log(stderr);
      //console.log(stdout); 
    });

  useHotkeys('s', () =>{   document.getElementById('sairL').click();  });
  //useHotkeys('e', () =>{  document.getElementById('BtnEntrar').click();  });
  useHotkeys('1', () =>{  document.getElementById('inicioL').click();  });
  useHotkeys('2', () =>{   document.getElementById('caixaL').click();  });
  useHotkeys('3', () =>{  setTimeout(()=>{ document.getElementById('estoqueL').click();},300);  });
  useHotkeys('4', () =>{   document.getElementById('vendasL').click();  });
  useHotkeys('5', () =>{   document.getElementById('controleL').click();  });
  useHotkeys('6', () =>{   document.getElementById('problemasL').click();  });
  
  function onLogout(){
    props.logout();
  }

    return(
     

 
   <BrowserRouter>  

<Redirect to="/inicio"/>
<div style={{width:'100%',height:'100%'}}>

<Grid divided='vertically' >
    <Grid.Row  columns={1}>
       <Grid.Column>
              <Menu fixed="top" borderless={true} floated={true}>
              <Menu.Item position="left" fitted={true} style={{paddingBottom: "0.2%"}}> 
              <Image src={logo} size="small" ></Image>
              </Menu.Item>
              <Menu.Item name="logout" position="right">
              <Link id="sairL" to="/" onClick={()=>onLogout()} >
               
                    <Icon name="log out" />Sair
                
              </Link>
              </Menu.Item>
              </Menu>
       </Grid.Column>
    </Grid.Row>

    <Grid.Row  columns={1}  style={{height:'100vh'}}> 
    
    <Grid.Column >
              <Sidebar.Pushable as={Segment} style={{transform: "none !important"}}>
              
             
              <Sidebar
                style={{position:"fixed !important",transform: "none !important"}}
                as={Menu}
                animation='slide along'
                icon='labeled'
                inverted
                vertical={true}
                visible={true}
                width='thin'
                
              > 
                  <Link id="inicioL" to="/inicio">
                  <Menu.Item >
                    <Icon name='home' />
                    Inicio
                  </Menu.Item>
                  </Link>
                  <Link id="caixaL" to="/caixa">
                  <Menu.Item >
                    <Icon name='cart' />
                    Caixa
                  </Menu.Item>
                  </Link>
                  <Link id="estoqueL" to="/estoque">
                  <Menu.Item >
                    <Icon name='archive' />
                    Estoque
                  </Menu.Item>
                  </Link>
                  <Link id="vendasL" to="/vendas">
                  <Menu.Item >
                    <Icon name='money' />
                    Vendas
                  </Menu.Item>
                  </Link>
                  <Link id="clientesL" to="/clientes">
                  <Menu.Item >
                    <Icon name='users' />
                    Clientes
                  </Menu.Item>
                  </Link>
                  <Link id="controleL" to="/controle">
                  <Menu.Item >
                    <Icon name='chart line' />
                    Controle
                  </Menu.Item>
                  </Link>
                  <Link id="problemasL" to="/problemas">
                  <Menu.Item >
                    <Icon name='bell' />
                    Problemas
                  </Menu.Item>
                  </Link>
              </Sidebar>
             
                <Sidebar.Pusher>
                <Segment size="massive"  style={{padding: 0}}>
                <div>
                  
                  <Route path="/inicio" component={Inicio} />
                  <Route path="/caixa" component={Caixa} />
                  <Route path="/estoque" component={Estoque} />
                  <Route path="/vendas" component={Vendas} />
                  <Route path="/Clientes" component={Clientes} />
                  <Route path="/controle" component={Controle} />
                  <Route path="/problemas" component={Problemas} />
                </div>
                  
                  </Segment>
                  </Sidebar.Pusher>
               
        
                
                </Sidebar.Pushable>
                </Grid.Column>
               
                </Grid.Row>
               
              

              

               </Grid>
  
     
  </div>

  </BrowserRouter>

    );
}
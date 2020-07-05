import React, { Component } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.css'

export default class GoogleLogin extends Component {
  constructor(props){
    super(props);
    this.state={logged:props.logged}
  }
  
  componentDidMount(){
    const googleSignAPILoad = setInterval(() => {
      if (window.gapi){
        this.gapi=window.gapi;
        clearInterval(googleSignAPILoad);
        this.gapi.load('auth2',function(){})
      };
    },100);
  }

  login = () => {
    const clientParam = {client_id:'567815834098-0b0qg7emeean9a78jrva4m0udqi5nj5n.apps.googleusercontent.com'}
    this.gapi.auth2.init(clientParam)
    const auth = this.gapi.auth2.getAuthInstance();
    const loggedInGoogle = auth.isSignedIn.get();
    if (!loggedInGoogle){
      auth.signIn()
        .then(
        (success) => {
            this.setState({logged:true});
            this.props.loginStatus(true);
        },
        (error) => {
            this.setState({logged:false});
            this.props.loginStatus(false);
        }
        )
    }else {
      this.setState({logged:true});
      this.props.loginStatus(false);
    }
  }

  logout = (e) => {
    var auth2 = this.gapi.auth2.getAuthInstance();
    auth2.signOut()
      .then(
        (success) =>{
          this.setState({logged:false});
          this.props.loginStatus(false);
        },
        (error) => {
          console.log('Error en User signed out.');
        }
    );
    auth2.disconnect();
  }

  manejoOnClick = (e) => {
    if (e.target.id==='ingresar')
      this.login()
    else if (e.target.id==='salir')
      this.logout();
  }

  render() {
    const nombreBtn = this.state.logged ? 'Salir' : 'Ingresar con Google';
    const btnId = this.state.logged ? 'salir' : 'ingresar';
    return (
      <div>
         <div className='btn btn-primary' id={btnId}
          onClick={this.manejoOnClick}>{nombreBtn}</div>
      </div>
    )
  }
}

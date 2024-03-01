import React from 'react';
import logo from '../../resources/images/logo.svg';
import './Style.css';

function Footer() {

  return (
    <>
    <div className='footer'>

      <img src={logo} className="App-logo" alt="logo" />
    </div>
      <div className='footer-text'>
        <p>This website is designed with React.js</p>
      </div>
    </>
  );
}

export default Footer;

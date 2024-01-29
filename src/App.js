// App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './Pages/Home';
import NoMatch from './Pages/NoMatch';

import awsconfig from './aws-exports';

import { Amplify } from 'aws-amplify';

Amplify.configure(awsconfig);

const App = () => {


   const Footer = () => {

      return (
         <div className='footer-customizable'>
            <span
               className='legalText-customizable'
            >
               &copy; 2024 -&nbsp;
               <a href='https://example.com' target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                  Privacy Policy
               </a>
               &nbsp;
               <a href='https://example.com' target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Terms of Service</a>
            </span>
         </div >)
   }

   return (
      <div className="container">
         <div className="modal-dialog" style={{ marginTop: '0px' }}>
            <div className="modal-content background-customizable modal-content-mobile visible-xs visible-sm">
               <div class="banner-customizable">
                  <center>
                     <img alt="logo" className="logo-customizable" src='https://cdn.jsdelivr.net/gh/solariswu/free-cdn-source@main/logo.png' />
                  </center>
               </div>
               <div style={{ height: '5px', background: 'white' }} />
               <div className="modal-body" style={{ textAlign: 'center' }}>
                  <Routes>
                     <Route path="/" element={<Home />} />
                     <Route path="*" element={<NoMatch />} />
                  </Routes>
                  <Footer />
               </div>
            </div>
         </div>
      </div>
   );
};

export default App;
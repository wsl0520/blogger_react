import React, { Component } from 'react';
import Button from 'antd/es/button';
import Routers from "./router/routers"
import MainHeader from "../src/view/main-header"
import MainFooter from "../src/view/main-footer"
import "../src/css/index.css"
import './App.css';

function App() {
  return (
    <div className="App">
        <MainHeader/>
       
        <main className="main">
            <Routers />
        </main>

        <MainFooter/>
      </div>
  );
}

export default App;

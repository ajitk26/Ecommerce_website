import './App.css';
import React from "react"
import Header from "./component/layout/Header/Header.js"
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Footer from "./component/layout/Footer/Footer.js"
import Home from "./component/Home/Home.js"

function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Home/>
    
      <Footer/>
    </BrowserRouter>
  
  )
}

export default App;

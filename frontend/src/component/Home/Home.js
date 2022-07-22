import React, { Fragment, useEffect } from 'react'
import {CgMouse} from "react-icons/cg"
import "./Home.css"
import Product from "./Product.js"
import MetaData from "../layout/MetaData"
import {getProduct} from "../../actions/productAction"
import {useSelector,useDispatch} from "react-redux"




const product={
    name:"folding chair",
    images:[{url:"https://i.ibb.co/DRST11n/1.webp"}],
    price:" ₹1000",
    _id:"Ajit kumar"
}



const Home = () => {
    const dispatch=useDispatch();


    useEffect(()=>{

        dispatch(getProduct());

     },[dispatch]);

  return (
  <Fragment>
    <MetaData title="chairMart"/>
    <div className="banner">
        <p>Welcome to ChairMart</p>
        <h1>FIND AMAZING CHAIRS BELOW</h1> 

        <a href="#container">
            <button>
                
                Scroll<CgMouse/>

            </button>
        </a>

    </div>
    <h2 className='homeHeading'>Featured Product</h2>
    <div className='container' id='container'>
        <Product product={product}/>
        
        <Product product={product}/>

        <Product product={product}/>

        <Product product={product}/>

        <Product product={product}/>

        <Product product={product}/>

        <Product product={product}/>
        
        <Product product={product}/>


    </div>
  </Fragment>
  );
};

export default Home;
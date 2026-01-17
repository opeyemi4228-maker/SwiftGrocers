'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Inspiration from "@/components/Inspiration";
import Addition from "@/components/Addition";
import Add2 from "@/components/Add2";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="">
        <HeaderSlider />
        <FeaturedProduct />
        <Addition/>
        <Add2/>
        <Inspiration />
        
      </div>
      <Footer />
    </>
  );
};

export default Home;

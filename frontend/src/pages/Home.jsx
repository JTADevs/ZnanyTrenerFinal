import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeSection from "../components/HomeSection";
import AboutUs from "../components/AboutUs";
import FindCategory from "../components/FindCategory";
import Benefits from "../components/Benefits";

function Home() {

  return (
    <div>
        <Header/>
        <HomeSection/>
        <AboutUs/>
        <FindCategory/>
        <Benefits/>
        <Footer/>
    </div>
  );
}

export default Home;

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeSection from "../components/HomeSection";

function Home() {

  return (
    <div>
        <Header/>
        <HomeSection/>
        <Footer/>
    </div>
  );
}

export default Home;

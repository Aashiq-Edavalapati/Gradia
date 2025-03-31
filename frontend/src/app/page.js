"use client";
import { Suspense } from "react";
import HomeComponent from "./HomeComponent";

const HomePage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <HomeComponent />
  </Suspense>
);

export default HomePage;

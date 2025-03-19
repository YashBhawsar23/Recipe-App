import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1 className="bg-red-500">This is Home Page</h1>
      <Link to="/signup">Signup</Link>
      <button className="bg-blue-500">SignUp</button>
    </>
  );
};

export default Home;

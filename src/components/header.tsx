import React from "react";

const Header = ({ title }: { title: string }) => (
  <div className="header">
    <h1>{title}</h1>
    <h2>Made by Pebbles</h2>
    <h2>for Stampede's SkiesGUI</h2>
  </div>
);

export default Header;

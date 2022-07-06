import React from 'react';
import logo from '../images/cloud-logo--white.svg';
import '../stylesheets/Header.css';

const Header = ({
    showSidebar,
    setShowSidebar
}) => {
  const handleSidebar = (e) => {
    e.preventDefault();
    setShowSidebar(sidebar => !sidebar);
  };

  return (
      <nav className="navbar navbar-expand-lg navbar-inverse navbar-fixed-top">
        <div className="col-lg-12">
          <a className="navbar-brand" href="/">
            <img src={ logo } width="29" height="29" alt="DigitalOcean"/>
          </a>
          <h1 className="logo-text text f18 text-white text-normal">Chat Application</h1>
          <span className={ `text f18 text-normal list-icon show-xs ${ (showSidebar)? 'active':'' }` } onClick={ handleSidebar } />
        </div>
      </nav>
  );
}

export default Header;

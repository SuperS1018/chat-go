import React, { useState } from 'react';

import Header from './Header';
import Sidebar from './Sidebar';
import Main from './Main';

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
      <>
        <Header setShowSidebar={ setShowSidebar } showSidebar={ showSidebar }/>
        <div className="container-fluid">
          <div className="row">
            <Sidebar show={ showSidebar }/>
            <Main/>
          </div>
        </div>
      </>
  );
}

export default App;

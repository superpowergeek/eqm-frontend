import React from 'react';
import FlexDiv from '../components/shared/FlexDiv';
import AppBar from '../containers/AppBar';

const Home = (props) => {
  return (
    <FlexDiv container column>
      <AppBar />
      <div>Landing Page Here</div>
    </FlexDiv>
    
  );
};

export default Home;
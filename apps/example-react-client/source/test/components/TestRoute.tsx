import React from 'react';
import smallImage from './image.small.png';
import largeImage from './image.large.png';
import './test.css';
import './test.scss';

export const TestRoute = () => (
  <div>
    <h1>Test</h1>
    <div>
      Inlined asset: <img src={smallImage} alt="Test small asset" />
    </div>
    <div>
      Large asset: <img src={largeImage} alt="Test large asset" />
    </div>
    <div className="css-test-box">CSS test: I should be blue</div>
    <div className="scss-test-box">SCSS test: I should be pink</div>
  </div>
);

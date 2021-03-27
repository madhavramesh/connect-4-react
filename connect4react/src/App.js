import React, { useRef, useEffect, useState } from "react";
import Canvas from "./Canvas";
import "./App.css";

function App() {
  const canvasWidth = 1400;
  const canvasHeight = 1000;

  const drawRegionLeft = 200;
  const drawRegionRight = canvasWidth - drawRegionLeft;
  const drawRegionTop = 200;
  const drawRegionBottom = canvasHeight - 100;

  return (
    <div className="App">
      <header className="App-header">
        <Canvas
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          drawRegionLeft={drawRegionLeft}
          drawRegionRight={drawRegionRight}
          drawRegionTop={drawRegionTop}
          drawRegionBottom={drawRegionBottom}
        ></Canvas>
      </header>
    </div>
  );
}

export default App;

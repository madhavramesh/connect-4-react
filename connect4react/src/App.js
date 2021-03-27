import React, { useRef, useEffect, useState } from "react";
import Canvas from "./Canvas";
import "./App.css";

function App() {
  const canvasSize = 1000;

  const drawRegionLeft = 200;
  const drawRegionRight = canvasSize - drawRegionLeft;
  const drawRegionTop = 300;
  const drawRegionBottom = canvasSize - 100;

  return (
    <div className="App">
      <header className="App-header">
        <Canvas
          canvasSize={canvasSize}
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

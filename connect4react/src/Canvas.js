import React, { useRef, useEffect, useState } from "react";

function Canvas(props) {
  let canvas;
  const canvasWidth = props.canvasWidth;
  const canvasHeight = props.canvasHeight;
  const canvasRef = useRef(null);

  const drawRegionLeft = props.drawRegionLeft;
  const drawRegionRight = props.drawRegionRight;
  const drawRegionTop = props.drawRegionTop;
  const drawRegionBottom = props.drawRegionBottom;

  const [chipCoords, setChipCoords] = useState([]);
  const chipsPerRow = 7;
  const chipsPerCol = 6;
  const chipRad = 50;

  const defaultColor = "#DCDCDC";
  const redChipColor = "#900000";
  const yellowChipColor = "#fbec5d";

  const newDrawRegionLeft = drawRegionLeft - chipRad - 40;
  const newDrawRegionTop = drawRegionTop - chipRad - 40;
  const w = drawRegionRight - drawRegionLeft + 2 * (chipRad + 40);
  const h = drawRegionBottom - drawRegionTop + 2 * (chipRad + 40);

  const [player, setPlayer] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const setUp = (ctx) => {
    ctx.fillStyle = defaultColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // prettier-ignore
    for (let i = drawRegionLeft; i <= drawRegionRight; i += (drawRegionRight - drawRegionLeft) / (chipsPerRow - 1)) {
      const row = [];
      for (let j = drawRegionTop; j <= drawRegionBottom; j += (drawRegionBottom - drawRegionTop) / (chipsPerCol - 1)) {
        row.push([i, j, defaultColor]);
      }
      const newChipCoords = chipCoords;
      newChipCoords.push(row);
      setChipCoords(newChipCoords);
    }
  };

  // prettier-ignore
  const drawBoard = (ctx, color, topLeftX, topLeftY, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(topLeftX, topLeftY, w, h);
  };

  const drawChips = (ctx) => {
    for (const col of chipCoords) {
      for (const row of col) {
        drawChip(ctx, row[2], row[0], row[1], chipRad);
      }
    }
  };

  const drawChip = (ctx, color, x, y) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, chipRad, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  };

  // prettier-ignore
  const drop = (chipColor, clickX, clickY) => {
    const newChipCoords = chipCoords;
    console.log(newChipCoords);

    const newDrawRegionRight = newDrawRegionLeft + w;
    const newDrawRegionBottom = newDrawRegionTop + h;

    for (let i = newDrawRegionLeft; i < newDrawRegionRight; i += (newDrawRegionRight - newDrawRegionLeft) / (chipsPerRow - 1)) {
      const leftBoundary = i;
      const rightBoundary = i + (newDrawRegionRight - newDrawRegionLeft) / (chipsPerRow - 1);
      if (clickX >= leftBoundary && clickX < rightBoundary && clickY >= newDrawRegionTop && clickY <= newDrawRegionBottom) {
        let col = Math.floor((clickX - newDrawRegionLeft) / w * chipsPerRow);
        let row = chipCoords[col].length - 1;

        for (let j = 0; j < chipCoords[col].length; j++) {
          if (chipCoords[col][j][2] !== defaultColor) {
            row = j - 1;
            break;
          }
        }
        if (row >= 0) {
          newChipCoords[col][row][2] = chipColor;
        }
      }
    }
    setChipCoords(newChipCoords);
  };

  const mousePosOnCanvas = (x, y) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (x - rect.left) * scaleX,
      y: (y - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const mousePos = mousePosOnCanvas(event.clientX, event.clientY);
    setMouseX(mousePos["x"]);
    setMouseY(mousePos["y"]);
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const curMousePos = mousePosOnCanvas(event.clientX, event.clientY);
    const curMouseX = curMousePos["x"];
    const curMouseY = curMousePos["y"];
    const dx = curMouseX - mouseX;
    const dy = curMouseY - mouseY;

    if (dx > 0.1 || dy > 0.1) {
      return;
    }

    if (player === 0) {
      drop(redChipColor, mouseX, mouseY);
      setPlayer(1);
    } else if (player === 1) {
      drop(yellowChipColor, mouseX, mouseY);
      setPlayer(0);
    }
  };

  useEffect(() => {
    canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    setUp(ctx);
    drawBoard(ctx, "#0099FF", newDrawRegionLeft, newDrawRegionTop, w, h);
  }, []);

  useEffect(() => {
    canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    console.log("Redrawing...");

    drawChips(ctx);
  }, [drawChips]);

  return (
    <div className="canvas">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
}

export default Canvas;

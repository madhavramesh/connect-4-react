import React, { useRef, useEffect, useState } from "react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import Popup from "react-popup";

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

  const [win, setWin] = useState(false);

  const setUp = (ctx) => {
    ctx.fillStyle = defaultColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const newChipCoords = chipCoords;
    // prettier-ignore
    for (let i = drawRegionLeft; i <= drawRegionRight; i += (drawRegionRight - drawRegionLeft) / (chipsPerRow - 1)) {
      const row = [];
      for (let j = drawRegionTop; j <= drawRegionBottom; j += (drawRegionBottom - drawRegionTop) / (chipsPerCol - 1)) {
        row.push([i, j, defaultColor]);
      }
      newChipCoords.push(row);
    }
    setChipCoords(newChipCoords);
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

    const newDrawRegionRight = newDrawRegionLeft + w;
    const newDrawRegionBottom = newDrawRegionTop + h;

    for (let i = newDrawRegionLeft; i < newDrawRegionRight; i += (newDrawRegionRight - newDrawRegionLeft) / (chipsPerRow - 1)) {
      const leftBoundary = i;
      const rightBoundary = i + (newDrawRegionRight - newDrawRegionLeft) / (chipsPerRow - 1);
      if (clickX >= leftBoundary && clickX < rightBoundary && clickY >= newDrawRegionTop && clickY <= newDrawRegionBottom) {
        console.log("Click confirmed");
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

  // prettier-ignore
  const calculateWin = () => {
    // vertical win
    for (let i = 0; i < chipCoords.length; i++) {
      for (let j = 0; j < chipCoords[i].length - 3; j++) {
        if (chipCoords[i][j][2] === chipCoords[i][j + 1][2]
        && chipCoords[i][j + 1][2] === chipCoords[i][j + 2][2]
        && chipCoords[i][j + 2][2] === chipCoords[i][j + 3][2]
        && chipCoords[i][j][2] !== defaultColor) {
          setWin(true);
        }
      }
    }

    // horizontal win
    for (let i = 0; i < chipCoords.length - 3; i++) {
      for (let j = 0; j < chipCoords[i].length; j++) {
        if (chipCoords[i][j][2] === chipCoords[i+1][j][2]
            && chipCoords[i+1][j][2] === chipCoords[i+2][j][2]
            && chipCoords[i+2][j][2] === chipCoords[i+3][j][2]
            && chipCoords[i][j][2] !== defaultColor) {
          setWin(true);
        }
      }
    }

    // descending diagonal
    for (let i = 3; i < chipCoords.length; i++) {
      for (let j = 3; j < chipCoords[i].length; j++) {
        if (chipCoords[i][j][2] === chipCoords[i-1][j-1][2]
            && chipCoords[i-1][j-1][2] === chipCoords[i-2][j-2][2]
            && chipCoords[i-2][j-2][2] === chipCoords[i-3][j-3][2]
            && chipCoords[i][j][2] !== defaultColor) {
          setWin(true);
        }
      }
    }

    // ascending diagonal
    for (let i = 0; i < chipCoords.length - 3; i++) {
      for (let j = 3; j < chipCoords[i].length; j++) {
        if (chipCoords[i][j][2] === chipCoords[i+1][j-1][2]
            && chipCoords[i+1][j-1][2] === chipCoords[i+2][j-2][2]
            && chipCoords[i+2][j-2][2] === chipCoords[i+3][j-3][2]
            && chipCoords[i][j][2] !== defaultColor) {
          setWin(true);
        }
      }
    }
  }

  // prettier-ignore
  const resetChips = () => {
    canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    const newChipCoords = chipCoords;
    for (let i = 0; i < chipCoords.length; i++) {
      for (let j = 0; j < chipCoords[i].length; j++) {
        newChipCoords[i][j][2] = defaultColor;
      }
    }
    setChipCoords(newChipCoords);
    setWin(false);
    console.log(chipCoords);
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

    if (!win) {
      drawChips(ctx);
      calculateWin();
    } else {
      console.log("WINNER");
    }
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
      <AwesomeButton type="primary" onPress={() => resetChips()}>
        Clear Board
      </AwesomeButton>
    </div>
  );
}

export default Canvas;

import React, { useRef, useEffect, useState } from "react";

function Canvas(props) {
  let canvas;
  const canvasSize = props.canvasSize;
  const canvasRef = useRef(null);

  const [canvasLeftEdge, setCanvasLeftEdge] = useState(0);
  const [canvasTopEdge, setCanvasTopEdge] = useState(0);

  const drawRegionLeft = props.drawRegionLeft;
  const drawRegionRight = props.drawRegionRight;
  const drawRegionTop = props.drawRegionTop;
  const drawRegionBottom = props.drawRegionBottom;

  const [chipCoords, setChipCoords] = useState([]);
  const chipsPerRow = 4;
  const chipRad = 50;

  const player1chip = [chipRad + 20, chipRad + 20];
  const player2chip = [canvasSize - player1chip[0], player1chip[1]];

  const [player1chipIsDown, setPlayer1chipIsDown] = useState(false);
  const [player2chipIsDown, setPlayer2chipIsDown] = useState(false);
  const [player1chipDrag, setPlayer1chipDrag] = useState(player1chip);
  const [player2chipDrag, setPlayer2chipDrag] = useState(player2chip);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const setUp = (ctx) => {
    ctx.fillStyle = "#DCDCDC";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // prettier-ignore
    for (let i = drawRegionLeft; i <= drawRegionRight; i += (drawRegionRight - drawRegionLeft) / (chipsPerRow - 1)) {
      for (let j = drawRegionTop; j <= drawRegionBottom; j += (drawRegionBottom - drawRegionTop) / (chipsPerRow - 1)) {
        const newChipCoords = chipCoords;
        newChipCoords.push([i, j, false]);
        setChipCoords(newChipCoords);
      }
    }
  };

  // prettier-ignore
  const drawBoard = (ctx, color, topLeftX, topLeftY, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(topLeftX, topLeftY, w, h);

    for (const coord of chipCoords) {
      drawChip(ctx, "#DCDCDC", coord[0], coord[1], chipRad);
    }
  };

  const drawChips = (ctx) => {
    for (const coord of chipCoords) {
      if (coord[2]) {
        drawChip(ctx, "#900000", coord[0], coord[1], chipRad);
      }
    }
    drawChip(ctx, "#900000", player1chip[0], player1chip[1]);
    drawChip(ctx, "#fbec5d", player2chip[0], player2chip[1]);
    if (player1chipIsDown) {
      drawChip(ctx, "#900000", player1chipDrag[0], player1chipDrag[1]);
    } else if (player2chipIsDown) {
      drawChip(ctx, "#fbec5d", player2chipDrag[0], player2chipDrag[1]);
    }
  };

  const drawChip = (ctx, color, x, y) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, chipRad, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  };

  const dist = (x1, x2, y1, y2) => {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  };

  const handleMouseDown = (event) => {
    event.preventDefault();

    setMouseX(parseInt(event.clientX - canvasLeftEdge));
    setMouseY(parseInt(event.clientY - canvasTopEdge));

    if (dist(player1chip[0], mouseX, player1chip[1], mouseY) < chipRad) {
      console.log("Chip 1 down");
      setPlayer1chipIsDown(true);
    } else if (dist(player2chip[0], mouseX, player2chip[1], mouseY) < chipRad) {
      console.log("Chip 2 down");
      setPlayer2chipIsDown(true);
    }
  };

  const handleMouseMove = (event) => {
    if (!player1chipIsDown && !player2chipIsDown) return;

    event.preventDefault();

    const curMouseX = parseInt(event.clientX - canvasLeftEdge);
    const curMouseY = parseInt(event.clientY - canvasTopEdge);
    const dx = curMouseX - mouseX;
    const dy = curMouseY - mouseY;
    setMouseX(curMouseX);
    setMouseY(curMouseY);

    if (player1chipIsDown) {
      setPlayer1chipDrag([player1chipDrag[0] + dx, player1chipDrag[1] + dy]);
    } else if (player2chipIsDown) {
      setPlayer2chipDrag([player2chipDrag[0] + dx, player2chipDrag[1] + dy]);
    }
  };

  const handleMouseUp = (event) => {
    event.preventDefault();

    setPlayer1chipIsDown(false);
    setPlayer2chipIsDown(false);
    setPlayer1chipDrag(player1chip);
    setPlayer2chipDrag(player2chip);
  };

  const handleMouseOut = (event) => {
    event.preventDefault();
    handleMouseUp(event);
  };

  useEffect(() => {
    canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    const newDrawRegionLeft = drawRegionLeft - chipRad - 40;
    const newDrawRegionTop = drawRegionTop - chipRad - 40;
    const w = drawRegionRight - drawRegionLeft + 2 * (chipRad + 40);
    const h = drawRegionBottom - drawRegionTop + 2 * (chipRad + 40);

    setUp(ctx);
    drawBoard(ctx, "#0099FF", newDrawRegionLeft, newDrawRegionTop, w, h);
  }, []);

  useEffect(() => {
    canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    setCanvasLeftEdge(rect.left);
    setCanvasTopEdge(rect.top);

    drawChips(ctx);
  }, [chipCoords, player1chipDrag, player2chipDrag]);

  return (
    <div className="canvas">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
      ></canvas>
    </div>
  );
}

export default Canvas;

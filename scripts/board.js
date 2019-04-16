class Board
{
	constructor()
	{
		this.GridSize = 15;
		this.PixelsPerSquare = 4;
		this.GridPixels = this.GridSize * this.PixelsPerSquare;
		this.LineColor = "#333333";

		var width = $(window).width();
		var height = $(window).height();
		var size, percent;

		if (height > width)
		{
			size = width;
			percent = .95;
		}
		else
		{
			size = height;
			percent = .75;
		}

		this.PixelSize = parseInt((size * percent) / this.GridPixels, 10);
		this.SquareSize = this.PixelSize * this.PixelsPerSquare;
		this.CanvasWidth = this.SquareSize * this.GridSize;
		this.CanvasHeight = this.CanvasWidth;

		this.Canvas = document.getElementById("SnakeCanvas");
		this.Canvas.width = this.CanvasWidth;
		this.Canvas.height = this.CanvasHeight;
		this.Ctx = this.Canvas.getContext("2d");
	}

	Initialize()
	{
		this.Ctx.clearRect(0, 0, this.CanvasWidth, this.CanvasHeight);

		//draw grid lines
		for (var i = 0; i < this.CanvasWidth; i += this.SquareSize)
		{
			//adjust half a pixel to prevent blurry lines since width is calculated from center
			this.DrawLine(new Position(i + .5, 0), new Position(i + .5, this.CanvasHeight), this.LineColor, 1);
			this.DrawLine(new Position(0, i + .5), new Position(this.CanvasWidth, i + .5), this.LineColor, 1);
		}
	}

	DrawLine(startPos, endPos, color, width)
	{
		this.Ctx.lineWidth = width;
		this.Ctx.strokeStyle = color;
		this.Ctx.beginPath();
		this.Ctx.moveTo(startPos.X, startPos.Y);
		this.Ctx.lineTo(endPos.X, endPos.Y);
		this.Ctx.stroke();
	}

	ClearSnake()
	{
		this.ClearPixel(snake.Positions[snake.Positions.length - 1]);
	}

	DrawSnake()
	{
		for (var i = 0; i < snake.Positions.length; i++)
		{
			this.DrawPixel(snake.Positions[i], snake.Color);
		}
	}

	ClearPixel(pos)
	{
		this.Ctx.clearRect(pos.X * this.SquareSize, pos.Y * this.SquareSize, this.SquareSize, this.SquareSize);

		//redraw grid lines for square
		var lineX = (pos.X * this.SquareSize);
		var lineY = (pos.Y * this.SquareSize);
		this.DrawLine(new Position(lineX + .5, lineY), new Position(lineX + .5, lineY + this.SquareSize), this.LineColor, 1);
		this.DrawLine(new Position(lineX, lineY + .5), new Position(lineX + this.SquareSize, lineY + .5), this.LineColor, 1);
	}

	DrawPixel(pos, color)
	{
		this.Ctx.fillStyle = color;
		this.Ctx.fillRect(pos.X * this.SquareSize, pos.Y * this.SquareSize, this.SquareSize, this.SquareSize);
	}
}

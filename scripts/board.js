class Board
{
	constructor()
	{
		this.GridSquares = 15;
		this.PixelsPerSquare = 6;
		this.GridPixels = this.GridSquares * this.PixelsPerSquare;
		this.LineColor = "#333333";

		var width = $(window).width();
		var height = $(window).height();
		var size, percent;

		if (height > width)
		{
			size = width;
			percent = .90;
		}
		else
		{
			size = height;
			percent = .75;
		}

		this.PixelSize = parseInt((size * percent) / this.GridPixels, 10);
		this.SquareSize = this.PixelSize * this.PixelsPerSquare;
		this.CanvasWidth = this.SquareSize * this.GridSquares;
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

	ClearSnakeTail()
	{
		this.ClearSquare(snake.Positions[snake.Positions.length - 1]);
	}

	DrawSnake()
	{
		//get color index for body
		var bodyIndex = snake.ColorIndex - 1;

		if (bodyIndex < 0)
			bodyIndex = snake.Colors.length - 1;

		//get head color
		var headColor = snake.GetColor();
		snake.HeadSprite.Rects[0].Color = headColor;
		snake.HeadSprite.Rects[1].Color = headColor;

		//draw body. only need to draw the position after head
		this.ClearSquare(snake.Positions[1]);
		var bodyColor = snake.Colors[bodyIndex];

		if (snake.ChangedDirection)
		{
			var curve = snake.GetCurveSprite();
			curve.Rects[0].Color = bodyColor;
			curve.Rects[1].Color = bodyColor;
			curve.Rects[2].Color = bodyColor;

			this.DrawSprite(snake.Positions[1], curve);
		}
		else
			this.DrawSquare(snake.Positions[1], bodyColor);

		//draw tail
		this.ClearSnakeTail();
		var tailColor = snake.GetTailColor();

		var tail = snake.TailSprite;
		tail.Rects[0].Color = tailColor;
		tail.Rects[1].Color = tailColor;
		tail.Rects[2].Color = tailColor;

		this.DrawSprite(snake.Positions[snake.Positions.length - 1], tail);

		//draw head
		this.DrawSprite(snake.Head, snake.HeadSprite);
	}

	DrawApple(pos)
	{
		this.DrawSprite(pos, apple.AppleSprite);
	}

	DrawSprite(pos, sprite)
	{
		for (var i = 0; i < sprite.Rects.length; i++)
		{
			this.DrawRectangle(pos, sprite.Rects[i]);
		}
	}

	DrawRectangle(pos, rect)
	{
		var x = (pos.X * this.SquareSize) + (this.PixelSize * rect.X);
		var y = (pos.Y * this.SquareSize) + (this.PixelSize * rect.Y);
		var width = this.PixelSize * rect.Width;
		var height = this.PixelSize * rect.Height;

		this.Ctx.fillStyle = rect.Color;
		this.Ctx.fillRect(x, y, width, height);
	}

	ClearSquare(pos)
	{
		this.Ctx.clearRect(pos.X * this.SquareSize, pos.Y * this.SquareSize, this.SquareSize, this.SquareSize);

		//redraw grid lines for square
		var lineX = (pos.X * this.SquareSize);
		var lineY = (pos.Y * this.SquareSize);
		this.DrawLine(new Position(lineX + .5, lineY), new Position(lineX + .5, lineY + this.SquareSize), this.LineColor, 1);
		this.DrawLine(new Position(lineX, lineY + .5), new Position(lineX + this.SquareSize, lineY + .5), this.LineColor, 1);
	}

	DrawSquare(pos, color)
	{
		this.Ctx.fillStyle = color;
		this.Ctx.fillRect(pos.X * this.SquareSize, pos.Y * this.SquareSize, this.SquareSize, this.SquareSize);
	}
}

class Rect
{
	constructor(x, y, width, height, color)
	{
		this.X = x;
		this.Y = y;
		this.Width = width;
		this.Height = height;
		this.Color = color;
	}

	RotateClockwise()
	{
		var temp = this.Clone();
		this.X = board.PixelsPerSquare - (temp.Y + temp.Height);
		this.Y = temp.X;
		this.Width = temp.Height;
		this.Height = temp.Width;
	}

	RotateCounterClockwise()
	{
		var temp = this.Clone();
		this.X = temp.Y;
		this.Y = board.PixelsPerSquare - (temp.X + temp.Width);
		this.Width = temp.Height;
		this.Height = temp.Width;
	}

	FlipHorzAndVert()
	{
		var temp = this.Clone();
		this.X = board.PixelsPerSquare - (temp.X + temp.Width);
		this.Y = board.PixelsPerSquare - (temp.Y + temp.Height);
	}

	Clone()
	{
		return new Rect(this.X, this.Y, this.Width, this.Height, this.Color);
	}
}

class Sprite
{
	constructor()
	{
		this.Rects = [];
	}

	Add(rect)
	{
		this.Rects.push(rect);
	}

	RotateClockwise()
	{
		for (var i = 0; i < this.Rects.length; i++)
		{
			this.Rects[i].RotateClockwise();
		}
	}

	RotateCounterClockwise()
	{
		for (var i = 0; i < this.Rects.length; i++)
		{
			this.Rects[i].RotateCounterClockwise();
		}
	}

	FlipHorzAndVert()
	{
		for (var i = 0; i < this.Rects.length; i++)
		{
			this.Rects[i].FlipHorzAndVert();
		}
	}
}
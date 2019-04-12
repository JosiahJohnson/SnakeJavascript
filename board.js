class Board
{
	constructor()
	{
		this.SizeInPixels = 15;

		var width = $(window).width();
		var height = $(window).height();
		var size, percent;

		if (height > width)
		{
			size = width;
			percent = .9;
		}
		else
		{
			size = height;
			percent = .75;
		}

		this.PixelSize = parseInt((size / this.SizeInPixels) * percent, 10);
		this.CanvasWidth = this.PixelSize * this.SizeInPixels;
		this.CanvasHeight = this.CanvasWidth;

		this.Canvas = document.getElementById("SnakeCanvas");
		this.Canvas.width = this.CanvasWidth;
		this.Canvas.height = this.CanvasHeight;
		this.Ctx = this.Canvas.getContext("2d");
	}

	ClearScreen()
	{
		this.Ctx.clearRect(0, 0, this.CanvasWidth, this.CanvasHeight);
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
		this.Ctx.clearRect(pos.X * this.PixelSize, pos.Y * this.PixelSize, this.PixelSize, this.PixelSize);
	}

	DrawPixel(pos, color)
	{
		this.Ctx.fillStyle = color;
		this.Ctx.fillRect(pos.X * this.PixelSize, pos.Y * this.PixelSize, this.PixelSize, this.PixelSize);
	}
}
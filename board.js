class Board
{
	constructor()
	{
		this.PixelCount = 20;

		var screenWidth = $(window).width();
		var screenHeight = $(window).height();
		var screenSize = screenWidth;

		if (screenHeight < screenWidth)
			screenSize = screenHeight;

		this.PixelSize = parseInt((screenSize / this.PixelCount) * .9);
		this.CanvasWidth = this.PixelSize * this.PixelCount;
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
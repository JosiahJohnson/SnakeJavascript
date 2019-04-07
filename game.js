class Game
{
	constructor()
	{
		this.canvas = document.getElementById("SnakeCanvas");
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		this.ctx = this.canvas.getContext("2d");
		this.snake = new Snake();
		this.apple = new Apple(this.snake);
		this.playerInput = null;
		this.score = 0;
		this.steps = 0;
		this.gameOver = false;

		$(this.canvas).click(CanvasClickEvent);
		$(window).keydown(KeyPressed);

		this.DrawPixel(this.apple.Pos, this.apple.Color);
		this.GameLoop();
	}

	GameLoop()
	{
		if (!this.gameOver)
		{
			if (this.steps > 0)
			{
				this.ClearScreen();
				this.CheckUserInput();
				this.ChangeSnakePosition();
			}

			this.DisplaySnake();
			this.steps++;

			setTimeout(this.GameLoop.bind(this), 200);
		}
		else
		{
			//alert("GAME OVER MAN!!");

			this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			this.score = 0;
			this.steps = 0;
			this.gameOver = false;
			this.snake.Initialize();
			this.apple.RandomizePosition(this.snake);
			this.DrawPixel(this.apple.Pos, this.apple.Color);
			this.GameLoop();
		}
	}

	ClearScreen()
	{
		this.ClearPixel(this.snake.Positions[this.snake.Positions.length - 1]);
	}

	CheckUserInput()
	{
		switch (this.playerInput)
		{
			case Direction.Up:
				if (this.snake.Dir != Direction.Down)
					this.snake.Dir = Direction.Up;
				break;
			case Direction.Down:
				if (this.snake.Dir != Direction.Up)
					this.snake.Dir = Direction.Down;
				break;
			case Direction.Left:
				if (this.snake.Dir != Direction.Right)
					this.snake.Dir = Direction.Left;
				break;
			case Direction.Right:
				if (this.snake.Dir != Direction.Left)
					this.snake.Dir = Direction.Right;
				break;
		}

		this.playerInput = null;
	}

	ChangeSnakePosition()
	{
		//Position lastPos = new Position(snake.Tail.X, snake.Tail.Y);

		//set tail positions
		for (var i = (this.snake.Positions.length - 1); i > 0; i--)
		{
			this.snake.Positions[i].X = this.snake.Positions[i - 1].X;
			this.snake.Positions[i].Y = this.snake.Positions[i - 1].Y;
		}

		//set head position
		switch (this.snake.Dir)
		{
			case Direction.Up:
				this.snake.Head.Y--;
				break;
			case Direction.Down:
				this.snake.Head.Y++;
				break;
			case Direction.Left:
				this.snake.Head.X--;
				break;
			case Direction.Right:
				this.snake.Head.X++;
				break;
		}

		//check if ate apple
		if (this.snake.Head.X == this.apple.Pos.X && this.snake.Head.Y == this.apple.Pos.Y)
		{
			//snake.Positions.Add(lastPos);
			this.apple.RandomizePosition(this.snake);
			this.DrawPixel(this.apple.Pos, this.apple.Color);
			this.score += 10;
		}

		//check for collisions
		if (this.snake.Head.X < 0 || this.snake.Head.X > (boardPixels - 1) || this.snake.Head.Y < 0 ||
			this.snake.Head.Y > (boardPixels - 1))// || snake.AteSelf())
		{
			this.gameOver = true;
		}
	}

	DisplaySnake()
	{
		for (var i = 0; i < this.snake.Positions.length; i++)
		{
			this.DrawPixel(this.snake.Positions[i], this.snake.Color);
		}
	}

	DrawPixel(pos, color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect(pos.X * pixelSize, pos.Y * pixelSize, pixelSize, pixelSize);
	}

	ClearPixel(pos)
	{
		this.ctx.clearRect(pos.X * pixelSize, pos.Y * pixelSize, pixelSize, pixelSize);
	}
}

class Position
{
	constructor(x, y)
	{
		this.X = x;
		this.Y = y;
	}
}

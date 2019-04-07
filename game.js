class Game
{
	constructor()
	{
		this.canvas = document.getElementById("SnakeCanvas");
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		this.ctx = this.canvas.getContext("2d");
		this.snake = new Snake();
		this.playerInput = null;
		this.score = 0;
		this.steps = 0;
		this.gameOver = false;

		$(this.canvas).click(CanvasClickEvent);

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

			this.DisplayOutput();
			this.steps++;

			setTimeout(this.GameLoop.bind(this), 200);
		}
		else
		{
			alert("GAME OVER MAN!!");

			this.score = 0;
			this.steps = 0;
			this.gameOver = false;
			this.snake.Initialize();
			//apple.RandomizePosition(snake);
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

		////check if ate apple
		//if (snake.Head.X == apple.Position.X && snake.Head.Y == apple.Position.Y)
		//{
		//	snake.Positions.Add(lastPos);
		//	apple.RandomizePosition(snake);
		//	score += 10;
		//}

		////check for collisions
		//if (snake.Head.X < 1 || snake.Head.X > (gridWidth - 2) || snake.Head.Y < 1 || snake.Head.Y > (gridHeight - 2) || snake.AteSelf())
		//	gameOver = true;
	}

	DisplayOutput()
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
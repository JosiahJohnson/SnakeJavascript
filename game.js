class Game
{
	constructor()
	{
		this.canvas = document.getElementById("SnakeCanvas");
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		this.ctx = this.canvas.getContext("2d");
		this.snake = new Snake();
		this.score = 0;
		this.steps = 0;
		this.gameOver = false;

		this.GameLoop();
	}

	GameLoop()
	{
		if (!this.gameOver)
		{
			if (this.steps > 0)
			{
				this.ClearScreen();
				//CheckUserInput();
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
			//snake.Initialize();
			//apple.RandomizePosition(snake);
			this.GameLoop();
		}
	}

	ClearScreen()
	{
		this.ClearPixel(this.snake.Positions[this.snake.Positions.length - 1]);
	}

	ChangeSnakePosition()
	{
		//set tail positions
		for (var i = (this.snake.Positions.length - 1); i > 0; i--)
		{
			this.snake.Positions[i].X = this.snake.Positions[i - 1].X;
			this.snake.Positions[i].Y = this.snake.Positions[i - 1].Y;
		}

		//set head position
		this.snake.Positions[0].X++;
		//switch (snake.Direction)
		//{
		//	case Direction.Up:
		//		snake.Head.Y--;
		//		break;
		//	case Direction.Down:
		//		snake.Head.Y++;
		//		break;
		//	case Direction.Left:
		//		snake.Head.X -= 2;
		//		break;
		//	case Direction.Right:
		//		snake.Head.X += 2;
		//		break;
		//}
	}

	DisplayOutput()
	{
		for (var i = 0; i < this.snake.Positions.length; i++)
		{
			this.DrawPixel(this.snake.Positions[i]);
		}
	}

	DrawPixel(pos)
	{
		this.ctx.fillStyle = "#FF0000";
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
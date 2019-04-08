var board, snake, apple, player;
const Direction = { "Up": 0, "Down": 1, "Left": 2, "Right": 3 };

$(function ()
{
	InitializeGame();
});

function InitializeGame()
{
	board = new Board();
	snake = new Snake();
	apple = new Apple();
	player = new Player();

	$(board.Canvas).mousedown(CanvasClickEvent);
	$(window).keydown(KeyPressed);

	board.DrawPixel(apple.Pos, apple.Color);
	GameLoop();
}

function GameLoop()
{
	if (!player.GameOver)
	{
		if (player.Steps > 0)
		{
			board.ClearSnake();
			player.CheckInput();
			snake.ChangePosition();
		}

		board.DrawSnake();
		player.Steps++;

		setTimeout(GameLoop.bind(this), player.GetSpeed());
	}
	else
	{
		alert("GAME OVER MAN!!\r\nScore: " + player.Score);

		board.ClearScreen();
		snake.Initialize();
		apple.RandomizePosition();
		player.Initialize();
		board.DrawPixel(apple.Pos, apple.Color);
		GameLoop();
	}
}

function CanvasClickEvent(e)
{
	if (snake.Dir == Direction.Up || snake.Dir == Direction.Down)
	{
		var clickX = (e.pageX - $(this).offset().left);
		var x = parseInt(clickX / board.PixelSize);
		var snakeX = snake.Head.X;

		if (x > snakeX)
			player.Input = Direction.Right;
		else if (x < snakeX)
			player.Input = Direction.Left;
	}
	else if (snake.Dir == Direction.Left || snake.Dir == Direction.Right)
	{
		var clickY = (e.pageY - $(this).offset().top);
		var y = parseInt(clickY / board.PixelSize);
		var snakeY = snake.Head.Y;

		if (y > snakeY)
			player.Input = Direction.Down;
		else if (y < snakeY)
			player.Input = Direction.Up;
	}
}

function KeyPressed(e)
{
	if (e.key == "ArrowUp" || e.key == "w")
		player.Input = Direction.Up;
	else if (e.key == "ArrowDown" || e.key == "s")
		player.Input = Direction.Down;
	else if (e.key == "ArrowLeft" || e.key == "a")
		player.Input = Direction.Left;
	else if (e.key == "ArrowRight" || e.key == "d")
		player.Input = Direction.Right;
}

class Position
{
	constructor(x, y)
	{
		this.X = x;
		this.Y = y;
	}
}

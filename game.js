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

	document.addEventListener("keydown", KeyPressed, false);
	document.addEventListener("touchstart", TouchStart, { passive: false });
	document.addEventListener("touchmove", TouchMove, { passive: false });

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

function TouchStart(e)
{
	e.preventDefault();
	player.TouchEnd = false;
	player.TouchStartX = e.touches[0].clientX;
	player.TouchStartY = e.touches[0].clientY;
}

function TouchMove(e)
{
	e.preventDefault();

	if (!player.TouchEnd)
	{
		var touch = e.touches[0];

		//snake only has 2 choices for directions, so eliminate any ambiguity in swipe direction
		if (snake.Dir == Direction.Up || snake.Dir == Direction.Down)
		{
			if (touch.clientX < (player.TouchStartX - player.TouchMinDistance))
			{
				player.TouchEnd = true;
				player.Input = Direction.Left;
			}
			else if (touch.clientX > (player.TouchStartX + player.TouchMinDistance))
			{
				player.TouchEnd = true;
				player.Input = Direction.Right;
			}
		}
		else if (snake.Dir == Direction.Left || snake.Dir == Direction.Right)
		{
			if (touch.clientY < (player.TouchStartY - player.TouchMinDistance))
			{
				player.TouchEnd = true;
				player.Input = Direction.Up;
			}
			else if (touch.clientY > (player.TouchStartY + player.TouchMinDistance))
			{
				player.TouchEnd = true;
				player.Input = Direction.Down;
			}
		}
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

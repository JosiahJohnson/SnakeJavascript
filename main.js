var boardPixels = 20;
var game, pixelSize, canvasWidth, canvasHeight;
const Direction = { "Up": 0, "Down": 1, "Left": 2, "Right": 3 };

$(function ()
{
	SetBoardSize();
	game = new Game();
});

function SetBoardSize()
{
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();
	var screenSize = screenWidth;

	if (screenHeight < screenWidth)
		screenSize = screenHeight;

	pixelSize = parseInt((screenSize / boardPixels) * .9);
	canvasWidth = pixelSize * boardPixels;
	canvasHeight = canvasWidth;
}

function CanvasClickEvent(e)
{
	var snake = game.snake;

	if (snake.Dir == Direction.Up || snake.Dir == Direction.Down)
	{
		var clickX = (e.pageX - $(this).offset().left);
		var x = parseInt(clickX / pixelSize);
		var snakeX = snake.Head.X;

		if (x > snakeX)
			game.playerInput = Direction.Right;
		else if (x < snakeX)
			game.playerInput = Direction.Left;
	}
	else if (snake.Dir == Direction.Left || snake.Dir == Direction.Right)
	{
		var clickY = (e.pageY - $(this).offset().top);
		var y = parseInt(clickY / pixelSize);
		var snakeY = snake.Head.Y;

		if (y > snakeY)
			game.playerInput = Direction.Down;
		else if (y < snakeY)
			game.playerInput = Direction.Up;
	}
}

function KeyPressed(e)
{
	if (e.key == "ArrowUp" || e.key == "w")
		game.playerInput = Direction.Up;
	else if (e.key == "ArrowDown" || e.key == "s")
		game.playerInput = Direction.Down;
	else if (e.key == "ArrowLeft" || e.key == "a")
		game.playerInput = Direction.Left;
	else if (e.key == "ArrowRight" || e.key == "d")
		game.playerInput = Direction.Right;
}
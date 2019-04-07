var pixelSize, canvasWidth, canvasHeight;
const Direction = { "Up": 0, "Down": 1, "Left": 2, "Right": 3 };

$(function ()
{
	SetBoardSize();
	var game = new Game();
});

function SetBoardSize()
{
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();
	var screenSize = screenWidth;

	if (screenHeight < screenWidth)
		screenSize = screenHeight;

	pixelSize = parseInt((screenSize / 30) * .9);
	canvasWidth = pixelSize * 30;
	canvasHeight = canvasWidth;
}
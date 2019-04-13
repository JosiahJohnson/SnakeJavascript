var board, snake, apple, player;
const Direction = { "Up": 0, "Down": 1, "Left": 2, "Right": 3 };

$(function ()
{
	board = new Board();
	snake = new Snake();
	apple = new Apple();
	player = new Player();

	document.addEventListener("keydown", KeyPressed, false);
	document.addEventListener("touchstart", TouchStart, { passive: false });
	document.addEventListener("touchmove", TouchMove, { passive: false });

	$("#PlayButton, #PlayAgainButton").click(function ()
	{
		HideAllDivs();
		$("#GameDiv").show();
		ResetGame();
	});

	$("#LeaderboardButton").click(function ()
	{
		HideAllDivs();
		$("#LeaderboardDiv").show();
		LoadLeaderboard();
		$("#Leaderboard_HomeButton").focus();
	});

	$("#QuitButton, #Leaderboard_HomeButton").click(function ()
	{
		HideAllDivs();
		$("#HomeDiv").show();
		$("#PlayButton").focus();
	});
	
	$("#PlayButton").focus();
});

function ResetGame()
{
	board.ClearScreen();
	snake.Initialize();
	apple.RandomizePosition();
	player.Initialize();
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

		var speed = player.GetSpeed();
		player.Time += speed;
		setTimeout(GameLoop.bind(this), speed);
	}
	else
	{
		$("#GameOverDiv").show();
		$("#GameOverScore").text(player.Score);
		$("#GameOverTime").text(player.GetTimeString());
		$("#PlayAgainButton").focus();
		player.SaveScore();
	}
}

function HideAllDivs()
{
	$("#HomeDiv").hide();
	$("#GameDiv").hide();
	$("#GameOverDiv").hide();
	$("#GameOverHiScoreDiv").hide();
	$("#LeaderboardDiv").hide();
}

function KeyPressed(e)
{
	if (!player.GameOver)
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
}

function TouchStart(e)
{
	if (!player.GameOver)
	{
		e.preventDefault();
		player.TouchEnd = false;
		player.TouchStartX = e.touches[0].clientX;
		player.TouchStartY = e.touches[0].clientY;
	}
}

function TouchMove(e)
{
	if (!player.GameOver)
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
}

function LoadLeaderboard()
{
	var scoreArray = player.GetHiScores();
	var rowsHtml = "";
	$("#LeaderboardTable tr.ScoreRow").remove();

	if (scoreArray.length > 0)
	{
		for (var i = 0; i < scoreArray.length; i++)
		{
			var scoreObj = scoreArray[i];
			rowsHtml += "<tr class=\"ScoreRow\"><td>" + (i + 1) + "</td>";
			rowsHtml += "<td>" + scoreObj.score + "</td>";
			rowsHtml += "<td>" + scoreObj.timeString + "</td>";
			rowsHtml += "<td>" + new Date(scoreObj.date).toLocaleDateString() + "</td>";
			rowsHtml += "</tr>";
		}
	}
	else
		rowsHtml += "<tr class=\"ScoreRow\"><td colspan=\"4\">...maybe try playing the game first!</td>";

	$("#LeaderboardTable").append(rowsHtml);
}

class Position
{
	constructor(x, y)
	{
		this.X = x;
		this.Y = y;
	}
}

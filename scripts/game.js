var board, snake, apple, player;
const Direction = { "Up": 0, "Down": 1, "Left": 2, "Right": 3 };
const Difficulty = { "Easy": 1, "Medium": 2, "Hard": 3 };

$(function ()
{
	board = new Board();
	snake = new Snake();
	apple = new Apple();
	player = new Player();

	document.addEventListener("keydown", KeyPressed, false);
	document.addEventListener("touchstart", TouchStart, { passive: false });
	document.addEventListener("touchmove", TouchMove, { passive: false });

	AttachButtonClickEvents();
	
	$("#Home_PlayButton").focus();
});

function ResetGame()
{
	board.Initialize();
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
			board.ClearSnakeTail();
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
		$("#GameOver_PlayAgainButton").focus();
		player.SaveScore();
		player.SaveCoins();
		player.SaveStats();
	}
}

function AttachButtonClickEvents()
{
	//home screen
	$("#Home_PlayButton").click(function ()
	{
		$("#DifficultyDiv").show();
		$("#Home_HardButton").focus();
	});

	$("#GameOver_QuitButton, #Leaderboard_HomeButton, #Customize_HomeButton").click(function ()
	{
		HideAllDivs();
		$("#HomeDiv").show();
		$("#Home_PlayButton").focus();
	});

	//game screen
	$("#Home_EasyButton, #Home_MediumButton, #Home_HardButton").click(function ()
	{
		player.Diff = parseInt($(this).data("difficulty"), 10);
		HideAllDivs();
		$("#GameDiv").show();
		$("#Difficulty").text(GetKeyByValue(Difficulty, player.Diff));
		ResetGame();
	});

	$("#GameOver_PlayAgainButton").click(function ()
	{
		HideAllDivs();
		$("#GameDiv").show();
		ResetGame();
	});

	//leaderboard screen
	$("#Home_LeaderboardButton, #GameOver_LeaderboardButton").click(function ()
	{
		HideAllDivs();
		$("#LeaderboardDiv").show();
		LoadLeaderboard();
		$("#Leaderboard_HomeButton").focus();
	});

	$("#Leaderboard_EasyButton, #Leaderboard_MediumButton, #Leaderboard_HardButton").click(function ()
	{
		player.Diff = parseInt($(this).data("difficulty"), 10);
		LoadLeaderboard();
	});

	//customize screen
	$("#Home_CustomizeButton").click(function ()
	{
		HideAllDivs();
		$("#CustomizeDiv").show();
		LoadCustomizations();
		$("#Customize_HomeButton").focus();
	});

	$(".CustomizeItem").click(ColorSelected);
}

function HideAllDivs()
{
	$("#HomeDiv, #DifficultyDiv, #GameDiv, #GameOverDiv, #GameOverHiScoreDiv, #LeaderboardDiv, #CustomizeDiv").hide();
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
	//set active button
	$("#LeaderboardButtonsDiv .Active").removeClass("Active");
	$("#Leaderboard_" + GetKeyByValue(Difficulty, player.Diff) + "Button").addClass("Active");

	//generate table
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

function LoadCustomizations()
{
	$("#CustomizeCoins").text(player.GetCoins());

	//set unlocked colors
	var unlocksArray = player.GetUnlocks();

	for (var i = 0; i < unlocksArray.length; i++)
	{
		var colorObj = unlocksArray[i];
		var item = $("#" + colorObj.id);
		item.addClass("Unlocked");
		item.children(".Cost").text("Purchased");
	}

	//set selected color
	var color = player.GetSelectedColor();
	$(".CustomizeItem[data-color='" + color + "']").addClass("Selected");
}

function ColorSelected()
{
	var item = $(this);

	if (!item.hasClass("Selected"))//selected items require no action
	{
		var changeColor = false;

		if (item.hasClass("Unlocked"))
		{
			changeColor = true;
		}
		else
		{
			var cost = parseInt(item.data("cost"), 10);
			var coins = player.GetCoins();

			if (cost > coins)
				alert("Not enough coins, keep playing!");
			else
			{
				if (confirm("Buy this color?"))
				{
					//subtract coins
					coins -= cost;
					localStorage.setItem("coins", coins);
					$("#CustomizeCoins").text(coins);
					$("#Coins").text(coins);

					//unlock color
					item.addClass("Unlocked");
					item.children(".Cost").text("Purchased");
					player.AddUnlock(item.attr("id"), "color", item.data("color"));

					changeColor = true;
				}
			}
		}

		if (changeColor)
		{
			//set selected color
			$("#ItemsDiv .Selected").removeClass("Selected");
			item.addClass("Selected");
			localStorage.setItem("snakecolor", item.data("color"));
		}
	}
}

function GetKeyByValue(object, value)
{
	return Object.keys(object).find(key => object[key] == value);
}

class Position
{
	constructor(x, y)
	{
		this.X = x;
		this.Y = y;
	}
}
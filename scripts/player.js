class Player
{
	constructor()
	{
		this.TouchMinDistance = 30;
		this.GameOver = true;
		this.Diff = Difficulty.Hard;
		$("#Coins").text(this.GetCoins());
	}

	Initialize()
	{
		this.Input = null;
		this.Score = 0;
		this.Steps = 0;
		this.Time = 0;
		this.GameOver = false;
		$("#Score").text(this.Score);
		$("#HiScore").text(this.GetHiScore());
	}

	CheckInput()
	{
		switch (this.Input)
		{
			case Direction.Up:
				if (snake.Dir != Direction.Down)
					snake.Dir = Direction.Up;
				break;
			case Direction.Down:
				if (snake.Dir != Direction.Up)
					snake.Dir = Direction.Down;
				break;
			case Direction.Left:
				if (snake.Dir != Direction.Right)
					snake.Dir = Direction.Left;
				break;
			case Direction.Right:
				if (snake.Dir != Direction.Left)
					snake.Dir = Direction.Right;
				break;
		}

		this.Input = null;
	}

	GetSpeed()
	{
		var speed = 200;

		if (this.Diff > Difficulty.Easy)
		{
			if (this.Diff == Difficulty.Medium)
			{
				speed -= parseInt(this.Score / 6, 10);

				if (speed < 150)
					speed = 150;
			}
			else if (this.Diff == Difficulty.Hard)
			{
				speed -= parseInt(this.Score / 4, 10);

				if (speed < 100)
					speed = 100;
			}
		}

		return speed;
	}

	IncrementScore(num)
	{
		this.Score += num;
		$("#Score").text(this.Score);
	}

	GetTimeString()
	{
		var secs = parseInt(player.Time / 1000, 10);
		var mins = 0;
		var onlySecs = secs;

		if (secs >= 60)
		{
			mins = Math.floor(secs / 60);
			onlySecs = (secs - (mins * 60));
		}

		var secsString = onlySecs.toString();

		if (onlySecs < 10)
			secsString = "0" + secsString;

		return mins + ":" + secsString;
	}

	GetHiScore()
	{
		var hiScore = 0;
		var scoreArray = this.GetHiScores();

		if (scoreArray.length > 0)
			hiScore = scoreArray[0].score;

		return hiScore;
	}

	GetHiScores()
	{
		var scoreArray = [];
		var key = "scores" + this.Diff;

		if (localStorage.getItem(key) != null)
		{
			scoreArray = JSON.parse(localStorage.getItem(key));
			scoreArray.sort((a, b) => b.score - a.score);//sort desc
		}
		//THIS CAN BE DELETED SOMETIME IN THE FUTURE.
		else if (this.Diff == Difficulty.Hard && localStorage.getItem("scores") != null)
		{
			scoreArray = JSON.parse(localStorage.getItem("scores"));
			scoreArray.sort((a, b) => b.score - a.score);//sort desc
		}

		return scoreArray;
	}

	SaveScore()
	{
		var scoreObj = {};
		scoreObj.score = this.Score;
		scoreObj.steps = this.Steps;
		scoreObj.timeMS = this.Time;
		scoreObj.timeString = this.GetTimeString();
		scoreObj.date = new Date();

		var scoreArray = this.GetHiScores();

		//check if new hi-score
		if (scoreArray.length == 0 || (scoreArray.length > 0 && scoreObj.score > scoreArray[0].score))
		{
			$("#GameOverHiScoreDiv").show();
			$("#HiScore").text(scoreObj.score);
		}

		//limit amount of scores
		var scoreLimit = 15;

		if (scoreArray.length > (scoreLimit - 1))
		{
			if (scoreObj.score > scoreArray[scoreLimit - 1].score)
			{
				scoreArray.pop();
				scoreArray.push(scoreObj);
			}
		}
		else
			scoreArray.push(scoreObj);

		localStorage.setItem("scores" + this.Diff, JSON.stringify(scoreArray));

		try
		{
			//send GA event
			gtag('event', 'Game Played',
			{
				'event_category': 'User Stats',
				'event_label': 'User Score',
				'value': scoreObj.score
			});
		}
		catch (e)
		{ }
	}

	GetCoins()
	{
		var coins = 0;

		if (localStorage.getItem("coins") != null)
			coins = parseInt(localStorage.getItem("coins"), 10);
		else
			localStorage.setItem("coins", coins);

		return coins;
	}

	SaveCoins()
	{
		var bonus = Math.floor(this.Score / 100) * 10;
		var newCoins = (this.Score + bonus);
		$("#GameOverCoins").text(newCoins);

		var coins = this.GetCoins();
		coins += newCoins;
		$("#Coins").text(coins);

		localStorage.setItem("coins", coins);
	}

	GetStats()
	{
		var statsObj = {};

		if (localStorage.getItem("stats") != null)
			statsObj = JSON.parse(localStorage.getItem("stats"));
		else
		{
			statsObj.easyGames = 0;
			statsObj.mediumGames = 0;
			statsObj.hardGames = 0;
			statsObj.insaneGames = 0;
			statsObj.score = 0;
			statsObj.steps = 0;
			statsObj.timeMS = 0;

			localStorage.setItem("stats", JSON.stringify(statsObj));
		}

		return statsObj;
	}

	SaveStats()
	{
		var statsObj = this.GetStats();

		switch (this.Diff)
		{
			case Difficulty.Easy: statsObj.easyGames++; break;
			case Difficulty.Medium: statsObj.mediumGames++; break;
			case Difficulty.Hard: statsObj.hardGames++; break;
		}

		statsObj.score += this.Score;
		statsObj.steps += this.Steps;
		statsObj.timeMS += this.Time;

		localStorage.setItem("stats", JSON.stringify(statsObj));
	}

	GetUnlocks()
	{
		var unlocksArray = [];

		if (localStorage.getItem("unlocks") != null)
			unlocksArray = JSON.parse(localStorage.getItem("unlocks"));
		else
		{
			//unlock green initially
			var colorObj = {};
			colorObj.id = "ItemGreen";
			colorObj.type = "color";
			colorObj.value = "#00FF00";

			unlocksArray.push(colorObj);
			localStorage.setItem("unlocks", JSON.stringify(unlocksArray));
		}

		return unlocksArray;
	}

	AddUnlock(id, type, value)
	{
		var colorObj = {};
		colorObj.id = id;
		colorObj.type = type;
		colorObj.value = value;

		var unlocksArray = this.GetUnlocks();
		unlocksArray.push(colorObj);
		localStorage.setItem("unlocks", JSON.stringify(unlocksArray));
	}

	GetSelectedColor()
	{
		var color = "#00FF00";//green

		if (localStorage.getItem("snakecolor") != null)
			color = localStorage.getItem("snakecolor");
		else
			localStorage.setItem("snakecolor", color);

		return color;
	}
}
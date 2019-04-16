class Player
{
	constructor()
	{
		this.TouchMinDistance = 30;
		this.GameOver = true;
		$("#HiScore").text(this.GetHiScore());
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

		speed -= parseInt(this.Score / 4, 10);

		if (speed < 100)
			speed = 100;

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

		if (localStorage.getItem("scores") != null)
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

		localStorage.setItem("scores", JSON.stringify(scoreArray));
		
		try
		{
			//send GA event
			gtag('event', scoreObj.score.toString(),
			{
				'event_category': 'User Stats',
				'event_label': 'User Score'
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

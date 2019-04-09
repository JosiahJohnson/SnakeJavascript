class Player
{
	constructor()
	{
		this.TouchMinDistance = 30;
		this.Initialize();
	}

	Initialize()
	{
		this.Input = null;
		this.Score = 0;
		this.Steps = 0;
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

		speed -= (this.Score / 2);

		if (speed < 75)
			speed = 75;

		return speed;
	}

	IncrementScore(num)
	{
		this.Score += num;
		$("#Score").text(this.Score);
	}
}
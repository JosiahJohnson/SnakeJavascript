class Apple
{
	constructor(snake)
	{
		this.Color = "#FF0000";
		this.RandomizePosition(snake);
	}

	RandomizePosition(snake)
	{
		var pos = new Position(0, 0);

		do
		{
			pos.X = this.GetRandomNumber(0, boardPixels - 1);
			pos.Y = this.GetRandomNumber(0, boardPixels - 1);
		} while (this.IsOnSnakePosition(pos, snake));

		this.Pos = pos;
	}

	GetRandomNumber(min, max)
	{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	IsOnSnakePosition(pos, snake)
	{
		var overlap = false;

		for (var i = 0; i < snake.Positions.length; i++)
		{
			var sPos = snake.Positions[i];

			if (pos.X == sPos.X && pos.Y == sPos.Y)
			{
				overlap = true;
				break;
			}
		}

		return overlap;
	}
}
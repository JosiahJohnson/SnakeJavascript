class Apple
{
	constructor()
	{
		this.Color = "#FF0000";
		this.RandomizePosition();
	}

	RandomizePosition()
	{
		var pos = new Position(0, 0);

		do
		{
			pos.X = this.GetRandomNumber(0, board.SizeInPixels - 1);
			pos.Y = this.GetRandomNumber(0, board.SizeInPixels - 1);
		} while (this.IsOnSnakePosition(pos));

		this.Pos = pos;
	}

	GetRandomNumber(min, max)
	{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	IsOnSnakePosition(pos)
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
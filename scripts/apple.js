class Apple
{
	RandomizePosition()
	{
		var pos = new Position(0, 0);

		do
		{
			pos.X = this.GetRandomNumber(0, board.GridSquares - 1);
			pos.Y = this.GetRandomNumber(0, board.GridSquares - 1);
		} while (this.IsOnSnakePosition(pos));

		this.Pos = pos;
		board.DrawApple(this.Pos);
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

	GetAppleCoord()
	{
		var skin1 = new Rect(0, 2, 1, 3, "#FF0000");
		var skin2 = new Rect(1, 1, 4, 5, "#FF0000");
		var skin3 = new Rect(5, 2, 1, 3, "#FF0000");
		var leaf = new Rect(1, 0, 2, 1, "#00FF00");
		var stem = new Rect(3, 0, 1, 2, "#7F3300");
		var shine = new Rect(4, 2, 1, 2, "#FFFFFF");

		return [skin1, skin2, skin3, leaf, stem, shine];
	}
}
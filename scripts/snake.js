class Snake
{
	Initialize()
	{
		this.Dir = Direction.Right;
		this.Positions = [];
		this.Positions.push(new Position(2, 0));
		this.Positions.push(new Position(1, 0));
		this.Positions.push(new Position(0, 0));
		this.Head = this.Positions[0];
		this.Tail = this.Positions[this.Positions.length - 1];
		this.Color = player.GetSelectedColor();
	}

	ChangePosition()
	{
		var lastPos = new Position(this.Tail.X, this.Tail.Y);

		//set tail positions
		for (var i = (this.Positions.length - 1); i > 0; i--)
		{
			this.Positions[i].X = this.Positions[i - 1].X;
			this.Positions[i].Y = this.Positions[i - 1].Y;
		}

		//set head position
		switch (this.Dir)
		{
			case Direction.Up:
				this.Head.Y--;
				break;
			case Direction.Down:
				this.Head.Y++;
				break;
			case Direction.Left:
				this.Head.X--;
				break;
			case Direction.Right:
				this.Head.X++;
				break;
		}

		//check if ate apple
		if (this.Head.X == apple.Pos.X && this.Head.Y == apple.Pos.Y)
		{
			this.Positions.push(lastPos);
			apple.RandomizePosition();
			player.IncrementScore(10);
		}

		//check for collisions
		if (this.Head.X < 0 || this.Head.X > (board.GridSize - 1) || this.Head.Y < 0 ||
			this.Head.Y > (board.GridSize - 1) || this.AteSelf())
		{
			player.GameOver = true;
		}
	}

	AteSelf()
	{
		var ateSelf = false;

		for (var i = 1; i < this.Positions.length; i++)
		{
			if (this.Head.X == this.Positions[i].X && this.Head.Y == this.Positions[i].Y)
			{
				ateSelf = true;
				break;
			}
		}

		return ateSelf;
	}
}
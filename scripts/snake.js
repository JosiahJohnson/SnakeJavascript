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
		this.Color = player.GetSelectedColor();
	}

	ChangePosition()
	{
		var tailNum = this.Positions.length - 1;
		var lastPos = new Position(this.Positions[tailNum].X, this.Positions[tailNum].Y);

		//set tail positions
		for (var i = tailNum; i > 0; i--)
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
		if (this.Head.X < 0 || this.Head.X > (board.GridSquares - 1) || this.Head.Y < 0 ||
			this.Head.Y > (board.GridSquares - 1) || this.AteSelf())
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

	GetHeadCoord()
	{
		//initialize facing right direction
		var head1 = new Rect(0, 0, 4, 6, this.Color);
		var head2 = new Rect(4, 1, 2, 4, this.Color);
		var eyes = new Rect(0, 1, 2, 4, "#FFFFFF");
		var pupil1 = new Rect(1, 2, 1, 1, "#000000");
		var pupil2 = new Rect(1, 4, 1, 1, "#000000");
		var parts = [head1, head2, eyes, pupil1, pupil2];

		for (var i = 0; i < parts.length; i++)
		{
			switch (this.Dir)
			{
				case Direction.Left: this.FlipHorz(parts[i]); break;
				case Direction.Down: this.RotateClockwise(parts[i]); break;
				case Direction.Up: this.RotateCounterClockwise(parts[i]); break;
			}
		}

		return parts;
	}

	GetTailCoord()
	{
		//initialize going right
		var tail1 = new Rect(0, 2, 3, 2, this.Color);
		var tail2 = new Rect(3, 1, 3, 4, this.Color);
		var parts = [tail1, tail2];
		var tailDir = Direction.Right;

		//check position of tail relative to second to last position
		var tailNum = this.Positions.length - 1;
		var tailPos = this.Positions[tailNum];
		var secPos = this.Positions[tailNum - 1];

		if (tailPos.X == secPos.X)
		{
			if (tailPos.Y > secPos.Y)
				tailDir = Direction.Up;
			else
				tailDir = Direction.Down;
		}
		else if (tailPos.X > secPos.X)
			tailDir = Direction.Left;

		for (var i = 0; i < parts.length; i++)
		{
			switch (tailDir)
			{
				case Direction.Left: this.FlipHorz(parts[i]); break;
				case Direction.Down: this.RotateClockwise(parts[i]); break;
				case Direction.Up: this.RotateCounterClockwise(parts[i]); break;
			}
		}

		return parts;
	}

	FlipHorz(rect)
	{
		rect.X = board.PixelsPerSquare - (rect.X + rect.Width);
	}

	RotateClockwise(rect)
	{
		var temp = new Rect(rect.X, rect.Y, rect.Width, rect.Height, rect.Color);
		rect.X = temp.Y;
		rect.Y = temp.X;
		rect.Width = temp.Height;
		rect.Height = temp.Width;
	}

	RotateCounterClockwise(rect)
	{
		var temp = new Rect(rect.X, rect.Y, rect.Width, rect.Height, rect.Color);
		rect.X = temp.Y;
		rect.Y = board.PixelsPerSquare - (temp.X + temp.Width);
		rect.Width = temp.Height;
		rect.Height = temp.Width;
	}
}
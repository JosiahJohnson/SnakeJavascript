class Snake
{
	Initialize()
	{
		this.Dir = Direction.Right;
		this.PrevDir = Direction.Right;
		this.PrevTailDir = Direction.Right;
		this.Positions = [
			new Position(2, 0),
			new Position(1, 0),
			new Position(0, 0)
		];
		this.Head = this.Positions[0];
		this.Color = player.GetSelectedColor();
		var eyeColor = "#FFFFFF";

		if (this.Color == "#FFFFFF")
			eyeColor = "#ADFFFF";

		this.HeadSprite = new Sprite();
		this.HeadSprite.Add(new Rect(0, 0, 4, 6, this.Color));
		this.HeadSprite.Add(new Rect(4, 1, 2, 4, this.Color));
		this.HeadSprite.Add(new Rect(0, 1, 2, 4, eyeColor));
		this.HeadSprite.Add(new Rect(1, 2, 1, 1, "#000000"));
		this.HeadSprite.Add(new Rect(1, 4, 1, 1, "#000000"));

		this.TailSprite = new Sprite();
		this.TailSprite.Add(new Rect(0, 2, 2, 2, this.Color));
		this.TailSprite.Add(new Rect(2, 1, 2, 4, this.Color));
		this.TailSprite.Add(new Rect(4, 0, 2, 6, this.Color));
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

		this.CheckHeadSpriteChanged();
		this.CheckTailSpriteChanged();
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

	CheckHeadSpriteChanged()
	{
		if (this.Dir != this.PrevDir)
		{
			if (this.ShouldRotateClockwise(this.PrevDir, this.Dir))
				this.HeadSprite.RotateClockwise();
			else
				this.HeadSprite.RotateCounterClockwise();
			
			this.PrevDir = this.Dir;
		}
	}

	CheckTailSpriteChanged()
	{
		//check position of tail relative to second to last position
		var tailNum = this.Positions.length - 1;
		var tailPos = this.Positions[tailNum];
		var secPos = this.Positions[tailNum - 1];
		var tailDir = Direction.Right;

		if (tailPos.X == secPos.X)
		{
			if (tailPos.Y > secPos.Y)
				tailDir = Direction.Up;
			else
				tailDir = Direction.Down;
		}
		else if (tailPos.X > secPos.X)
			tailDir = Direction.Left;

		if (tailDir != this.PrevTailDir)
		{
			if (this.ShouldRotateClockwise(this.PrevTailDir, tailDir))
				this.TailSprite.RotateClockwise();
			else
				this.TailSprite.RotateCounterClockwise();

			this.PrevTailDir = tailDir;
		}
	}

	ShouldRotateClockwise(prevDir, newDir)
	{
		return ((prevDir == Direction.Up && newDir == Direction.Right) ||
				(prevDir == Direction.Right && newDir == Direction.Down) ||
				(prevDir == Direction.Down && newDir == Direction.Left) ||
				(prevDir == Direction.Left && newDir == Direction.Up));
	}
}
class Snake
{
	constructor()
	{
		this.Initialize();
	}

	Initialize()
	{
		this.Dir = Direction.Right;
		this.Positions = [];
		this.Positions.push(new Position(2, 0));
		this.Positions.push(new Position(1, 0));
		this.Positions.push(new Position(0, 0));
	}
}
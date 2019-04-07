class Snake
{
	constructor()
	{
		this.Color = "#00FF00";
		this.Initialize();
	}

	Initialize()
	{
		this.Dir = Direction.Right;
		this.Positions = [];
		this.Positions.push(new Position(2, 0));
		this.Positions.push(new Position(1, 0));
		this.Positions.push(new Position(0, 0));
		this.Head = this.Positions[0];
	}
}
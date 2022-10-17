type Cell = string | null;
type Grid = Cell[][];

class Game
{
    private gameGrid: Grid;

    public constructor(grid: Grid)
    {
        this.gameGrid = grid;
    }

    public checkWinner(): string | false
    {
        if (!this.isValid())
            return false;

        const diagonalWin = this.checkDiagonalWin();
        const horizontalWin = this.checkHorizontalWin();
        const verticalWin = this.checkVerticalWin();

        return diagonalWin ??
            horizontalWin ??
            verticalWin ??
            false;
    }

    public grid(): Grid
    {
        return JSON.parse(JSON.stringify(this.gameGrid));
    }

    public isValid(): boolean
    {
        if (Math.abs(this.gridDifference()) > 1)
            return false;

        return !(
            this.hasMultipleHorizontalWins() ||
            this.hasMultipleVerticalWins()
        );
    }

    public nextMove(): Grid
    {
        if (this.gameGrid.every(row => row.every(cell => !cell)))
        {
            this.gameGrid[0][0] = 'O';
            return this.gameGrid;
        }

        const winningMove = this.winningMove('O');
        const blockingMove = this.winningMove('X');
        if (winningMove || blockingMove)
        {
            this.gameGrid = winningMove ?? blockingMove as Grid;
            return this.gameGrid;
        }

        if (!this.gameGrid[1][1])
        {
            this.gameGrid[1][1] = 'O';
            return this.gameGrid;
        }

        let firstFreeCorner: number[] | undefined;

        for (const coordinates of [[0, 0], [0, 2], [2, 0], [2, 2]])
        {
            const oppositeCorner = this.oppositeCorner(coordinates);

            if (
                this.gameGrid[coordinates[0]][coordinates[1]] === 'O' &&
                !this.gameGrid[oppositeCorner[0]][oppositeCorner[1]]
            )
            {
                this.gameGrid[oppositeCorner[0]][oppositeCorner[1]] = 'O';
                return this.gameGrid;
            }

            if (!firstFreeCorner && !this.gameGrid[coordinates[0]][coordinates[1]])
                firstFreeCorner = coordinates;
        }

        if (firstFreeCorner)
        {
            this.gameGrid[firstFreeCorner[0]][firstFreeCorner[1]] = 'O';
            return this.gameGrid;
        }

        for (const coordinates of [[0, 1], [1, 0], [1, 2], [2, 1]])
        {
            if (!this.gameGrid[coordinates[0]][coordinates[1]])
            {
                this.gameGrid[coordinates[0]][coordinates[1]] = 'O';
                return this.gameGrid;
            }
        }

        return this.gameGrid;
    }

    private cellEquals(row: number, column: number, value: Cell): boolean
    {
        return this.gameGrid[row][column] === value;
    }

    private checkDiagonalWin(): string | null
    {
        const centre = this.gameGrid[1][1];
        const useCentreValue = !centre ||
            (this.cellEquals(0, 0, centre) && this.cellEquals(2, 2, centre)) ||
            (this.cellEquals(0, 2, centre) && this.cellEquals(2, 0, centre));

        return useCentreValue ?
            centre :
            null;
    }

    private checkHorizontalWin(): string | null
    {
        for (const row of this.gameGrid)
        {
            const firstCell = row[0];

            if (firstCell && row.every(cell => cell === firstCell))
                return firstCell;
        }

        return null;
    }

    private checkVerticalWin(): string | null
    {
        for (const column of [0, 1, 2])
        {
            const firstCell = this.gameGrid[0][column];

            if (firstCell && this.gameGrid.every(row => row[column] === firstCell))
                return firstCell;
        }

        return null;
    }

    private hasMultipleHorizontalWins(): boolean
    {
        const winningArrangements = this.gameGrid.reduce(
            (accumulator, row) =>
                (row.every(cell => cell === 'X') || row.every(cell => cell === 'O')) ?
                    accumulator + 1 :
                    accumulator,
            0
        );

        return winningArrangements > 1;
    }

    private hasMultipleVerticalWins(): boolean
    {
        const winningArrangements = [0, 1, 2].reduce(
            (accumulator, column) =>
                (this.gameGrid.every(row => row[column] === 'X') || this.gameGrid.every(row => row[column] === 'O')) ?
                    accumulator + 1 :
                    accumulator,
            0
        );

        return winningArrangements > 1;
    }

    private gridDifference(): number
    {
        return this.gameGrid.reduce((gridDifference, row) => {
            return gridDifference + row.reduce((rowDifference, cell) => {
                if (!cell)
                    return rowDifference;

                return rowDifference + (cell === 'X' ? 1 : -1);
            }, 0);
        }, 0);
    }

    private oppositeCorner(coordinates: number[]): number[]
    {
        return [2 - coordinates[0], 2 - coordinates[1]];
    }

    private winningCell(cells: Cell[], player: string): number | null
    {
        if (cells.some(cell => cell !== null && cell !== player) || cells.filter(cell => cell === null).length > 1)
            return null;

        for (const index of [0, 1, 2])
        {
            if (cells[index] === null)
                return index;
        }

        return null;
    }

    private winningMove(player: string): Grid | null
    {
        let winningMove : number | null;
        const grid = this.grid();

        for (const index of [0, 1, 2])
        {
            const row = grid[index];
            const column = grid.map(row => row[index]);

            if ((winningMove = this.winningCell(row, player)) !== null)
            {
                grid[index][winningMove] = 'O';
                return grid;
            }

            if ((winningMove = this.winningCell(column, player)) !== null)
            {
                grid[winningMove][index] = 'O';
                return grid;
            }
        }

        const diagonalDown = [0, 1, 2].map(index => grid[index][index]);
        if ((winningMove = this.winningCell(diagonalDown, player)) !== null)
        {
            grid[winningMove][winningMove] = 'O';
            return grid;
        }

        const diagonalUp = [0, 1, 2].map(index => grid[index][2 - index]);
        if ((winningMove = this.winningCell(diagonalUp, player)) !== null)
        {
            grid[winningMove][2- winningMove] = 'O';
            return grid;
        }

        return null;
    }
}

export { Game };

import readline from 'readline';
import { Game } from './game';

const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function start(io: readline.Interface)
{
    let game = new Game([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]);

    const renderedGrid = renderGrid(
        game.grid().map((row, y) => renderRow(
            row.map((cell, x) => renderCell(x, y, cell))
        ))
    );

    console.log(renderedGrid);

    while (!game.checkWinner())
    {
        let choice = indexToCoordinates(
            await readChoice(io)
        );

        while (game.grid()[choice[0]][choice[1]])
        {
            process.stdout.moveCursor(0, -1);
            process.stdout.clearLine(0);

            choice = indexToCoordinates(
                await readChoice(io, 'That space is already taken. Try another: ')
            );
        }

        const grid = game.grid();
        grid[choice[0]][choice[1]] = 'X';

        game = new Game(grid);

        const gridToRender = game.checkWinner() ?
            game.grid() :
            game.nextMove();

        process.stdout.moveCursor(0, -8);
        process.stdout.clearScreenDown();

        const renderedGrid = renderGrid(
            gridToRender.map((row, y) => renderRow(
                row.map((cell, x) => renderCell(x, y, cell))
            ))
        );

        console.log(renderedGrid);
    }

    console.log(`${game.checkWinner()} wins!`);
    io.close();
}

function indexToCoordinates(index: number): number[]
{
    const row = Math.ceil(index / 3) - 1;
    const column = index - 3 * row - 1;

    return [ row, column ];
}

async function readChoice(io: readline.Interface, message?: string): Promise<number>
{
    let choice = await prompt(io, message ?? 'Make your move: ');

    while (true)
    {
        if (/^[1-9]$/.test(choice))
            return Number(choice);

        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(0);

        choice = await prompt(io, 'Please enter a number between 1 and 9: ');
    }
}

async function prompt(io: readline.Interface, query: string): Promise<string>
{
    return new Promise(function(resolve) {
        io.question(query, resolve);
    });
}

function renderCell(x: number, y: number, value: string | null): string
{
    const colour = value ?
        '\x1b[1m' :  // Bright
        '\x1b[2m';   // Dim
    const output = value ?? (x + 1 + (y * 3));

    return `${colour}${output}\x1b[0m`;
}

function renderGrid(rows: string[]): string
{
    return '┏━━━┯━━━┯━━━┓\n'
        + rows.join('\n┠───┼───┼───┨\n')
        + '\n┗━━━┷━━━┷━━━┛';
}

function renderRow(values: string[]): string
{
    return `┃ ${values.join(' │ ')} ┃`;
}

start(io)
    .catch(error => console.error(error));

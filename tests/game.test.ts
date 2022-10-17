import { Game } from '../src/game';

describe('Validate grid', () => {
    it('Should be valid if number of moves is equal', () => {
        const grids = [
            [[null, null, null], [null, null, null], [null, null, null]],
            [['X', null, null], ['O', null, null], [null, null, null]],
            [['X', 'X', 'O'], ['O', null, null], [null, null, null]],
            [['X', 'X', 'O'], ['O', 'X', null], ['O', null, null]],
            [['X', 'X', 'O'], ['O', 'X', 'X'], ['O', 'O', null]]
        ];

        for (const grid of grids)
        {
            const game = new Game(grid);
            expect(game.isValid()).toBe(true);
        }
    });

    it.each([
        {
            more: 'X',
            less: 'O'
        },
        {
            more: 'O',
            less: 'X'
        }
    ])('Should be valid if there is one more $more move than $less moves', ({ more, less }) => {
        const grids = [
            [[more, null, null], [null, null, null], [null, null, null]],
            [[more, more, less], [null, null, null], [null, null, null]]
        ];

        for (const grid of grids)
        {
            const game = new Game(grid);
            expect(game.isValid()).toBe(true);
        }
    });

    it.each([
        {
            more: 'X',
            less: 'O'
        },
        {
            more: 'O',
            less: 'X'
        }
    ])('Should be invalid if there are more that one additional $more', ({ more, less}) => {
        const grids = [
            [[more, more, null], [null, null, null], [null, null, null]],
            [[more, more, less], [more, null, null], [null, null, null]]
        ];

        for (const grid of grids)
        {
            const game = new Game(grid);
            expect(game.isValid()).toBe(false);
        }
    });
    
    it.each([
        {
            direction: 'horizontally',
            grids: [
                [['X', 'X', 'X'], ['O', 'O', 'O'], [null, null, null]],
                [['O', 'O', 'O'], [null, null, null], ['X', 'X', 'X']]
            ]
        },
        {
            direction: 'vertically',
            grids: [
                [['X', null, 'O'], ['X', null, 'O'], ['X', null, 'O']],
                [[null, 'O', 'X'], [null, 'O', 'X'], [null, 'O', 'X']]
            ]
        }
    ])('Should be invalid if there are two winning arrangements $direction', ({ grids }) => {
        for (const grid of grids)
        {
            const game = new Game(grid);
            expect(game.isValid()).toBe(false);
        }
    });
});

describe('Check winner', () => {
    it('Should detect no winner if there are not three identical values in a line', () => {
        const grids = [
            [[null, null, null], [null, null, null], [null, null, null]],
            [['X', 'X', 'O'], ['O', null, null], [null, null, null]],
            [['X', 'X', null], ['O', 'O', 'X'], [null, null, 'X']]
        ];

        for (const grid of grids)
        {
            const game = new Game(grid);
            expect(game.checkWinner()).toBe(false);
        }
    });

    it('Should detect no winner if grid is invalid', () => {
        const grids = [
            [['X', 'X', 'X'], ['O', 'O', 'O'], [null, null, null]],
            [['X', null, 'O'], ['X', null, 'O'], ['X', null, 'O']]
        ];

        for (const grid of grids)
        {
            const game = new Game(grid);
            expect(game.checkWinner()).toBe(false);
        }
    });

    it.each([
        {
            grid: [['X', 'X', 'X'], ['O', 'O', null], [null, null, null]],
            row: 'top',
            winner: 'X'
        },
        {
            grid: [['X', 'X', null], ['O', 'O', 'O'], [null, null, null]],
            row: 'middle',
            winner: 'O'
        },
        {
            grid: [['O', null, null], [null, null, 'O'], ['X', 'X', 'X']],
            row: 'bottom',
            winner: 'X'
        }
    ])('Should detect a win if there are three identical values on $row row', ({ grid, winner }) => {
        const game = new Game(grid);
        expect(game.checkWinner()).toBe(winner);
    });

    it.each([
        {
            column: 'left',
            grid: [['X', 'O', null], ['X', 'O', null], ['X', null, null]],
            winner: 'X'
        },
        {
            column: 'middle',
            grid: [['X', 'O', null], ['X', 'O', null], [null, 'O', null]],
            winner: 'O'
        },
        {
            column: 'right',
            grid: [['O', null, 'X'], [null, null, 'X'], [null, 'O', 'X']],
            winner: 'X'
        }
    ])('Should detect a win if there are three identical values on $column column', ({ grid, winner }) => {
        const game = new Game(grid);
        expect(game.checkWinner()).toBe(winner);
    });

    it.each([
        {
            direction: 'down',
            grid: [['X', 'O', null], ['O', 'X', null], [null, null, 'X']],
            winner: 'X'
        },
        {
            direction: 'up',
            grid: [['X', null, 'O'], ['X', 'O', null], ['O', null, null]],
            winner: 'O'
        }
    ])('Should detect a win if there are three identical values diagonally $direction', ({ grid, winner }) => {
        const game = new Game(grid);
        expect(game.checkWinner()).toBe(winner);
    });
});

describe('Make next move', () => {
    it('Should pick top-left cell if grid is empty', () => {
        const game = new Game([[null, null, null], [null, null, null], [null, null, null]]);
        expect(game.nextMove()).toStrictEqual([['O', null, null], [null, null, null], [null, null, null]]);
    });

    it.each([
        {
            after: [['X', null, 'X'], ['O', 'O', 'O'], [null, null, null]],
            before: [['X', null, 'X'], ['O', 'O', null], [null, null, null]],
            direction: 'horizontally'
        },
        {
            after: [['X', 'O', null], [null, 'O', null], ['X', 'O', null]],
            before: [['X', 'O', null], [null, null, null], ['X', 'O', null]],
            direction: 'vertically'
        },
        {
            after: [[null, 'X', 'O'], [null, 'O', null], ['O', null, 'X']],
            before: [[null, 'X', null], [null, 'O', null], ['O', null, 'X']],
            direction: 'diagonally'
        }
    ])('Should make a winning move if one is available $direction', ({ after, before }) => {
        const game = new Game(before);
        expect(game.nextMove()).toStrictEqual(after);
    });

    it.each([
        {
            after: [['O', null, null], ['X', 'X', 'O'], [null, 'O', null]],
            before: [['O', null, null], ['X', 'X', null], [null, 'O', null]],
            direction: 'horizontally'
        },
        {
            after: [['X', 'O', null], ['O', null, null], ['X', null, 'O']],
            before: [['X', 'O', null], [null, null, null], ['X', null, 'O']],
            direction: 'vertically'
        },
        {
            after: [[null, 'O', 'O'], [null, 'X', null], ['X', null, 'O']],
            before: [[null, 'O', null], [null, 'X', null], ['X', null, 'O']],
            direction: 'diagonally'
        }
    ])('Should block a move $direction if the player can win in their next round', ({ after, before }) => {
        const game = new Game(before);
        expect(game.nextMove()).toStrictEqual(after);
    });

    it.each([
        {
            after: [['O', null, null], [null, 'X', null], [null, null, 'O']],
            before: [['O', null, null], [null, 'X', null], [null, null, null]],
            startPosition: 'top left'
        },
        {
            after: [[null, null, 'O'], [null, 'X', null], ['O', null, null]],
            before: [[null, null, 'O'], [null, 'X', null], [null, null, null]],
            startPosition: 'top right'
        },
        {
            after: [[null, null, 'O'], [null, 'X', null], ['O', null, null]],
            before: [[null, null, null], [null, 'X', null], ['O', null, null]],
            startPosition: 'bottom left'
        },
        {
            after: [['O', null, null], [null, 'X', null], [null, null, 'O']],
            before: [[null, null, null], [null, 'X', null], [null, null, 'O']],
            startPosition: 'bottom right'
        }
    ])('Should pick the opposite corner if it is free and $startPosition is O', ({ after, before }) => {
        const game = new Game(before);
        expect(game.nextMove()).toStrictEqual(after);
    });

    it('Should pick the first available corner if any are free', () => {
        const grids = [
            {
                after: [['O', null, 'X'], [null, 'O', null], ['X', null, null]],
                before: [[null, null, 'X'], [null, 'O', null], ['X', null, null]]
            },
            {
                after: [['X', null, 'O'], [null, 'O', null], [null, null, 'X']],
                before: [['X', null, null], [null, 'O', null], [null, null, 'X']]
            },
            {
                after: [['X', 'O', 'X'], [null, 'O', null], ['O', 'X', null]],
                before: [['X', 'O', 'X'], [null, 'O', null], [null, 'X', null]]
            },
            {
                after: [['X', 'O', 'X'], [null, 'O', null], ['O', 'X', 'O']],
                before: [['X', 'O', 'X'], [null, 'O', null], ['O', 'X', null]]
            }
        ]

        for (const grid of grids)
        {
            const game = new Game(grid.before);
            expect(game.nextMove()).toStrictEqual(grid.after);
        }
    });

    it('Should pick the first available edge if any are free', () => {
        const grids = [
            {
                after: [['O', 'O', 'X'], ['X', 'X', 'O'], ['O', 'O', 'X']],
                before: [['O', null, 'X'], ['X', 'X', 'O'], ['O', 'O', 'X']]
            },
            {
                after: [['X', 'O', 'X'], ['O', 'X', 'O'], ['O', 'X', 'O']],
                before: [['X', 'O', 'X'], [null, 'X', 'O'], ['O', 'X', 'O']]
            },
            {
                after: [['O', 'X', 'O'], ['O', 'X', 'O'], ['X', 'O', 'X']],
                before: [['O', 'X', 'O'], ['O', 'X', null], ['X', 'O', 'X']]
            },
            {
                after: [['X', 'O', 'O'], ['O', 'X', 'X'], ['X', 'O', 'O']],
                before: [['X', 'O', 'O'], ['O', 'X', 'X'], ['X', null, 'O']]
            }
        ]

        for (const grid of grids)
        {
            const game = new Game(grid.before);
            expect(game.nextMove()).toStrictEqual(grid.after);
        }
    });
});

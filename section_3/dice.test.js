const rollDice = require("./dice");

describe("#rollDice", function () {
    test("it rolls the correct amount of dice", function () {
        Math.random = jest.fn(() => 0.5)

        expect(rollDice(6)).toEqual(3);
        expect(rollDice(2)).toEqual(1);
        console.log(Math.random.mock.calls)
        expect(Math.random).toHaveBeenCalled();


    })
})
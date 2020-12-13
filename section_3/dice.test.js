const rollDice = require("./dice");

describe("#rollDice", function () {
    test("it rolls the correct amount of dice", function () {
        expect(rollDice(6)).toEqual(4);
        expect(rollDice(2)).toEqual(3);
    })
})
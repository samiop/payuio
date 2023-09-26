"use strict";

const util = require('../lib/util');
const gameLogic = require('../game-logic');

exports.MassFood = class {
    constructor(playerFiring, cellIndex, mass) {
        this.id = playerFiring.id;
        this.num = cellIndex;
        this.mass = mass;
        this.hue = playerFiring.hue;
        this.target = {
            x: playerFiring.x - playerFiring.cells[cellIndex].x + playerFiring.target.x,
            y: playerFiring.y - playerFiring.cells[cellIndex].y + playerFiring.target.y
        };
        this.x = playerFiring.cells[cellIndex].x;
        this.y = playerFiring.cells[cellIndex].y;
        this.radius = util.massToRadius(mass);
        this.speed = 25;
    }

    move(gameWidth, gameHeight) {
        var deg = Math.atan2(this.target.y, this.target.x);
        var deltaY = this.speed * Math.sin(deg);
        var deltaX = this.speed * Math.cos(deg);
    
        this.speed -= 0.5;
        if (this.speed < 0) {
            this.speed = 0;
        }
        if (!isNaN(deltaY)) {
            this.y += deltaY;
        }
        if (!isNaN(deltaX)) {
            this.x += deltaX;
        }
        
        gameLogic.adjustForBoundaries(this, this.radius, 5, gameWidth, gameHeight);
    }
}

exports.MassFoodManager = class {
    constructor() {
        this.data = [];
    }

    addNew(playerFiring, cellIndex, mass)  {
        this.data.push(new exports.MassFood(playerFiring, cellIndex, mass));
    }

    move (gameWidth, gameHeight) {
        for (let currentFood of this.data) {
            if (currentFood.speed > 0) currentFood.move(gameWidth, gameHeight);
        }
    }

    remove(indexes) {
        if (indexes.length > 0) {
            this.data = util.removeIndexes(this.data, indexes);
        }
    }
}
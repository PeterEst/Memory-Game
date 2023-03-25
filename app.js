/**
 * @file app.js
 * @description This file contains the main logic for the game.
 * @author Peter Estephan
 * @version 1.0
 */
import Game from "./Game.js";

$(document).ready(function () {
  try {
    // Create an array of cards
    const cards = [
      {
        name: "Ace",
        value: 1,
      },
      {
        name: "Two",
        value: 2,
      },
      {
        name: "Three",
        value: 3,
      },
      {
        name: "Four",
        value: 4,
      },
      {
        name: "Five",
        value: 5,
      },
      {
        name: "Six",
        value: 6,
      },
    ];

    // Get Start button.
    const startButton = $("#startBtn");

    // Create a new game object.
    var game = new Game(cards);

    // Start the game.
    startButton.on("click", () => {
      let userName = $("#userName").val();

      if (!userName) {
        const randomNumbers = Math.floor(10000 + Math.random() * 90000);
        userName = "Player" + randomNumbers;
      }

      game.start(userName);
    });
  } catch (error) {
    console.log(error);
  }
});

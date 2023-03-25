/**
 * @file Game.js
 * @description This file contains the logic for the game.
 * @author Peter Estephan
 * @class Game
 * @version 1.0
 */
class Game {
  /**
   * @constructor
   * @description Creates a new game object.
   *
   * @param {Array} cards The array of cards.
   */
  constructor(cards) {
    if (!cards) {
      throw new Error("No cards were provided.");
    }

    this.cards = cards;
  }

  /**
   * @method shuffle
   * @description Shuffles the cards.
   *
   * @param {Array} cards The array of cards.
   * @returns {Array} The shuffled array of cards.
   */
  shuffle(cards) {
    if (!cards) {
      throw new Error("No cards were provided to shuffle.");
    }

    // shuffle the cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      // using destructuring to swap the cards (swap algorithm)
      [cards[i], cards[j]] = [cards[j], cards[i]];

      return cards;
    }
  }

  /**
   * @method revealCards
   * @description Reveals the cards.
   *
   * @param {number} revealTime The time to reveal the cards, in seconds.
   * @returns {Promise} A promise that resolves when the cards are hidden.
   */
  revealCards(revealTime = 3) {
    return new Promise((resolve) => {
      // get all the cards
      const cards = $(".card");

      // reveal the cards
      cards.each((index, card) => {
        $(card).addClass("revealed");

        // hide the cards after the specified time
        setTimeout(() => {
          $(card).removeClass("revealed");

          // check if it is the last card
          if (index === cards.length - 1) {
            resolve();
          }
        }, revealTime * 1000);
      });
    });
  }

  /**
   * @method congratulatePlayer
   * @description Congratulates the player.
   *
   * @param {string} userName The name of the player.
   */
  congratulatePlayer(userName) {
    const modalContentH1 = $("#congratsModal .modal-content h1");
    modalContentH1.text(`Congratulations, ${userName} !`);

    const modalContentP = $("#congratsModal .modal-content p");
    modalContentP.text(`You won in ${$(".timer").text()}`);

    $("#congratsModal").show();
    $("#congratsModal").css("display", "flex");

    // hide the game board
    $("#gameBoard").hide();
  }

  /**
   * @method startTimer
   * @description Starts the timer.
   *
   * @returns {number} The timer interval.
   */
  startTimer() {
    const timer = $(".timer");
    let seconds = 0;
    let minutes = 0;

    // update the timer every second
    return setInterval(() => {
      seconds++;

      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }

      timer.text(`${minutes} minutes and ${seconds} seconds`);
    }, 1000);
  }

  /**
   * @method start
   * @description Starts the game.
   *
   * @param {string} userName The name of the player.
   */
  async start(userName) {
    if (!userName) {
      throw new Error("No user name was provided.");
    }

    // duplicate the cards and shuffle them
    const cards = this.cards.concat(this.cards);
    this.shuffle(cards);

    // create the cards Board
    const cardsBoard = $("#cardsBoard");
    cardsBoard.empty();

    // create the cards
    cards.forEach((card) => {
      // create the card div
      const cardDiv = $("<div>");
      cardDiv.attr("data-value", card.value);
      cardDiv.addClass("card");

      // create card inner
      const cardInnerDiv = $("<div>");
      cardInnerDiv.addClass("card-inner");

      // create the card back div
      const cardBackDiv = $("<div>");
      cardBackDiv.addClass("card-back");
      cardBackDiv.append(`<p>?</p>`);
      cardInnerDiv.append(cardBackDiv);

      // create the card front div
      const cardFrontDiv = $("<div>");
      cardFrontDiv.addClass("card-front");
      cardFrontDiv.append(`<p>${card.name}</p>`);
      cardInnerDiv.append(cardFrontDiv);

      cardDiv.append(cardInnerDiv);

      cardsBoard.append(cardDiv);
    });

    // show the game board
    $("#gameBoard").show();
    $("#gameBoard").css("display", "flex");

    // hide the welcome modal
    $("#welcomeModal").hide();

    // reveal cards
    await this.revealCards(2);

    // start timer
    const timerInterval = this.startTimer();

    const game = this;

    // make the cards clickable
    $(".card").on("click", function () {
      // check if the card is already matched
      if ($(this).hasClass("matched")) {
        return;
      }

      // check if the card is already revealed
      if ($(this).hasClass("revealed")) {
        return;
      }

      // get revealed Cards
      const revealedCards = $(".revealed");

      // check if there are already two revealed cards
      if (revealedCards.length === 2) {
        return;
      }

      // reveal the card
      $(this).addClass("revealed");

      // check if there are two revealed cards
      if (revealedCards.length === 1) {
        // get the value of the first revealed card
        const firstRevealedCardValue = revealedCards.attr("data-value");

        // get the value of the second revealed card
        const secondRevealedCardValue = $(this).attr("data-value");

        // check if the values are the same
        if (firstRevealedCardValue === secondRevealedCardValue) {
          $("body").css("background-color", "green");

          // match the cards
          revealedCards.addClass("matched");
          $(this).addClass("matched");

          if ($(".card:not(.matched)").length === 0) {
            // stop the timer
            clearInterval(timerInterval);

            // Congratulate the player
            game.congratulatePlayer(userName);
          }
        } else {
          $("body").css("background-color", "red");
        }

        setTimeout(() => {
          $("body").css("background-color", "#23272e");
          revealedCards.removeClass("revealed");
          $(this).removeClass("revealed");
        }, 1000);
      }
    });
  }
}

export default Game;

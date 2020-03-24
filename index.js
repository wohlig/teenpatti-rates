var teenPattiScore = require("teenpattisolver");
var moment = require("moment");
var _ = require("lodash");
var Cards = require("./cards");
var startTime = moment();
var Combinatorics = require("js-combinatorics");
var allCards = _.map(Cards.getAllCards(), n => {
  return n.shortName;
});
// allCards = _.filter(allCards, function(n) {
//   return /s/i.test(n);
// });
// console.log(allCards);
var player1Cards = ["As"];
var player1CardsRemaining = 3 - player1Cards.length;
var player2Cards = [];
var player2CardsRemaining = 3 - player2Cards.length;
var usedCards = _.union(player1Cards, player2Cards);
var remainingCards = _.xor(allCards, usedCards);
var allCombinations = Combinatorics.bigCombination(
  remainingCards,
  6 - usedCards.length
);
var totalCombinations = allCombinations.length;
console.log(totalCombinations);
var wins = { player1: 0, player2: 0, draw: 0 };
var i = 0;
while ((a = allCombinations.next())) {
  var tempPlayer1Cards = Combinatorics.combination(
    a,
    player1CardsRemaining
  ).toArray();
  console.log(tempPlayer1Cards);

  var bruteCards = _.map(tempPlayer1Cards, n => {
    return {
      player1Cards: _.union(player1Cards, n),
      player2Cards: _.union(player2Cards, _.difference(a, n))
    };
  });

  _.each(bruteCards, cardsObj => {
    var player1Score = teenPattiScore.scoreHandsNormal(cardsObj.player1Cards);
    var player2Score = teenPattiScore.scoreHandsNormal(cardsObj.player2Cards);
    if (player1Score.score > player2Score.score) {
      wins.player1++;
    } else if (player1Score.score < player2Score.score) {
      wins.player2++;
    } else {
      wins.draw++;
    }
  });
  return false;
}

wins.player1Probability = wins.player1 / totalCombinations;
wins.player2Probability = wins.player2 / totalCombinations;
wins.drawProbability = wins.draw / totalCombinations;
wins.player1Rate = 1 / wins.player1Probability - 1;
wins.player2Rate = 1 / wins.player2Probability - 1;
wins.drawRate = 1 / wins.drawProbability - 1;
console.log(wins);
console.log(moment().diff(startTime) / 1000);

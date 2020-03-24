var teenPattiScore = require("teenpattisolver");
var moment = require("moment");
var _ = require("lodash");
var Cards = require("./cards");
var startTime = moment();
var Combinatorics = require("js-combinatorics");
var allCards = _.map(Cards.getAllCards(), n => {
  return n.shortName;
});
var player1Cards = ["6s", "Jh", "Kc"];
// var player1CardsRemaining = 3 - player1Cards.length;
var player2Cards = ["4d", "8c"];
// var player2CardsRemaining = 3 - player2Cards.length;
var usedCards = _.union(player1Cards, player2Cards);
var remainingCards = _.xor(allCards, usedCards);
var allCombinations = Combinatorics.permutation(
  remainingCards,
  6 - usedCards.length
);
var totalCombinations = allCombinations.length;
console.log(totalCombinations);
var wins = { player1: 0, player2: 0, draw: 0 };
var i = 0;
while ((a = allCombinations.next())) {
  // find each combination for 2 card and 3 cards

  // var tempPlayer1Cards = Combinatorics.combination(a, player1CardsRemaining);
  // var tempFirstPlayerCards = Combinatorics.combination(
  //   a,
  //   player2CardsRemaining
  // );

  var newPlayer1Cards = _.cloneDeep(player1Cards);
  var newPlayer2Cards = _.cloneDeep(player2Cards);
  _.times(3 - newPlayer1Cards.length, () => {
    newPlayer1Cards.push(a.shift());
  });
  _.times(3 - newPlayer2Cards.length, () => {
    newPlayer2Cards.push(a.shift());
  });
  var player1Score = teenPattiScore.scoreHandsNormal(newPlayer1Cards);
  var player2Score = teenPattiScore.scoreHandsNormal(newPlayer2Cards);
  if (player1Score.score > player2Score.score) {
    wins.player1++;
  } else if (player1Score.score < player2Score.score) {
    wins.player2++;
  } else {
    wins.draw++;
  }
}

wins.player1Probability = wins.player1 / totalCombinations;
wins.player2Probability = wins.player2 / totalCombinations;
wins.drawProbability = wins.draw / totalCombinations;
wins.player1Rate = 1 / wins.player1Probability - 1;
wins.player2Rate = 1 / wins.player2Probability - 1;
wins.drawRate = 1 / wins.drawProbability - 1;
console.log(wins);
console.log(moment().diff(startTime) / 1000);

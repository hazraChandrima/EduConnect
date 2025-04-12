const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore();

const bruteForce = new ExpressBrute(store, {
  freeRetries: 5,
  minWait: 1 * 60 * 1000,
  maxWait: 10 * 60 * 1000,
  failCallback: function (req, res, next, nextValidRequestDate) {
    console.log("Brute-force limit hit");
    return res.status(429).json({
      message: `Too many attempts. Try again after ${nextValidRequestDate}`
    });
  }
});

function wrappedBruteForce(req, res, next) {
  console.log("BruteForce middleware hit");
  bruteForce.prevent(req, res, next);
}

module.exports = wrappedBruteForce;

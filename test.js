const Stat = require('./index');

let stat = new Stat('first second last');

for (var i = 0; i < 3000; i++) {
  stat.add({
    first: 0 + (Math.random() * 40 >> 0),
    second: 100 + (Math.random() * 120 >> 0),
    last: 300 + (Math.random() * 240 >> 0),
  });
}

let result = stat
  .field()
  .result('sum mean median');

let rank = stat
  .field('first last')
  .rank();

console.log(result);
console.log(rank);
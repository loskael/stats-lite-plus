const stats = require('stats-lite');
const isnumber = require('isnumber');

function toArray(list) {
  return Array.isArray(list) ? list : list.split(' ');
}

function Stat(fields, line) {
  this.fields = toArray(fields);
  this.values = {};
  this.fields.forEach(field => {
    this.values[field] = [];
  });
  this.line = line || '\n------------------------------\n';
}

Stat.prototype = {
  add: function(item) {
    this.fields.forEach(field => {
      let value = item[field];
      isnumber(value) &&
        this.values[field].push(value);
    });
    return this;
  },
  field: function(fields) {
    fields && (this._fields = toArray(fields));
    return this;
  },
  result: function(methods) {
    let output = [];
    methods = toArray(methods);
    let fields = this._fields ? this._fields : this.fields.slice(0);
    fields.forEach(field => {
      if (this.fields.indexOf(field) === -1) return; // field not support
      output.push(this.line);
      methods.forEach(method => {
        if (!stats[method]) return; // method not support
        output.push(`${field} ${method}: ${stats[method](this.values[field]).toFixed(2)}`);
      });
    });
    delete this._fields;
    return output.join('\n');
  },
  rank: function() {
    let result = {};
    let fields = this._fields ? this._fields : this.fields.slice(0);

    fields.forEach(field => {
      if (this.fields.indexOf(field) === -1) return; // field not support
      result[field] = stats.sum(this.values[field]);
    });

    let keys = Object.keys(result);
    let values = Object.values(result);
    let output = [this.line, 'Rank: '];

    values.slice(0).sort((x, y) => {
      return y - x;
    }).forEach((value, index) => {
      output.push(`${index}. ${keys[values.indexOf(value)]} ${value}`);
    });

    return output.join('\n');
  },
};

module.exports = Stat;
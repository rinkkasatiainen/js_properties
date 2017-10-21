import {expect} from 'chai';
import jsc from 'jsverify'


const delay = (timeout, callback) => {
  var complete;
  var p = new Promise(function (c, r) {
    complete = c;
  });

  setTimeout(function () {
    complete(callback());
  }, timeout);

  return p;
}

console.log( jsc._)

var noEffectOnPureComputations =
  jsc.forall("json -> json", "json", jsc.nat(100), function (f, json, milliseconds) {
    var sync = f(json);
    return delay(milliseconds, function () {
      return f(json);
    })
      .then(function (async) {
        return _.isEqual(sync, async);
      });
  });


describe("testing promises", () => {
  it('generates booleans', () => {
    jsc.check(noEffectOnPureComputations);
  })

});
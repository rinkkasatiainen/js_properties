import {expect} from 'chai';
import jsc from 'jsverify'

const sentGenerator = jsc.integer(1,100).generator.map(sent => sent * 10)
const lessThan6EURGenerator = jsc.integer(1,59).generator.map(sent => sent * 10)
const moreThan6EURGenerator = jsc.integer(60, 1000).generator.map(sent => sent * 10)
const sents = jsc.record({
  coins: jsc.bless({ generator: sentGenerator})
});
const lessThan6EUR = jsc.record({
  coins: jsc.bless({ generator: lessThan6EURGenerator})
});
const moreThan6EUR = jsc.record({
  coins: jsc.bless({ generator: moreThan6EURGenerator})
});

const checkOptions = {
  // rngState: '074e9b5f037a8c21d6',
  tests: 2
}

const boolFnAppliedThrice =
  jsc.forall("bool -> bool", "bool", function (f, b) {
    return f(f(f(b))) === f(b);
  });
describe("testing promises", () => {
  it ('generates booleans', () => {
    jsc.assert(boolFnAppliedThrice);

  })

})


describe("Coin Changer", () =>{

  it("sum of coins should be exacly the same as original", () => {
    jsc.assertForall(sents,
      ( coin_amount ) => {
        const change = new CoinChanger().change( coin_amount.coins );
        return change.reduce( (carry, coin) => coin + carry, 0) === coin_amount.coins
      });
  }, checkOptions)

  it("sum of coinmap coins is exactly same as original", () => {
    jsc.assertForall(sents,
      ( coin_amount ) => {
        let coinChanger = new CoinChanger();
        const change = coinChanger.change( coin_amount.coins );
        const coinMap = coinChanger.coinMap(change)

        const result = Object.keys(coinMap).reduce((result, coin) => result + coin * coinMap[coin], 0);
        return result === coin_amount.coins;
      });
  }, checkOptions)

  it("10 cents should be at max once", () => {
    jsc.assertForall(sents,
      ( coin_amount ) => {
        const change = new CoinChanger().change( coin_amount.coins );
        return change.filter( coin => coin === 10 ).length <= 1
      });
  }, checkOptions)

  it("any coin is at most twice", () => {
    jsc.assertForall( lessThan6EUR, ( coin_amount ) => {
      let coinChanger = new CoinChanger();
      const change = coinChanger.change( coin_amount.coins );
      const coinMap = coinChanger.coinMap( change )

      const coinCountMoreThan_2 = Object.keys(coinMap).map(c => coinMap[c]).filter( i => i > 2 );
      return coinCountMoreThan_2.length === 0
    })
  });

  it("2EUR is only one having more than 2, all others have less than 2", () => {

    jsc.assertForall( moreThan6EUR, ( coin_amount ) => {
      let coinChanger = new CoinChanger();
      const change = new CoinChanger().change( coin_amount.coins );
      const coinMap = coinChanger.coinMap( change )

      const amount_of_2_eur_coins = Object.keys(coinMap).filter(coin => coin === '200').map( c => coinMap[c])
      return amount_of_2_eur_coins > 2

    })
  });

  it("If changing more than 6 EUR, smaller coins are returned a max by 2", () => {

    jsc.assertForall( moreThan6EUR, ( coin_amount ) => {
      let coinChanger = new CoinChanger();
      const change = new CoinChanger().change( coin_amount.coins );
      const coinMap = coinChanger.coinMap( change )

      const coins_less_than_2_count = Object.keys(coinMap).filter(coin => coin < 200)
      return coins_less_than_2_count.map(c => coinMap[c]).filter( i => i > 2 ).length === 0;

    })
  });

} );

describe("sandbox", () => {
  it ("550", () =>{
    const change = new CoinChanger().change( 550 );

    expect( change ).to.eql([200, 200, 100, 50])
  })

});

class CoinChanger{

  change(coin_amount) {
    return this.change_recur([], [200, 100, 50, 20, 10], coin_amount)
  }

  coinMap( coins ){
    return coins.reduce( (carry, coin) => {
      if(carry[coin] !== undefined){
        carry[coin]++
      } else {
        carry[coin] = 1;
      }
      return carry
    }, {})
  }

  change_recur(carry, coins, amount){
    for( const coin of coins){
      while( amount >= coin ){
        carry = [...carry, coin]
        amount -= coin
      }
    }
    return carry
  }
}
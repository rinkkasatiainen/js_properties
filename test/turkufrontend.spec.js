import jsc from 'jsverify';
import {expect} from 'chai';
import R from 'ramda';

import CoinChanger from '../coin-changer'
import Purse from '../purse'
import {sents, coins, coin, moreThan6EUR} from './generators'

describe('test env', () => {
  it('should do booleans', () => {
    expect(true).to.eql(true);
  });
});

const coinChanger = new CoinChanger();
const purse = new Purse();

describe('CoinChanger', () => {
  const coinChanger = new CoinChanger()
  it('should pass acceptance test', () => {
    const changes = coinChanger.change(670)
    expect(changes).to.eql(
      [200, 200, 200, 50, 20]
    )
  });


  it('sum of coins should be exactly the same as original', () => {
    jsc.assertForall(sents, (coin_amount) => {
      const amount = coin_amount.coins
      const change = coinChanger.change(amount)

      const sum = change.reduce((s,c) => s+c, 0);
      return sum === amount
    })
  });

  it('should have a max 1 coin of 10 cents', () => {
    jsc.assertForall(sents, (coin_amount) => {
      const amount = coin_amount.coins
      const change = coinChanger.change(amount)

      return change.filter(c => c === 10).length <= 1 ;
    });
  })

  it('should have max 2 coins of each coins except 2 eur', () => {
    jsc.assertForall(sents, (coin_amount) => {
      const amount = coin_amount.coins
      const change = coinChanger.change(amount)

      const coins = purse.collect(change) 

      const foo = Object.keys(coins).filter( c => c != 200 ).map( c => coins[c]).filter( s => s > 2)

      return foo.length === 0
    });
  });

  it('when more than 6 euros, should have more than 2 coins or 2EUR', () => {
    jsc.assertForall(moreThan6EUR, (coin_amount) => {
      const amount = coin_amount.coins
      const change = coinChanger.change(amount)

      const coins = purse.collect(change) 

      return coins[200] > 2;
    });

  });
})












describe('Purse', () => {

  const purse = new Purse();
  it('should calculate correctly', ()=>{
    jsc.assertForall(coins, (arrOfCents) => {
      const collected = purse.collect(arrOfCents)
      const amount = arrOfCents.reduce((s,c)=>s+c, 0)

      const res = Object.keys(collected).reduce(
        (sum, c) => sum + c * collected[c], 0);
      return res === amount
    });
  })
})


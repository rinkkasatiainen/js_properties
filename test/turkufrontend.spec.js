import jsc from 'jsverify';
import {expect} from 'chai';
import R from 'ramda';

import CoinChanger from '../coin-changer'
import Purse from '../purse'
import {sents, coins, coin} from './generators'

describe('test env', () => {
  it('should do booleans', () => {
    expect(true).to.eql(true);
  });
});

describe('CoinChanger', () => {
  const coinChanger = new CoinChanger()
  it('should pass acceptance test', () => {
    const changes = coinChanger.change(670)
    expect(changes).to.eql(
      [200, 200, 200, 50, 20]
    )
  });

  it('returned sum of coins should match', () => {
    jsc.assertForall(sents, (sents) => {
      const amount = sents.coins
      const change = coinChanger.change(amount)

      const c_sum = change.reduce((sum, coin) => sum + coin, 0)
      return c_sum === amount

    })
  });

  it('should have 10 cents at most once', () => {
    jsc.assertForall(sents, (sents) => {
      const amount = sents.coins
      const change = coinChanger.change(amount);

      return change.filter(c=>c===10).length <= 1
    });
  });

  it('should have all coins, except 2EUR, at max twice', ()=> {
    jsc.assertForall(sents, (sents) => {
      const amount = sents.coins
      const change = coinChanger.change(amount);
      const purse = new Purse().collect(change);

//      const calc_coin = (c, a, o) => c*a;
//      const f = R.mapObjIndexed(calc_coin, purse)

      let c = Object.keys(purse).filter(c=>c!=='200').map(
        c=>purse[c]).filter(x=>x>2);

      return c.length === 0;
    })
  })

  it('can have more than 2 coins, if more than 6 EUR', () => {
    jsc.assertForall(sents, (sents) => {
      const amount = sents.coins
      const change = coinChanger.change(amount);
      const purse = new Purse().collect(change);

//      const calc_coin = (c, a, o) => c*a;
//      const f = R.mapObjIndexed(calc_coin, purse)

      let c = Object.keys(purse).filter(c=>c===200).map(
        c=>purse[c]).filter(x=>x>2);

      return c.length < 1;
    })
  })
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


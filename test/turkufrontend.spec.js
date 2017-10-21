import jsc from 'jsverify';
import {expect} from 'chai';

import CoinChanger from '../coin-changer'

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
})

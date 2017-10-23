
class CoinChanger {

  change(amount) {
    return this.recur_f(amount)
  }

  recur_f(amount, carry=[], coins=[200,100,50,20,10]){
    const coin = coins[0]
    if(coins.length === 0){
      return carry
    }
    if( amount >= coin){
      return this.recur_f(amount-coin, [...carry, coin], coins)
    }
    const [first, ...rest] = coins
    return this.recur_f(amount, carry, rest)
  }
}

export default CoinChanger

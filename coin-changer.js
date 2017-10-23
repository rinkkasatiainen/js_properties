
const C = [200, 100, 50, 20, 10]

class CoinChanger {

  change(amount) {
    let change = []
    return this.f(amount)
    //return this.tail_recur(amount)
  }

  f(amount, coins=C) {
    let change=[]
    for( const coin of coins){
      while(amount >= coin){
        change = [...change, coin]
        amount -= coin
      }
    }
    return change
  }

  tail_recur(amount, change = [], coins = C){
    const [coin, ...rest] = coins
    if(amount === 0){
      return change
    }
    if(amount >= coin){
      return this.tail_recur( amount-coin, [...change, coin], coins )
    }
    return this.tail_recur( amount, change, rest)
  }
}

export default CoinChanger

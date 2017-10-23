
class Purse {

  collect(coins){
    return coins.reduce( (carry, coin) => {
      if(carry[coin] !== undefined){
        carry[coin]++
      } else {
        carry[coin] = 1;
      }
      return carry
    }, {})
  }
}

export default Purse;

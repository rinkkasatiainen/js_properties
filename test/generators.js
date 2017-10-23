import jsc from 'jsverify'

const sentGenerator = jsc.integer(1,1000).generator.map(sent => sent * 10)
export const sents = jsc.record({
    coins: jsc.bless({ generator: sentGenerator})
});









// ... ( more methods below)






const moreThan6EURGenerator = jsc.integer(60, 1000).generator.map(sent => sent * 10)
export const moreThan6EUR = jsc.record({
    coins: jsc.bless({ generator: moreThan6EURGenerator})
});






// ... ( more methods below)






const coinGenerator = jsc.elements([10,20,50,100,200])

export const coin = jsc.elements([10,20,50,100,200])
export const coins = jsc.array(coin)




const lessThan6EURGenerator = jsc.integer(1,59).generator.map(sent => sent * 10)
const lessThan6EUR = jsc.record({
    coins: jsc.bless({ generator: lessThan6EURGenerator})
});
const checkOptions = {
    // rngState: '074e9b5f037a8c21d6',
     tests: 2
}





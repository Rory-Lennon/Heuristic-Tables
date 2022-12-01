
var data_work = []

const sortData = async () => {
  console.log('sortData')
  data_sort = data_sort.sort((a,b) => parseFloat(a.numtradesinc) < parseFloat(b.numtradesinc) ? 1 : -1)
  buildSortTable()
}

const getTradesData = async () => {
  console.log('getTradesData')
  var array_size = data_work.length
  console.log(array_size)   
  for (var i=0;i<array_size;i++) {
    console.log(i) 
    let textProcessing = document.getElementById('processing')
    textProcessing.innerHTML=`${i} of ${array_size - 1}`
    var symbol = data_work[i].symbol
    const tfetch1D = `https://api.binance.com/api/v3/ticker?symbol=${symbol}&windowSize=1d&type=FULL`
    const fresp1D = await fetch(tfetch1D)
    const fdata1D = await fresp1D.json()
    const price = parseFloat(fdata1D.lastPrice)
    data_work[i].price = price  
    const numtrades1D = parseInt(parseInt(fdata1D.count)) / 24
    data_work[i].numtrades1D = numtrades1D
    const priceChange1D = parseFloat(fdata1D.priceChangePercent)
    data_work[i].priceChange1D = priceChange1D / 24.
    const tfetch1H = `https://api.binance.com/api/v3/ticker?symbol=${symbol}&windowSize=1h&type=FULL`
    const fresp1H = await fetch(tfetch1H)
    const fdata1H = await fresp1H.json()
    const numtrades1H = parseInt(fdata1H.count)
    data_work[i].numtrades1H = numtrades1H
    data_work[i].numtradesDF = 100. * (numtrades1H - numtrades1D) / numtrades1D
    if(numtrades1H == 0 | numtrades1D == 0) data_work[i].numtradesDF = 0
    const priceChange1H = parseFloat(fdata1H.priceChangePercent)
    data_work[i].priceChange1H = priceChange1H
  }
  buildTradesTable()
}

const getExchangeData = async () => {
  console.log('getExchangeData')
  var currentTime = new Date();
  var millisecs = currentTime.getTime();
  var tm = parseInt(millisecs/1000);
  const resp = await fetch(`https://api.binance.com/api/v3/exchangeInfo`)
  const data_exchange = await resp.json();
  var symbols = data_exchange.symbols
  var array_size = symbols.length
  for (var i=0;i<array_size;i++) {
    if(symbols[i].status == 'TRADING'){
      var tsymbol = symbols[i].symbol
      if(tsymbol.includes('USDT'))
      {
        data_work.push({symbol:tsymbol, time:tm, price:0., numtrades1D:0, numtrades1H:0, numtradesDF:0, priceChange1D:0., priceChange1H:0.})
      }
    }
  }
  console.log("data_work.length")  
  console.log(data_work.length)  
}

function updateSortData(){
  console.log('updateSortData')
  var array_size = data_work.length
  for (var i=0;i<array_size;i++) {  
  }
}

const runMine = async () => {
  console.log('runMine')
  await getExchangeData()   
  await getTradesData()
}

runMine()

function buildTradesTable(){
  console.log('buildTradesTable')
  var table = document.getElementById('table-trade-data')
  table.innerHTML = ""
  var size = data_work.length
  if(size == 0) return
  for (var i=0;i<10;i++) {
    var symbol = data_work[i].symbol
    var price = data_work[i].price
    var numtrades1D = parseInt(data_work[i].numtrades1D)
    var numtrades1H = parseInt(data_work[i].numtrades1H)
    var numtradesDF = parseFloat(data_work[i].numtradesDF).toFixed(2)    
    var priceChange1D = parseFloat(data_work[i].priceChange1D).toFixed(2)
    var priceChange1H = parseFloat(data_work[i].priceChange1H).toFixed(2)
  
    var newline = 
    `<tr>
      <td>${symbol}</td>
      <td>${price}</td>      
      <td>${numtrades1D}</td>
      <td>${numtrades1H}</td>  
      <td>${numtradesDF}</td>       
      <td>${priceChange1D}</td> 
      <td>${priceChange1H}</td> 
    </tr>`
    table.innerHTML += newline
  }
}
///////////////////////////// SORT
var boolNT24 = true
var boolNT01 = true
var boolNTDF = true
var boolPC24 = true
var boolPC01 = true
function sortNT24(){
  boolNT24 = !boolNT24
  if(boolNT24){
    data_work = data_work.sort((a,b) => 
      parseInt(a.numtrades1D) < parseInt(b.numtrades1D) ? 1 : -1)
  }
  else{
    data_work = data_work.sort((a,b) => 
      parseInt(a.numtrades1D) > parseInt(b.numtrades1D) ? 1 : -1)
  }
  buildTradesTable()
}
function sortNT01(){
  boolNT01 = !boolNT01
  if(boolNT01){
    data_work = data_work.sort((a,b) => 
      parseInt(a.numtrades1H) < parseInt(b.numtrades1H) ? 1 : -1)
  }
  else{
    data_work = data_work.sort((a,b) => 
      parseInt(a.numtrades1H) > parseInt(b.numtrades1H) ? 1 : -1)
  }
  buildTradesTable()
}
function sortNTDF(){
  boolNTDF = !boolNTDF
  if(boolNTDF){
    data_work = data_work.sort((a,b) => 
      parseInt(a.numtradesDF) < parseInt(b.numtradesDF) ? 1 : -1)
  }
  else{
    data_work = data_work.sort((a,b) => 
      parseInt(a.numtradesDF) > parseInt(b.numtradesDF) ? 1 : -1)
  }
  buildTradesTable()
}
function sortPC24(){
  boolPC24 = !boolPC24
  if(boolPC24){
    data_work = data_work.sort((a,b) => 
      parseFloat(a.priceChange1D) < parseFloat(b.priceChange1D) ? 1 : -1)
  }
  else{
    data_work = data_work.sort((a,b) => 
      parseFloat(a.priceChange1D) > parseFloat(b.priceChange1D) ? 1 : -1)
  }
  buildTradesTable()
}
function sortPC01(){
  boolPC01 = !boolPC01
  if(boolPC01){
    data_work = data_work.sort((a,b) => 
      parseFloat(a.priceChange1H) < parseFloat(b.priceChange1H) ? 1 : -1)
  }
  else{
    data_work = data_work.sort((a,b) => 
      parseFloat(a.priceChange1H) > parseFloat(b.priceChange1H) ? 1 : -1)
  }
  buildTradesTable()
}
////////////////////////////////



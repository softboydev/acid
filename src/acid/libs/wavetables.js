function generateRotationTable(n){
  let table = []
  for(let i = 0; i < n; i++){
    let angle = [0,0]
    let mod = (i / n) * 4
    if(mod < 1){
      mod = mod % 1
      angle = [(mod),(1 - mod)]
    }
    else if(mod < 2){
      mod = mod % 1
      angle = [((1 - mod)),-(mod)]
    }
    else if(mod < 3){
      mod = mod % 1
      angle = [-(mod), -((1 - mod))]
    }
    else{
      mod = mod % 1
      angle = [-((1 - mod)),(mod)]
    }
    table.push("["+ Math.round(angle[0] * 1000) / 1000 + "," + Math.round(angle[1] * 1000) / 1000 +"]")
  }
  console.log("Rotationtable of length: " + table.length);
  console.log("["+table.join(",")+"]")
}
function generateRandomTable(n){
  let table = []
  for(let i = 0; i < n; i++){
    let r = Math.round(Math.random() * 1000) / 1000
    table.push(r)
  }
  console.log("Randomtable of length: " + table.length);
  console.log("["+table.join(",")+"]")
}

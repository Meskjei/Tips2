worker.onMessage(function (res) {
  let cardID = res.cardID;
  let dataSet = res.dataSet;
  //遍历dataSet，找出对象数组里与cardID拥有相同ID的对象
  for(var i=0, k=dataSet.length; i<k; i++){
    let tempCardID = dataSet[i].id;
    if(cardID == tempCardID){
      worker.postMessage({
        currentTip: dataSet[i]
      });
      break;
    }
  }
});



let openBCI = new OpenBCI();
var connected = false;

var freqVals = new Array(100);
var initVals = false;
var counter = 0;

function onConnect(){
    openBCI.start();
    connected = true;
}

function getDifficulty(){
    if(initVals == false){
      initArr();
      initVals = true;
    }
    if (connected) {
        int currPower = openBCI.getRelativeBandPower(0 , "alpha");
        var spot = counter%100;
        freqVals[spot] = currPower;
        var diff = avgVals();
        counter++;
        return diff;
    }
    return 0;
}

function initArr(){
  for(int i = 0; i < 100; i++){
    freqVals[i] = 1;
  }
}

funciton avgVals(){
  var sum = 0;
  for(int i = 0; i < 100; i++){
    sum += freqVals[i];
  }
  return sum/100;
}

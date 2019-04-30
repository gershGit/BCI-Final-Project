let openBCI = new OpenBCI();
var connected = false;

function onConnect(){
    openBCI.start();
    connected = true;
}

function getDifficulty(){
    if (connected) {
        //TODO sliding average
        //TODO scaling of difficulty based on testing
        return openBCI.getRelativeBandPower(0 , "alpha");
    }
    return 5;
}

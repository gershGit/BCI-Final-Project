let openBCI = new OpenBCI();

function onConnect(){
    openBCI.start();
}

function getDifficulty(){
    return 1;
}
var OpenBCI = function() {
  this.buffer = [];
  this.channels = [[], [], [], []];
  this.SECONDS = 0.25;
  this.BUFFER_SIZE = this.SECONDS * 256;

  this.addData = (sample, channel) => {
    if (this.channels[channel].length > this.BUFFER_SIZE) {
      this.channels[channel].shift();
    }
    this.channels[channel].push(sample[0]);
  };

  this.getLenght = () => {
    return this.buffer.length;
  };

  this.getBuffer = () => {
    return this.buffer;
  };

  this.getBandPower = (channel, band) => {
    if (this.channels[channel].length < this.BUFFER_SIZE) {
      return 0;
    }

    let psd = window.bci.signal.getPSD(
      this.BUFFER_SIZE,
      this.channels[channel]
    );

    let alpha = window.bci.signal.getBandPower(
      this.BUFFER_SIZE,
      psd,
      256,
      band
    );
    return alpha;
  };

  this.getRelativeBandPower = (channel, band) => {
    var target = this.getBandPower(channel, band);
    var theta = this.getBandPower(channel, "theta");
    var alpha = this.getBandPower(channel, "alpha");
    var beta = this.getBandPower(channel, "beta");
    return target / (theta + alpha + beta);
  };

  this.device = new Bluetooth.BCIDevice(sample => {
    let { electrode, data } = sample;
    switch (electrode) {
      case 0:
        this.addData(data, 0);
        break;
      case 1:
        this.addData(data, 1);
        break;
      case 23:
        this.addData(data, 2);
        break;
      case 24:
        this.addData(data, 3);
        break;
      default:
      // catch
    }
  });

  this.start = () => {
    this.device.connect();
  };

  return this;
};

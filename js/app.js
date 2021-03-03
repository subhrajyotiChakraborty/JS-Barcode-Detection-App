initQuagga();
startTimer();
var timer;
var cameraSensor = document.querySelector("#camera--sensor");
var cameraOutput = document.querySelector("#cameraOutput");
var videoElement = document.querySelector("video");
var barcodePara = document.querySelector("#barcode");

function startTimer() {
  timer = setInterval(function () {
    console.log("Print interval!");
    clearInterval(timer);
    cameraSensor.width = videoElement.videoWidth;
    cameraSensor.height = videoElement.videoHeight;
    cameraSensor.getContext("2d").drawImage(videoElement, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/png");
    unDetectedHandler(cameraOutput.src);
  }, 5000);
}

function successHandler(result) {
  console.log(result);
  barcodePara.innerHTML = `your barcode is ${result.codeResult.code}`;
}

function unDetectedHandler(imageData) {
  // do some processing...
}

function initQuagga() {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#camera"),
      },
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
          "code_39_vin_reader",
          "codabar_reader",
          "upc_reader",
          "upc_e_reader",
          "i2of5_reader",
          "2of5_reader",
          "code_93_reader",
        ], // List of active readers,
      },
    },
    function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    }
  );
}

Quagga.onDetected(function (result) {
  clearInterval(timer);
  successHandler(result);
  // setTimeout(function () {
  //   Quagga.offDetected(successHandler);
  // }, 0);
});

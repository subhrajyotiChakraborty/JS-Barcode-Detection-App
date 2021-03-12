// getDevices();
initQuagga();
// startTimer(); // only for experiment
var timer;
var cameraSensor = document.querySelector("#camera--sensor");
var cameraOutput = document.querySelector("#cameraOutput");
var videoElement = document.querySelector("video");
var barcodePara = document.querySelector("#barcode");
// var deviceSelection = document.querySelector("#device-selection");

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
  // console.log(result);
  barcodePara.innerHTML = `your barcode is ${result.codeResult.code}`;
}

function unDetectedHandler(imageData) {
  // do some processing...
}

function initQuagga(deviceID) {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#camera"),
        constraints: {
          width: 400,
          height: 300,
          facingMode: "environment",
          deviceId: deviceID,
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: true,
      },
      numOfWorkers: 2,
      frequency: 10,
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
      locate: true,
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
  var audio = new Audio("../assets/sound/beep.mp3");
  audio.play();
  successHandler(result);
  // setTimeout(function () {
  //   Quagga.offDetected(successHandler);
  // }, 0);
});

function getDevices() {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      var deviceArr = devices.filter((device) => device.kind === "videoinput");
      console.log(deviceArr);
      deviceArr.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label;
        deviceSelection.appendChild(option);
      });
      deviceSelection.selectedIndex = 1;
      initQuagga(deviceArr[0].deviceId);
    })
    .catch((err) => console.log("No Device found!"));
}

function onCameraSelectionChange(deviceID) {
  initQuagga(deviceID);
}

getDevices();
// initQuagga();
// startTimer(); // only for experiment
var timer;
var cameraSensor = document.querySelector("#camera--sensor");
var cameraOutput = document.querySelector("#cameraOutput");
var videoElement = document.querySelector("video");
var barcodePara = document.querySelector("#barcode");
var deviceSelection = document.querySelector("#device-selection");

var sound = new Howl({
  src: ["../assets/sound/beep.wav"],
  volume: 1,
  onend: function () {},
});

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
  sound.play();
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
        constraints: {
          width: 400,
          height: 300,
          facingMode: "environment",
          deviceId: deviceSelection.value,
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

Quagga.onProcessed(function (result) {
  var drawingCtx = Quagga.canvas.ctx.overlay,
    drawingCanvas = Quagga.canvas.dom.overlay;

  if (result) {
    if (result.boxes) {
      drawingCtx.clearRect(
        0,
        0,
        parseInt(drawingCanvas.getAttribute("width")),
        parseInt(drawingCanvas.getAttribute("height"))
      );
      result.boxes
        .filter(function (box) {
          return box !== result.box;
        })
        .forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
            color: "transparent",
            lineWidth: 2,
          });
        });
    }

    if (result.box) {
      Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
        color: "#00F",
        lineWidth: 2,
      });
    }

    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, {
        color: "red",
        lineWidth: 3,
      });
    }
  }
});

Quagga.onDetected(function (result) {
  clearInterval(timer);
  // var audio = new Audio("../assets/sound/beep.mp3");
  // audio.play();

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
        option.text =
          device.label || `camera ${deviceSelection.childElementCount + 1}`;
        deviceSelection.appendChild(option);
      });
      if (deviceSelection.childElementCount > 1) {
        deviceSelection.selectedIndex = 1;
      } else {
        deviceSelection.selectedIndex = 0;
      }
      initQuagga();
    })
    .catch((err) => console.log("No Device found!"));
}

function onCameraSelectionChange(deviceID) {
  initQuagga(deviceID);
}

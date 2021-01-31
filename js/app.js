initQuagga();
var confirmation;

function successHandler(result) {
  console.log(result);
  confirmation = confirm(
    `Barcode detected. Barcode is "${result.codeResult.code}". Do you want to proceed with it? press "OK" to proceed, else press "Cancel".`
  );
  if (confirmation) {
    window.close();
  }
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

Quagga.onDetected((result) => {
  successHandler(result);
  setTimeout(() => {
    Quagga.offDetected(successHandler);
  }, 0);
});

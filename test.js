var model;
cocoSsd.load().then(
	// .then : returns a promise ( either accepts or returns something after some time kya return : kuch duration tak ruke )
	function (res) {
		model = res;
		alert("Model Ready");
	}, /// callback here
	function () {
		//failure
		console.log("loading tf model failed");
	}
);

function invoke_upload_image() {
	document.getElementById("upload-btn").click();
}

function draw_bbox(ctx, predictions, font) {
	console.log(predictions);
	predictions.forEach((prediction) => {
		// predictions = [{bbox: [10,20,300,500]}]
		const x = prediction.bbox[0];
		const y = prediction.bbox[1];
		const width = prediction.bbox[2];
		const height = prediction.bbox[3];
		ctx.strokeRect(x, y, width, height);
		const textWidth = ctx.measureText(prediction.class).width;
		const textHeight = parseInt(font, 10); // base 10
		ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
	});
}

function draw_label(ctx, predictions) {
	predictions.forEach((prediction) => {
		const x = prediction.bbox[0];
		const y = prediction.bbox[1];

		ctx.fillStyle = "#000000";
		ctx.fillText(prediction.class, x, y);
	});
}

function draw_res_image(canvas, ctx, image, predictions) {
	const font = "16px sans-serif";

	canvas.width = image.width;
	canvas.height = image.height;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.font = font;
	ctx.textBaseline = "top";
	ctx.strokeStyle = "#00FFFF";
	ctx.lineWidth = 3;
	ctx.fillStyle = "#00FFFF";
	draw_bbox(ctx, predictions, font);
	draw_label(ctx, predictions);
}

function upload_image() {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");

	var input_elem = document.querySelector("input[type=file]");
	var file = input_elem.files[0]; //sames as here : used for multiple uploads , so take 0th upload
	const image = document.getElementById("img");

	var reader = new FileReader();
	reader.addEventListener(
		"load", // jaise hi load hoga ek function chalega
		function () {
			image.src = reader.result;

			setTimeout(function () {
				if (image.height > 500) {
					image.width = image.width * (500 / image.height);
					image.height = 500;
				}

				model.detect(image).then(function (predictions) {
					draw_res_image(canvas, ctx, image, predictions);
				});
			}, 1000);
		},
		false
	);

	if (file) {
		// if there is a file : canvas element ( remove existing recvtange)
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		reader.readAsDataURL(file); //get convert to data url ;
	}
}

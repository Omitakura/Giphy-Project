var animeArray = [
	"Naruto",
	"Full Metal Alchemist",
	"Bleach",
	"Death Note",
	"Dragon Ball",
	"One Piece Anime",
	"Inuyasha",
	"Psycho-Pass",
	"Rurouni Kenshin",
	"Gurren Lagann"
];

//Giphy API
var endpoint = "https://api.giphy.com/v1/gifs/search";
var gifyAPI = "7auvNMT5NLSFlMNF29UjORA2EmW4XEfg";
var limit = 15;
var rating = "pg-13";

//this is the function to go over the topics array and render buttons for each one
function renderButtons(renderLast) {
	$(".buttons").empty();

	//this goes over the array
	for (var i = 0; i < animeArray.length; i++) {
		var b = $("<button>");

		//adds some bootstrap styling to the previously made button
		$(b).addClass("topic btn btn-primary");

		//add to the topics array
		$(b).html(animeArray[i]);

		//append it to the buttons div
		$(".buttons").append(b);
	}

	//this is the function to give out the gifs on click for the button
	$(".topic").click(function () {
		deliverGif(this);
	});

	//this is a if conditional to make sure the LAST USER submitted form/button will be the one to render their GIFS
	if (renderLast) {
		deliverGif(".topic:last");
	}
}

/////////////
//functions//
function deliverGif(anime) {
	// console.log(topic);
	// Set button state to active
	$(".buttons .active").removeClass("active");
	$(anime).addClass("active");
	// set up query string
	query = {
		api_key: gifyAPI,
		q: $(anime).html(),
		limit: limit,
		rating: rating
	};
	query = $.param(query);
	path = endpoint + "?" + query;
	// make the ajax call!
	$.ajax({
		url: path,
		type: "GET"
	})
		.done(function (response) {
			// console.log(response);
			// Clear old gifs
			$(".card-columns").empty();
			// Loop through results
			var gifArray = response.data;
			for (var i = 0; i < gifArray.length; i++) {
				// Build card (Bootstrap 4 component)
				var imgSrc = gifArray[i].images.downsized_still.url;
				var imgLink = gifArray[i].url;
				var embedLink = gifArray[i].embed_url;
				// Store lots of HTML in a card array
				var card = [
					"<div class='card'>",
					"<img class='card-img-top' src='" + imgSrc + "'>",
					"<div class='card-block'>",
					"<a href='" +
					imgLink +
					"' target='_blank' class=''><i class='fa fa-external-link' aria-hidden='true'></i>View on Giphy</a> ",
					"<a class='clip' data-toggle='tooltip' title='Copied!' data-clipboard-text='" +
					embedLink +
					"' href='#'><i class='fa fa-clipboard' aria-hidden='true'></i> Copy embed link</a>",
					"</div>",
					"<div class='card-footer card-inverse text-muted'>Rating: " +
					gifArray[i].rating.toUpperCase(),
					"</div>",
					"</div>"
				];
				// Use join to concatenate html block in the card array
				$(".card-columns").prepend(card.join(""));
			}
		})
		.fail(function () {
			console.log("error");
		});
}

function toggleGif(card) {
	//this sets the still and moving versions of each gif
	var imgSrc = $(card).attr("src");

	// Does it end with "_s.gif"?
	if (imgSrc.endsWith("_s.gif")) {
		imgSrc = imgSrc.replace("_s.gif", ".gif");
	} else {
		imgSrc = imgSrc.replace(".gif", "_s.gif");
	}

	// Update image path
	$(card).attr("src", imgSrc);
}

//Application
//this is youre basic doc ready function to render the buttons upon page
$(document).ready(function () {
	renderButtons();
	$("form").submit(function (event) {
		event.preventDefault();
		newTopic = $("#userInput")
			.val()
			.trim();
		if (newTopic !== "") {
			animeArray.push(
				$("#userInput")
					.val()
					.trim()
			);
			renderButtons(true);
		}
		// clear the input
		this.reset();
	});
	//Play the gif on click
	$(".gifs").on("click", ".card-img-top", function () {
		toggleGif(this);
	});
	$(".gifs").on("click", ".clip", function (event) {
		event.preventDefault();
	});
	//Allow the user to copy any gif to their clipboard
	clipboard = new Clipboard(".clip");
	clipboard.on("success", function (e) {
		e.clearSelection();
		if (e.action === "copy") {
			$(e.trigger).tooltip("show");
		}
	});
});

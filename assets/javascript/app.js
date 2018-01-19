$(document).ready(function() {

	let O = {

		baseURL: "https://api.giphy.com/v1/gifs/search?api_key=",
		apiKey: "06CY448Nm9LpOBy0yOkpqxb4N03CrSw2",

		origTopics: [
			"Mr. Krab",
			"Jean-Luc Picard",
			"Yojimbo",
			"Captain America"
		],

		store: {
			newTopics: []
		},

		// displays buttons for all stored topics
		renderButtons: function() {

			$("#button_field").empty();

			let allTopics = O.origTopics.concat(O.store.newTopics);
			console.log(allTopics);

			for(let i = 0; i < allTopics.length; i++) {

				let a = $("<button>");

				a.addClass("btn btn-primary topic_button");
				a.attr("data-name", allTopics[i]);
				a.text(allTopics[i]);

				$("#button_field").append(a).append('<br><br>');

			}

		},

		// renders 10 frozen gifs for selected topic button
		renderGiphs: function() {

			$("#gif_area").empty();			

			let queryURL = O.baseURL + O.apiKey + "&q=" + $(this).attr("data-name").split(' ').join('+') + "&limit=10";
			console.log(queryURL);

			$.ajax({
				url: queryURL,
				method: "GET"
			}).then(function(response) {

				console.log(response);

				let results = response.data;

				for(let i = 0; i < results.length; i++) {

					let div = $("<div>").addClass("text-center pull-left"),
							img = $("<img>").attr({
								"src": results[i].images.fixed_width_still.url, 
								"data-still": results[i].images.fixed_width_still.url, 
								"data-animate": results[i].images.fixed_width.url, 
								"class": "gif", 
								"data-state": "still"
								}),
							p = $("<p>").text("Rated: " + results[i].rating);

					div.append(img).append(p);
					$("#gif_area").append(div);

				}

			}).fail(function(err) {
				throw err;
				});

		},

		// plays/pauses gif when selected
		animateGif: function(x) {

			console.log(x);

			if (x.attr("data-state") === "still") {
		    x.attr("src", x.attr("data-animate"));
		    x.attr("data-state", "animate");
		  } 
		  else {
		    x.attr("src", x.attr("data-still"));
		    x.attr("data-state", "still");
		   }

		},

		ready: function() {

			O.renderButtons();

			// when new topic is submitted, stores topic and re-renders buttons
			$("#add_topic_button").on("click", function(event) {

				event.preventDefault();

				O.store.newTopics.push($("#topic_input").val().trim());

				$("#topic_input").val(null);				

				O.renderButtons();

			});

			$(document).on("click", ".topic_button", O.renderGiphs);

			$(document).on("click", ".gif", function() {
				O.animateGif($(this));
			});

		}

	};

	O.ready();

})
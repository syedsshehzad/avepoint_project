$("form").submit(e => {
	var query = $("input").val().trim();
	$.post("/search", {query: query}).then(function(data) {
		console.log(data);
		if (data.items.length > 0) {
			data.items.forEach(function(item) {
				$("#results").append(`<div>${item.title}</div>`);
			});
		} else {
			$("#results").append(`<p>${data}</p>`);
		}
	});
});
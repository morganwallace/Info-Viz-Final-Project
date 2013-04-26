function toggleModal(idName) {

	$(".overlay").removeClass("overlay").addClass("hidden");
	$("#"+idName).addClass("overlay").removeClass("hidden");

}
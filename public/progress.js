function sub_prog() {
  setTimeout(function () {
    let progress = 34;
    $(".progress-bar")
      .css("width", progress + "%")
      .attr("aria-valuenow", progress);
    $(".progress-bar").html(progress + "%");
  }, 330);

  setTimeout(function () {
    let progress = 42;
    $(".progress-bar")
      .css("width", progress + "%")
      .attr("aria-valuenow", progress);
    $(".progress-bar").html(progress + "%");
  }, 400);
  setTimeout(function () {
    let progress = 55;
    $(".progress-bar")
      .css("width", progress + "%")
      .attr("aria-valuenow", progress);
    $(".progress-bar").html(progress + "%");
  }, 490);
  setTimeout(function () {
    let progress = 65;
    $(".progress-bar")
      .css("width", progress + "%")
      .attr("aria-valuenow", progress);
    $(".progress-bar").html(progress + "%");
  }, 500);
  setTimeout(function () {
    let progress = 74;
    $(".progress-bar")
      .css("width", progress + "%")
      .attr("aria-valuenow", progress);
    $(".progress-bar").html(progress + "%");
  }, 510);
}

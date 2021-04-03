export async function remove() {
  let elem = document.querySelector(".topbanner");
  elem.remove();
  let editBtns = document.querySelectorAll(".mw-editsection");
  editBtns.forEach(element => {
    element.remove();
  });
  let numberURLs = document.querySelectorAll(".url.autonumber");
  numberURLs.forEach((element)=> {
    element.remove();
  });
  let imgs = document.querySelectorAll(".thumb");
  imgs.forEach((element)=> {
    element.remove();
  });
  let videoAd = document.querySelectorAll(".ac-widget-placeholder");
  videoAd.forEach((element)=> {
    element.remove();
  });
}

export async function convertLinkToText() {
  let nodes = document.querySelectorAll("#mw-content-text a:not(.tocUl>li>a)");
  nodes.forEach((element) => {
    element.replaceWith(element.textContent);
  });
}

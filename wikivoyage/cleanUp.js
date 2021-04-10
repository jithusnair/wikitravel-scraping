export async function remove() {
  let topBanner = document.querySelector(".wpb-banner-image-panorama.wpb-topbanner.wpb-positioned-banner");
  topBanner.remove();
  let editBtns = document.querySelectorAll(".mw-editsection");
  editBtns.forEach(element => {
    element.remove();
  });
  let styles = document.querySelectorAll(".mw-parser-output style");
  styles.forEach(element => {
    element.remove();
  });
  let dl = document.querySelectorAll(".mw-parser-output dl");
  dl.forEach(element => {
    element.remove();
  });
  let imgs = document.querySelectorAll(".thumb");
  imgs.forEach((element)=> {
    element.remove();
  });
  let listingMetadata = document.querySelectorAll(".listing-metadata");
  listingMetadata.forEach((element)=> {
    element.remove();
  });
  let subMenu = document.querySelectorAll(".toclevel-1 > ul");
  subMenu.forEach((element)=>{
    element.remove();
  });
  let goNext = document.querySelector(".toclevel-1:last-child");
  if(goNext) goNext.remove();
  let cope = document.querySelector(".toclevel-1:last-child");
  if(cope) cope.remove();

  let tocNumber = document.querySelectorAll(".tocnumber");
  tocNumber.forEach((element)=>{
    element.remove();
  });
  let noprint = document.querySelectorAll('.noprint');
  noprint.forEach((element) => {
    element.remove();
  });
  let routebox = document.querySelectorAll('.routeBox');
  routebox.forEach((element)=>{
    element.remove();
  });
  let cautionBox = document.querySelector('.pp_cautionbox');
  if(cautionBox) cautionBox.remove();
  // let iframes = document.querySelectorAll('iframe');
  // iframes.forEach((element)=> {
  //   element.remove();
  // });
}

export async function convertLinkToText() {
  let nodes = document.querySelectorAll("#mw-content-text a:not(.toclevel-1>a)");
  nodes.forEach((element) => {
    element.replaceWith(element.textContent);
  });
}

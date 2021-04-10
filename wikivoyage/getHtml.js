export async function getNav() {
  let nav = document.querySelector("div[role='navigation'] > ul");
  return nav.outerHTML;
}

export async function getEverythingElse() {
  try {
    // first get the IDs from Navbar
    let linkElems = document.querySelectorAll(".toclevel-1 > a");
    let ids = [];
    linkElems.forEach((elem)=> {
      let id = elem.getAttribute('href');
      ids.push(id);
    });

    let arr = [];
    let finalCSVArr = [];
    // get the intro paragaraph first
    let introParaArr = $('.mw-parser-output > p').nextUntil('.mw-h2section').toArray().map(elem => elem.outerHTML);
    arr.push(introParaArr.join(''));
    // get each paragraphs by navIds fetched above
    /* 
    Since there is character limit for Caspio's column table 
    it is best to group the html so that the threshold of each
    won't cross 64,000 characters
    */
    for (let i = 0; i < ids.length; i++) {
      if(ids[i] === '#Cope') {
        break;
      }
      let h2 = $(ids[i]).parent();
      let html1 = h2.prop('outerHTML');
      arr.push(html1);
      let arr1 = $(h2).nextUntil('.mw-h2section').toArray();
      for (let j = 0; j < arr1.length; j++) {
        arr.push(arr1[j].outerHTML);
        if(arr.join('').length > 64000) {
          let temp = arr.pop();
          finalCSVArr.push(arr.join(''));
          arr = [temp];
        }
      }
      // let html2 = arr1.join('');
      // arr.push(html2);
      // if(arr.join('').length > 64000) {
      //   let temp = arr.pop();
      //   finalCSVArr.push(arr.join(''));
      //   arr = [temp];
      // }
    }
    if(arr.length !== 0) {
      finalCSVArr.push(arr.join(''));
    }
    return finalCSVArr;
  } catch (error) {
    console.error(error);
    return [];
  }
}
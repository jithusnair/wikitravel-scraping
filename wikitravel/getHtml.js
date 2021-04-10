export async function getNav() {
  let nav = document.getElementById('toc');
  return nav.outerHTML;
}

export async function getEverythingElse() {
  try {
    // first get the IDs from Navbar
    let linkElems = document.querySelectorAll("#toc ul.tocUl>li>a");
    let ids = [];
    linkElems.forEach((elem)=> {
      let id = elem.getAttribute('href');
      ids.push(id);
    });

    let arr = [];
    let finalCSVArr = [];
    // get the intro paragaraph first
    let introParaArr = $('.noprint').nextUntil('h2', ':not(div)').toArray().map(elem => elem.outerHTML);
    arr.push(introParaArr.join(''));
    // get each paragraphs by navIds fetched above
    /* 
    Since there is character limit for Caspio's column table 
    it is best to group the html so that the threshold of each
    won't cross 64,000 characters
    */
    for (let i = 0; i < ids.length; i++) {
      let h1Tag = $(ids[i]).parent();
      let html1 = h1Tag.prop('outerHTML');
      arr.push(html1);
      let arr1 = $(h1Tag).nextUntil('h2').toArray();
      for (let j = 0; j < arr1.length; j++) {
        arr.push(arr1[j].outerHTML);
        if(arr.join('').length > 60000) {
          let temp = arr.pop();
          finalCSVArr.push(arr.join(''));
          arr = [temp];
        }
      }
      // let html2 = arr1.join('');
      // arr.push(html2);
      // if((i+1)%3 === 0) {
      //   finalCSVArr.push(arr.join(''));
      //   arr = [];
      // } else if((i+1) === ids.length) {
      //   finalCSVArr.push(arr.join(''));
      //   arr = [];
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
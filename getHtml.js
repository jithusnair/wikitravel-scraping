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
    let introParaArr = $('.noprint').nextUntil('h2', 'p').toArray().map(elem => elem.outerHTML);
    arr.push(introParaArr.join(''));
    // get each paragraphs by navIds fetched above
    /* 
    Since there is character limit for Caspio's column table 
    it is best to group the html so that the threshold of each
    won't cross 64,000 characters
    */
    for (let i = 0; i < ids.length; i++) {
      let district = $(ids[i]).parent();
      let html1 = district.prop('outerHTML');
      let arr1 = $(district).nextUntil('h2').toArray().map(elem => elem.outerHTML);
      let html2 = arr1.join('');
      arr.push(html1);
      arr.push(html2);
      if((i+1)%2 === 0) {
        finalCSVArr.push(arr.join(''));
        arr = [];
      } else if((i+1) === ids.length) {
        finalCSVArr.push(arr.join(''));
        arr = [];
      }
    }
    return finalCSVArr;
  } catch (error) {
    console.error(error);
    return [];
  }
}
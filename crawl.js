const {JSDOM} = require('jsdom');

const  crawlPage = async (baseURL, currentURL, pages)=>{
// checking if the url is offsite or not, if offsite come out immediately
    const currentUrlObj  = new URL(currentURL)
    const baseUrlObj = new URL(baseURL)
    if(currentUrlObj.hostname !== baseUrlObj.hostname){
        return pages
    }

    const normalizedURL = normalizeURL(currentURL)

// if page is already visited, increase the count, no need to repeat the http request
    if(pages[normalizedURL]>0){
        pages[normalizedURL]++
        return pages
    }

// if page doesn't exists
    if(currentURL === baseURL){
        //baseURL - don't count as a link to itself
        pages[normalizedURL]=0
    }else{
        pages[normalizedURL] = 1
    }

//fetching and parsing of the html of the currentURL
    console.log(`crawling ${currentURL}`)
    let htmlBody = ''
    try{
        const response = await fetch(currentURL)
        if(response.status > 399){
            console.log(`Got HTTP error, status code: ${response.status}`)
            return pages
        }
        const contentType = response.headers.get('content-type')
        if(!contentType.includes('text/html')){
            console.log(`Got non-html response: ${contentType}`)
            return pages
        }
        htmlBody = await response.text();
    }catch(err){
        console.log(err.message)
    }
    const nextURLs = getURLsFromHTML(htmlBody, baseURL)
    for(const nextURL of nextURLs){
        pages = await crawlPage(baseURL, nextURL, pages)
    }
    return pages
}

//     if(currentUrl)
//     console.log(`crawling ${currentURL}`);
//     try{
//         const response = await fetch(currentURL);
//         if(response.status > 399){
//             console.log(`Got HTTP error, status code: ${response.status}`);
//             return;
//         }
//         const contentType = response.headers.get('content-type');
//         if(!contentType.inlcludes('text/html')){
//             console.log(`Got non-html response: ${contentType}`);
//             return;
//         }
//         console.log(await response.text());
//     }catch(err){
//         console.log(err.message);
//     }
// }

const getURLsFromHTML = (htmlBody, baseURL) =>{
    const urls = [];
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window.document.querySelectorAll('a')
    for(const aElement of aElements){
        if(aElement.href.slice(0,1)  === '/'){
            try{
                urls.push(new URL(aElement.href,baseURL).href)
            }catch(err){
                console.log(`${err.message}: ${aElement.href}`)
            }
        }else{
            try{
                urls.push(new URL(aElement.href).href)
            }catch(err){
                console.log(`${err.message}: ${aElement.href}`)
            }
        }
    }
    return urls
}



const normalizeURL = (url)=>{
    const urlObject = new URL(url);
    let fullPath = `${urlObject.host}${urlObject.pathname}`
    if(fullPath.length>0 && fullPath.slice(-1)=== '/'){
        fullPath = fullPath.slice(0,-1);
    }
    return fullPath
}


module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
//print report takes an object and prints them to console

const printReport = (pages)=>{
    console.log("report is starting...");
    console.log("====================================");
    const sortedPages = sortPages(pages)
    for(const sortedPage of sortedPages){
        const url = sortedPage[0]
        const count = sortedPage[1]
        console.log(`Found ${count} internal links to ${url}`)
    }
}

//sortPages- it sorts the dict/objects into 
//a list of tuples(url,count)- in descending order

const sortPages = (pages)=>{
    const pagesArr = Object.entries(pages)
    pagesArr.sort((pageA, pageB) =>{
        return pageB[1] - pageA[1]
    })
    return pagesArr
}

module.exports ={
    printReport,
    sortPages
}
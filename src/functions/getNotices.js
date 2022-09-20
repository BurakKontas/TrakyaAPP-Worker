const cheerio = require("cheerio");
var createHTML = require('create-html')

const departments = {
    "muhendislik":{
        "noticeLink": "/news_cats/duyurular/",
        "web":"https://muhendislik.trakya.edu.tr",
        "bilmuh":"http://bilmuh.trakya.edu.tr",
        "eemuh" : "http://eemuh.trakya.edu.tr",
        "genbiyomuh" : "http://genbiyomuh.trakya.edu.tr",
        "gidamuh" : "http://gidamuh.trakya.edu.tr",
        "mahmuh" : "http://makmuh.trakya.edu.tr",
    }
}

const getHTML = async (department, section="web",page="") => {
    const response = await fetch(departments[department][section]+departments[department].noticeLink+page);
    const body = (await response.text());
    return body;
}

export const getPageCount = async (department, section="web") => {
    var body = await getHTML(department,section);
    var $ = cheerio.load(body)
    var max = 0;
    $(".pages")[0].childNodes.forEach((node) => {
        if(!isNaN(node.children[0].children[0].data)) max = Math.max(node.children[0].children[0].data,max)
    })
    return max;
}


export const getNotices = async (department,section="web",page=1) => {
    page = page.toString();
    const body = await getHTML(department,section,page);
    var $ = cheerio.load(body)
    var notices = [];
    $("#s-insert > div > div > div > ul.news_list.large li").each(function (i,elem) {     
        var obj = {
            date:"",
            title:"",
            link:"",
        }
        var linkNode = elem.childNodes[0]
        var dateNode = elem.childNodes[1]
        obj.date = dateNode.children[0].data;
        obj.link = linkNode.attribs.href;
        obj.title = linkNode.children[0].data;
        notices.push(obj)
    });
    return notices;
}

// export const Test = async () => {
//     const response = await fetch("https://bilmuh.trakya.edu.tr/news/visys-makine-yazilimci-ariyor");
//     const body = (await response.text());
//     var $ = cheerio.load(body)
//     return doc;
// }
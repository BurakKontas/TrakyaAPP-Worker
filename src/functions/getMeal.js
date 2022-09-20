import { getDate } from "../helpers/date";

const cheerio = require("cheerio");

const url = 'https://www.trakya.edu.tr/yemeklistesi';

export const getAllMeal = async () => {  
    try {
        const response = await fetch(url);
        const body = (await response.text());
        var $ = cheerio.load(body)
        var arr = [];
        $("#ylistTable div div").each(function(i,elem) {
            elem.childNodes.filter(node => node.type == "text").forEach(node => {
                var text = node.data.replace("\n","").trim();
                if(text != "") arr.push(text);
            });
        });
        var meals = [];

        var days = [];
        $("#ylistTable div h4").each(function (i,elem) {
            days.push(elem.childNodes[0].data.replace("BUGÜN",getDate()))
        });
        var kal = []
        $("#ylistTable div small").each(function (i,elem) {
            kal.push(elem.childNodes[0].data)
        });
        
        for (let i = 0; i < arr.length; i += 4) {
            var mealArr = arr.slice(i,i+4);
            var obj = {
                date:days.shift(),
                soup:mealArr[0],
                meal1:mealArr[1],
                meal2:mealArr[2],
                drink:mealArr[3],
                kal:kal.shift()
            }
            meals.push(obj);
        }
        return meals;
    } catch(err) {
        console.error(err)
    }
}

export const getTodayMeal = (allMeals) => {
    return allMeals.filter(meal => meal.date == getDate())[0];
}
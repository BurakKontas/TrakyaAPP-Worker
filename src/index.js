import { getAllMeal, getTodayMeal } from './functions/getMeal'
import { getNotices, getPageCount } from './functions/getNotices';

addEventListener('fetch', event => {
	if(!event.request.url.includes("/favicon.ico")) event.respondWith(handleRequest(event.request)); //sends 2 request with favicon.ico

});

// addEventListener('scheduled', event => {
// 	event.waitUntil(handleScheduled(event));
// });


/**
 * Respond with hello worker text
 * @param {Request} request
 */

/* 
	var data = await getAllMeal();
	var today = getTodayMeal(data)
	return new Response(JSON.stringify(today))
*/

/* 
	var pageCount = await getPageCount("muhendislik"); //will be dynamic with request.url
	var notices = [];
	notices.push(await getNotices("muhendislik","bilmuh"));
*/

async function handleRequest(request) {
	var fullURL = new URL(request.url)
	var origin = fullURL.origin;
	var pathname = fullURL.pathname;

	switch(pathname){
		case "/getmeal":
			var date = fullURL.searchParams.get("date");
			var data = await getAllMeal();
			if(date == "today") {
				var today = getTodayMeal(data)
				return new Response(JSON.stringify(today),{ status:200, headers:{
					"content-type":"application/json"
				}});
			} else if(date == "month") {
				return new Response(JSON.stringify(data),{ status:200, headers:{
					"content-type":"application/json"
				} })
			} else {
				return new Response("Bad Request",{status:400})
			}

		case "/getpagecount":
			var department = fullURL.searchParams.get("department");
			if(department == null) return new Response("Bad Request",{status:400})
			var section = (fullURL.searchParams.get("section") !== null) ? fullURL.searchParams.get("section") : "web";
			var pageCount = await getPageCount(department,section); //will be dynamic with request.url
			return new Response(JSON.stringify({department:department,section:section,pageCount:pageCount}),{ status:200 , headers:{
				"content-type":"application/json"
			}})		

		case "/getnotices":
			var department = fullURL.searchParams.get("department");
			if(department == null) return new Response("Bad Request",{status:400})
			var section = (fullURL.searchParams.get("section") !== null) ? fullURL.searchParams.get("section") : "web";
			var page = (fullURL.searchParams.get("page") !== null) ? fullURL.searchParams.get("page") : 1;
			var notices = await getNotices(department,section,page);
			var resp = { notices:notices, page:page };
			return new Response(JSON.stringify(resp),{ status:200 , headers:{
				"content-type":"application/json"
			}})		

		default:
			return new Response("404 Not Found",{ status:404 });
	}
}
		





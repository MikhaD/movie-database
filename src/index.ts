import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import create from "prompt-sync";
import { mediaType as MT } from "./enums";

const prompt = create();

const title = process.argv[2] || "The Thin Blue Line";
const mediaType: MT = process.argv.at(3)?.toLowerCase() === "series" ? MT.series : MT.movie;

const data = await fetch(`https://www.imdb.com/find?q=${title}`);
const document = new JSDOM(await data.text()).window.document;

const section = document.querySelector(".findSection");
if (section && section.querySelector(".findSectionHeader")?.textContent === "Titles") {
	console.log("ID       Title");
	const options = new Set();
	for (const element of section.querySelectorAll<HTMLElement>(".result_text")) {
		const id = element.querySelector("a")?.href.split("/").at(2);
		const text = extractTextLines(element)[0];
		console.log(id);
		console.log(text);
		const isSeries = /\(.*Series.*\)/m.test(text);
		// can have something like not movie, checking that its not a series, episode, short or game
		if (id && ((isSeries && mediaType === MT.series) || (!isSeries && mediaType === MT.movie))) {
			options.add(id);
			console.log(`${id.slice(2)}: ${text}`);
		}
	}
	let id = "";
	if (options.size === 1) {
		id = options.values().next().value;
	}
	else if (options.size > 1) {
		while (!options.has(id)) {
			id = `tt${prompt("Input the id of the correct option: ")}`;
		}
	}
	if (options.size > 0) {
		const url = `https://www.imdb.com/title/${id}`;
		const data = await fetch(url);
		const document = new JSDOM(await data.text()).window.document;
		const title = document.querySelector("h1")?.textContent;
		writeFileSync(`output/series/${title}.json`, JSON.stringify({
			title: title,
			imdb_rating: document.querySelector("iTLWoV")?.textContent,
			seasons: parseInt(document.querySelector("#browse-episodes-season")?.getAttribute("aria-label")?.split(" ").at(0) || "0"),
			year: document.querySelector(".rgaOW")?.textContent?.replace("–", "-"),
			imdb_page: url,
			genres: [...document.querySelectorAll(".GenresAndPlot__GenreChip-cum89p-3")].map(el => el.textContent),
			poster: document.querySelector(".ipc-image")?.getAttribute("src"),
			description: document.querySelector(".gwuUFD")?.textContent,
		}, null, "\t"));
	}
}

/**
 * Does what splitting the node's innerText on \n would have done in this scenario (jsdom doesn't support innerText)
 * @param node The node to extract the text from
 */
function extractTextLines(node: HTMLElement) {
	const lines: string[] = [];
	let line = "";
	function stepThrough(n: ChildNode) {
		for (const nd of n.childNodes) {
			if (nd.nodeName === "BR") {
				lines.push(line.trim());
				line = "";
			} else if (nd.nodeName === "#text") {
				line += nd.textContent;
			} else {
				stepThrough(nd);
			}
		}
	}
	stepThrough(node);
	lines.push(line.trim());
	return lines;
}
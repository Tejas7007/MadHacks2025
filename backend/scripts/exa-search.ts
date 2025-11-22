import { Exa } from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY!);

async function runSearch() {
  const query = "What did Alan Turing say about machine intelligence?";

  const results = await exa.search(query, {
    type: "deep",      // high-quality neural search with highlights
    numResults: 5,     // adjust as needed
    contents: false    // disable full page text payload
  });

  results.results.forEach((r, i) => {
    console.log(`\nResult ${i + 1}:`);
    console.log("URL:", r.url);
    console.log("Title:", r.title);

    if (r.highlights && r.highlights.length > 0) {
      console.log("Matched Passages:");
      r.highlights.forEach(h => console.log("  →", h));
    } else {
      console.log("  (No highlights)");
    }
  });
}

runSearch().catch(console.error);

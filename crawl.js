const axios = require("axios");
const cheerio = require("cheerio");

let html = "";

async function getHtml() {
  try {
    return await axios.get("https://www.kpx.or.kr/");
  } catch (error) {
    console.error(error);
  }
}

async function getSmp() {
  if (!html) {
    html = await getHtml();
  }

  const $ = cheerio.load(html.data);
  let smp = {};
  $("#m_contents .m_cont_lf .y_forecast_elec table")
    .find("tr")
    .each(function (index, elem) {
      switch ($(this).find("th").text().trim()) {
        case "거래일":
          smp["date"] = $(this)
            .find("td")
            .text()
            .replace(/([\t|\n|\s])/gi, "");
          break;
        case "최대":
          smp["max"] = $(this)
            .find("td")
            .text()
            .replace(/([\t|\n|\s])/gi, "");
          break;
        case "최소":
          smp["min"] = $(this)
            .find("td")
            .text()
            .replace(/([\t|\n|\s])/gi, "");
          break;
        case "평균":
          smp["avg"] = $(this)
            .find("td")
            .text()
            .replace(/([\t|\n|\s])/gi, "");
          break;
      }
    });

  return smp;
}

module.exports = { getSmp };

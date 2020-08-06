const axios = require("axios");
const cheerio = require("cheerio");

let html = "";

async function getHtml() {
  try {
    return await axios.get(
      "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun="
    );
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
  $("#content .caseTable .ca_body li")
    .first("dl")
    .each(function (index, elem) {
      switch ($(this).find("dt").text().trim()) {
        case "누적":
          smp[`sum`] = $(this)
            .find("dd")
            .text()
            .replace(/([\t|\n|\s])/gi, "");
          break;
      }
    });

  return smp;
}

module.exports = { getSmp };

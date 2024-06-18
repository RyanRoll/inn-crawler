import { JSDOM } from 'jsdom'
import notifier from 'node-notifier'
import chalk from 'chalk'
// import nodemailer  from 'nodemailer'

// for test
// const url = 'https://developer.mozilla.org/en-US/docs/Web/API/Response'

const defaultIntervalTime = 60 * 60

// args
const [
  ,
  ,
  sel_area = '27',
  sel_area_txt = '長野',
  intervalTime = defaultIntervalTime,
  email,
  password,
] = process.argv

// inn's target URL
const url = `https://www.toyoko-inn.com/china/search/result?chck_in=2024/11/06&inn_date=2&rsrv_num=1&sel_ldgngPpl=2&sel_area=${sel_area}&sel_area_txt=${encodeURIComponent(
  sel_area_txt,
)}&sel_htl=&rd_smk=&sel_room_clss_Id=20&sel_prkng=&sel_cnfrnc=&sel_hrtfll_room=&sel_whlchr=&sel_bath=&sel_rstrnt=&srch_key_word=&lttd=&lngtd=&pgn=1&sel_dtl_cndtn=on&prcssng_dvsn=dtl&`

const innPath = '#mainArea > section:nth-child(11) > h2 > em > a'
const roomTypePath =
  '#mainArea > section:nth-child(11) > div.tableWrap01 > table > tbody.clubCardCell > tr:nth-child(1) > td:nth-child(1)'
const roomPath =
  '#mainArea > section:nth-child(11) > div.tableWrap01 > table > tbody.clubCardCell > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > span'

async function crawl() {
  const response = await fetch(url)
  const html = await response.text()
  const dom = new JSDOM(html)
  const { document } = dom.window

  console.log(
    chalk.bgCyan.bold('目標飯站:', document.querySelector(innPath)?.innerHTML),
  )
  console.log(
    chalk.bgCyan.bold(
      '目標房型:',
      document
        .querySelector(roomTypePath)
        ?.innerHTML?.split('\t')?.[0]
        ?.replace?.('<br>', '-'),
    ),
  )
  const vacancyInfo = document.querySelector(roomPath)?.innerHTML
  console.log(chalk.white.bgRed.bold('房間剩餘:', vacancyInfo, '\r\n'))
  // show notification if available
  if (vacancyInfo.includes('剩')) {
    showNotification()
  }
}

async function sendEmail() {}

function showNotification() {
  notifier.notify({
    title: '有房間惹!!!!!!!!!!!',
    message: '你趕快上網訂房間吧!!!!!!',
    timeout: 3600,
  })
  process.exit(0)
}

function check() {
  const time = +intervalTime
  if (!time) {
    console.log(chalk.white.bgRed.bold(`指定的間隔時間不對 - ${time}`))
    process.exit(0)
  }
  crawl()
  setInterval(() => {
    crawl()
  }, time * 1000)
}

console.log(
  chalk.magenta(
    '<',
    '你的參數:',
    '[sel_area]',
    sel_area,
    '[sel_area_txt]',
    sel_area_txt,
    '[每次間隔]',
    `${+intervalTime / 3600}小時`,
    '>\r\n',
  ),
)

// go
check()

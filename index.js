import { JSDOM } from 'jsdom'
import notifier from 'node-notifier'
import chalk from 'chalk'
import nodemailer from 'nodemailer'

// for test
// const url = 'https://developer.mozilla.org/en-US/docs/Web/API/Response'

const defaultIntervalTime = 60 * 5 // 5 minutes

// args
const [
  ,
  ,
  pass,
  sel_area = '30',
  sel_area_txt = '愛知',
  intervalTime = defaultIntervalTime,
  email,
  password,
] = process.argv

// inn's target URL

const url = `https://www.toyoko-inn.com/china/search/result?lcl_id=zh_TW&chck_in=2024/11/02&inn_date=2&rsrv_num=1&sel_ldgngPpl=2&sel_area=${sel_area}&sel_area_txt=${encodeURIComponent(
  sel_area_txt,
)}}&sel_htl=00092&rd_smk=&sel_room_clss_Id=&sel_prkng=&sel_cnfrnc=&sel_hrtfll_room=&sel_whlchr=&sel_bath=&sel_rstrnt=&srch_key_word=&lttd=&lngtd=&pgn=1&sel_dtl_cndtn=&prcssng_dvsn=dtl&`

const innPath = '#mainArea > section:nth-child(6) > h2 > em > a'
const roomTypePath =
  '#mainArea > section:nth-child(6) > div.tableWrap01 > table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(1)'
const roomPath =
  '#mainArea > section:nth-child(6) > div.tableWrap01 > table > tbody:nth-child(3) > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > span'

async function crawl() {
  const response = await fetch(url)
  const html = await response.text()
  const dom = new JSDOM(html)
  const { document } = dom.window

  const now = new Date().toLocaleString()
  console.log(chalk.bgWhite.bold('\r\n\r\n查詢時間:', now))
  console.log(
    chalk.bgCyan.bold('目標飯店:', document.querySelector(innPath)?.innerHTML),
  )
  console.log(
    chalk.bgCyan.bold(
      '入住日期:',
      url.match(/chck_in=([^&]+)+&/)?.[1] ?? '???',
    ),
  )
  console.log(
    chalk.bgCyan.bold(
      '目標房型:',
      document
        .querySelector(roomTypePath)
        ?.innerHTML?.split('\t')?.[0]
        ?.replace?.('<br>', '-'),
      '(禁煙)',
    ),
  )
  const vacancyInfo = document.querySelector(roomPath)?.innerHTML

  // show notification if available
  if (vacancyInfo.includes('剩')) {
    console.log(chalk.white.bgGreen.bold('房間剩餘:', vacancyInfo, '\r\n'))
    sendEmail()
    showNotification()
  } else {
    console.log(chalk.white.bgRed.bold('房間剩餘:', vacancyInfo, '\r\n'))
  }
}

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'visionroll@gmail.com',
      pass,
    },
  })

  const mailOptions = {
    from: 'visionroll@gmail.com',
    // to: 'visionroll@gmail.com',
    to: 'Alumi.pu@gmail.com',
    subject: '[爬蟲] - 空房通知!!!!!!!!!!!',
    text: '還不快點去訂房: https://www.toyoko-inn.com/china/search/result?chck_in=2024/11/06&inn_date=2&rsrv_num=1&sel_ldgngPpl=2&sel_area=27&sel_area_txt=%E9%95%B7%E9%87%8E&sel_htl=&rd_smk=&sel_room_clss_Id=20&sel_prkng=&sel_cnfrnc=&sel_hrtfll_room=&sel_whlchr=&sel_bath=&sel_rstrnt=&srch_key_word=&lttd=&lngtd=&pgn=1&sel_dtl_cndtn=on&prcssng_dvsn=dtl&',
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Sent Email Error:', error.message)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}

function showNotification() {
  notifier.notify({
    title: '有房間惹!!!!!!!!!!!',
    message: '你趕快上網訂房間吧!!!!!!',
    timeout: 3600,
  })
  process.exit(0)
}

async function check() {
  const time = +intervalTime
  if (!time) {
    console.log(chalk.white.bgRed.bold(`指定的間隔時間不對 - ${time}`))
    process.exit(0)
  }
  await crawl()
  let runningTimer = showRunning()
  setInterval(async () => {
    clearInterval(runningTimer)
    await crawl()
    runningTimer = showRunning()
  }, time * 1000)
}

function showRunning() {
  const icons = ['⠙', '⠘', '⠰', '⠴', '⠤', '⠦', '⠆', '⠃', '⠋', '⠉']
  let x = 0
  return setInterval(() => {
    // loading += icons[x++]
    process.stdout.write(chalk.yellow(`\rRunning... ${icons[x++]}`))
    x %= icons.length
  }, 50)
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
    `${+intervalTime / 60}分鐘`,
    '>',
  ),
)

// go
// showRunning()
check()

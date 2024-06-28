## 第一次請安裝 - 新手

1. NodeJS 下載後並安裝 [https://nodejs.org/](https://nodejs.org/)
2. 下載 GIT [https://www.git-scm.com/downloads](https://www.git-scm.com/downloads)
3. 下載程式並解壓縮: [https://github.com/RyanRoll/inn-crawler/archive/refs/heads/master.zip](https://github.com/RyanRoll/inn-crawler/archive/refs/heads/master.zip)
4. 使用命令字元進入該資料夾 inn-crawler
5. 執行 $ npm install

## 更新程式 - 新手 - 僅限單一飯店

1. 再次下載程式並解壓縮: [https://github.com/RyanRoll/inn-crawler/archive/refs/heads/master.zip](https://github.com/RyanRoll/inn-crawler/archive/refs/heads/master.zip)
2. 使用命令字元進入該資料夾 inn-crawler
3. 執行 $ npm install

## 更新程式 - 如果你會 GIT 並下載好 NodeJS 和 GIT

1. 使用命令字元進入該資料夾 inn-crawler
2. $ git pull

- $ git checkout master // for 長野
- $ git checkout inn-30 // for 愛知

5. $ npm install

## 執行爬蟲

```bash

// pass is required to send an email

$ npm start "QQQQ QQQQ CCCC HHHH"

// or with parameters pass="", sel_area=27, sel_area_txt=長野, intervalTime=300    // 300 is 5 minutes

$ npm start "QQQQ QQQQ CCCC HHHH" 27 長野 1800

// or with parameters pass="", sel_area=30, sel_area_txt=愛知, intervalTime=300    // 300 is 5 minutes

$ npm start "QQQQ QQQQ CCCC HHHH" 30 愛知 300
```

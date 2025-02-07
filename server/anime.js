const express = require('express')
var router = express.Router();
const axios = require('axios')
const fetch = require('node-fetch')
const fs = require('fs')
const { getBuffer } = require('../lib/function')
const { dl } = require('../scraper/aiovideodl')

const mynimeku = require('../scraper/mynime')



async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


router.get('/mynimekuSearch', async(req, res) => {
  var query = req.query.query
  if (!query) return res.json({ message: 'masukan parameter query' })
  var result = await mynimeku.Search(query)
  if (result > 1) return res.json({ message: 'anime not found!' })
  res.json(result)
})

router.get('/mynimekuDetail', async(req, res) => {
  var link = req.query.link
	if (!link) return res.json({ message: 'masukan parameter Link' })
   var result = await mynimeku.animeDetail(link)
   res.json(result)
})

router.get('/mynimekuDownload', async(req, res) => {
  var link = req.query.link
	if (!link) return res.json({ message: 'masukan parameter Link' })
   var result = await mynimeku.downloadEps(link)
   res.json(result)
})

router.get('/storyanime', async(req, res) => {
  let res_ = await fetch('https://raw.githubusercontent.com/akuwaee/dbku/main/storyanime.json')
  let data = await res_.json()
  let json = data[Math.floor(Math.random() * data.length)]
  var dl_link = await dl(json)
  const buffer = await getBuffer(dl_link.medias[0].url)
  await fs.writeFileSync(__path +`/tmp/audio.mp4`, buffer)
  await res.sendFile(__path +`/tmp/audio.mp4`)
	
})


router.get('/storysad', async(req, res) => {
  let res_l = await fetch('https://raw.githubusercontent.com/akuwaee/dbku/main/storysad.json')
  let datal = await res_l.json()
  let jsonl = datal[Math.floor(Math.random() * datal.length)]
  var hasil = await musicaldown(jsonl)
	try {
		var data = await getBuffer(hasil.result.nowm)
		await fs.writeFileSync(__path +'/tmp/tiktok.mp4', data)
   		await res.sendFile(__path +'/tmp/tiktok.mp4')
	} catch(err) {
		console.log(err)
		res.json({ message: 'Ups, error' })
	}
})

module.exports = router

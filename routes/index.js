const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const PuppeteerScript = require('../scripts/pupScript');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'fileSystem/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get('/', function (req, res) {
  res.render('index');
});

router.post('/', upload.single('file'), async (req, res) => {
  req.file;

  await ReportController.generateJson();

  res.render('run-script');
});

router.get('/run-script', (req, res) => {
  res.render('run-script');
});

router.post('/run-script', async (req, res) => {
  await PuppeteerScript.runSearch();

  res.redirect('download-report');
});

router.get('/download-report', (req, res) => {
  res.render('download-report');
});

router.post('/download-report', async (req, res) => {

  await ReportController.downloadXLSX();

  res.redirect('/');
});

module.exports = router;

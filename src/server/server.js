const express = require('express');
const multer = require('multer');
const loadModel = require('../services/loadModel');
const inferenceService = require('../services/inferenceService');
const ClientError = require('../exception/ClientError');

const app = express();
const upload = multer({ dest: 'uploads/' });

let model;

// Memuat model secara asinkron
async function initializeModel() {
  try {
    model = await loadModel();
  } catch (error) {
    console.error('Gagal memuat model:', error);
  }
}

initializeModel(); // Memastikan model dimuat sebelum server dimulai

// Endpoint untuk menerima gambar dan melakukan prediksi
app.post('/predict', upload.single('image'), async (req, res) => {
  try {
    if (!model) {
      throw new ClientError('Model belum dimuat.');
    }

    const imagePath = req.file.path; // Path gambar yang di-upload
    const result = await inferenceService.predict(model, imagePath); // Lakukan prediksi

    res.json(result); // Kembalikan hasil prediksi
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mulai server
app.listen(8080, () => {
  console.log('Server berjalan di http://localhost:8080');
});
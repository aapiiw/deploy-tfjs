const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');

// Fungsi untuk membaca label dari file label.txt
async function readLabelsFromFile(filePath) {
  const labels = fs.readFileSync(filePath, 'utf-8').split('\n').map(line => JSON.parse(line.trim()));
  return labels;
}

// Fungsi untuk melakukan prediksi
async function predict(model, imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const image = await tf.node.decodeImage(imageBuffer);
  const resizedImage = tf.image.resizeBilinear(image, [224, 224]);  // Ukuran input untuk model
  const normalizedImage = resizedImage.div(tf.scalar(255));  // Normalisasi gambar
  const input = normalizedImage.expandDims(0).toFloat();

  const prediction = model.predict(input);
  const output = prediction.arraySync();

  // Baca label
  const labels = await readLabelsFromFile('./label.txt');

  // Ambil hasil prediksi
  const predictedLabelIndex = output[0].indexOf(Math.max(...output[0]));
  const predictedLabel = labels[predictedLabelIndex];

  // Confidence score
  const confidenceScore = Math.max(...output[0]) * 100;

  return {
    Prediksi_Label: predictedLabel.Predicted_Label,
    Id_Provinsi: predictedLabel.Id_Provinsi,
    Id_Motif: predictedLabel.Id_Motif,
    Skor_Akurasi: confidenceScore.toFixed(2)  // Tampilkan dengan 2 angka desimal
  };
}

module.exports = { predict };
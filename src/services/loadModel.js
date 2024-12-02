const tf = require('@tensorflow/tfjs-node');
const path = require('path');

async function loadModel() {
  const modelPath = path.join(__dirname, '../../model', 'model.json');
  const model = await tf.loadLayersModel(`file://${modelPath}`);
  console.log('Model berhasil dimuat');
  return model;
}

module.exports = loadModel;
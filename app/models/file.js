const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true
    },
    ip: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('File', fileSchema);

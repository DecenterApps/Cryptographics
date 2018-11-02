'use strict';

const mongoose = require('../../../../config/dbConnection');
const Schema = mongoose.Schema;

const assetPackBoughtSchema = new Schema({
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    packCoverSrc: {
      type: String,
      required: true,
    },
    ownerAddress: {
      type: String,
      required: true,
    },
    ownerUsername: {
      type: String,
      required: true,
    },
    ownerAvatar: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  });

module.exports = mongoose.db.model('AssetPackBought', assetPackBoughtSchema);

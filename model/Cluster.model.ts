import mongoose from "mongoose";

const ClusterModel = new mongoose.Schema({
  ServerName: {
    type: String,
    required: true,
  },
  IpAddress: {
    type: String,
    required: true,
  },
  Token: {
    type: String,
    required: true,
  },
});

const Cluster =
  mongoose.models.cluster || mongoose.model("cluster", ClusterModel);

export default Cluster;

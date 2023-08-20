import clusterSchema from "@/schema/cluster.schema";
import axios from "axios";
import { z } from "zod";
export default function GetClusters() {
  return axios
    .get("/api/cluster")
    .then(({ data }: { data: z.infer<typeof clusterSchema> }) => data);
}

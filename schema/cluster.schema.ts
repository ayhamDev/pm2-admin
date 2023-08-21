import { type } from "os";
import { z } from "zod";
export interface ICluster {
  ServerName: string;
  IpAddress: string;
}
export default z.object({
  ServerName: z.string().min(1),
  IpAddress: z.string().min(4),
  Token: z.string().min(12),
  _id: z.string().optional(),
});

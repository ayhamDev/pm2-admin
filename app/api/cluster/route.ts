import ConnectTodb from "@/db/ConnectTodb";
import Cluster from "@/model/Cluster.model";
import ClusterModel from "@/model/Cluster.model";
import clusterSchema from "@/schema/cluster.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    await ConnectTodb();
    const Cluster = await ClusterModel.find();
    return NextResponse.json(Cluster);
  } catch (err) {
    console.log(err);
    return NextResponse.json(err, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ConnectTodb();
    const data: z.infer<typeof clusterSchema> = await request.json();
    try {
      clusterSchema.parse(data);
      const Cluster = new ClusterModel({
        ServerName: data.ServerName,
        IpAddress: data.IpAddress,
        Token: data.Token,
      });
      await Cluster.save();
      return NextResponse.json(Cluster);
    } catch (err) {
      return NextResponse.json(err, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
interface IPutData extends z.infer<typeof clusterSchema> {
  _id: string;
}

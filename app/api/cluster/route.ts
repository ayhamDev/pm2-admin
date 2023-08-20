import ConnectTodb from "@/db/ConnectTodb";
import ClusterModel from "@/model/Cluster.model";
import clusterSchema from "@/schema/cluster.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    await ConnectTodb();
    const data: z.infer<typeof clusterSchema> = await request.json();
    const Cluster = new ClusterModel({
      ServerName: data.ServerName,
      IpAddress: data.IpAddress,
      Token: data.Token,
    });
    await Cluster.save();
    return NextResponse.json(Cluster);
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}

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

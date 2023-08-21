import ConnectTodb from "@/db/ConnectTodb";
import ClusterModel from "@/model/Cluster.model";
import clusterSchema from "@/schema/cluster.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectTodb();
    const { id } = params;
    const Cluster = await ClusterModel.findById(id);
    return NextResponse.json(Cluster);
  } catch (err) {
    console.log(err);
    return NextResponse.json(err, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectTodb();
    const data: z.infer<typeof clusterSchema> = await request.json();
    try {
      const { id } = params;

      const Cluster = await ClusterModel.findByIdAndUpdate(
        id,
        {
          ServerName: data.ServerName,
          IpAddress: data.IpAddress,
          Token: data.Token,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(Cluster);
    } catch (err) {
      return NextResponse.json(err, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectTodb();
    try {
      const { id } = params;

      const Cluster = await ClusterModel.findByIdAndDelete(id);
      return NextResponse.json(Cluster);
    } catch (err) {
      return NextResponse.json(err, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}

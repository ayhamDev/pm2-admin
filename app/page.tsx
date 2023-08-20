import Navbar from "@/components/Navbar";
import { Container } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import React from "react";
async function getList() {
  return console.log("server log");
}
export default function page() {
  return redirect("/cluster");
}

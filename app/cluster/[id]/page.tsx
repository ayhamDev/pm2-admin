import Navbar from "@/components/Navbar";
import { Container, Table, Heading, Flex } from "@radix-ui/themes";
import ProcessTable from "./components/ProcessTable";
import { redirect } from "next/navigation";

async function GetName(id: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/cluster/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return redirect("/cluster", "replace");
  return res.json();
}

export default async function page({ params }: { params: { id: string } }) {
  const Cluster = await GetName(params.id);

  return (
    <>
      <Navbar />
      <Container className="pt-28 px-6">
        <ProcessTable Cluster={Cluster} />
      </Container>
    </>
  );
}

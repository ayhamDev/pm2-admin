import Navbar from "@/components/Navbar";
import { Container, Table, Heading, Flex } from "@radix-ui/themes";
import ClusterTable from "@/app/cluster/components/ClusterTable";
import Link from "next/link";

export default function page() {
  return (
    <>
      <Navbar />
      <Container className="pt-28 px-6">
        <Link href={"/signin"}>Login</Link>
        <ClusterTable />
      </Container>
    </>
  );
}

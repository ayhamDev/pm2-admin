import Navbar from "@/components/Navbar";
import { Container, Table, Heading, Flex } from "@radix-ui/themes";
import ClusterTable from "@/app/cluster/components/ClusterTable";

export default function page() {
  return (
    <>
      <Navbar />
      <Container className="pt-28 px-6">
        <ClusterTable />
      </Container>
    </>
  );
}

import Navbar from "@/components/Navbar";
import {
  Container,
  Table,
  Heading,
  Flex,
  Button,
  IconButton,
} from "@radix-ui/themes";
import isMobile from "is-mobile";

export default function page() {
  return (
    <>
      <Navbar />
      <Container className="pt-28 px-6">
        <Flex mb={"4"} justify={"between"} align={"center"}>
          <Heading>Cluster Manager</Heading>
          <Button variant="outline">Add Cluster</Button>
        </Flex>
        <Table.Root variant="surface" size={isMobile() ? "1" : "3"}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Ip Address</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>Petrais Server</Table.RowHeaderCell>
              <Table.Cell>192.168.82.4</Table.Cell>
              <Table.Cell>
                <span className="px-4 py-1 text-white s bg-red-500 font-extrabold rounded-full">
                  Offline
                </span>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell>Petrais Server</Table.RowHeaderCell>
              <Table.Cell>192.168.82.4</Table.Cell>
              <Table.Cell>
                <span className="px-4 py-1 text-white bg-yellow-500 font-extrabold rounded-full">
                  Online
                </span>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Container>
    </>
  );
}

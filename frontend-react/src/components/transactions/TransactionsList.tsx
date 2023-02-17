import {
  Box,
  CircularProgress,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { useGetPrimaryAccountTransactionsQuery } from "../../apis/coinbaseApi";

const TransactionsList: React.FC = () => {
  const { data, isLoading } = useGetPrimaryAccountTransactionsQuery(undefined);
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th isNumeric>Amount (Crypto)</Th>
            <Th isNumeric>Amount (Native)</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.data &&
            data.data.map((trans: any) => (
              <Tr>
                <Td>{trans.created_at}</Td>
                <Td>{trans.type}</Td>
                <Td isNumeric>{trans.amout.amout}</Td>
                <Td isNumeric>{trans.native_amount.amount}</Td>
                <Td>{trans.status}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
      {isLoading && (
        <Box display="flex" justifyContent="center" m={6}>
          <CircularProgress value={30} size="120px" />
        </Box>
      )}
    </TableContainer>
  );
};
export default TransactionsList;

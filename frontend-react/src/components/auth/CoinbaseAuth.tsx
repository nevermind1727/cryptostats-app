import { Box, Button } from "@chakra-ui/react";

const CoinbaseAuth: React.FC = () => {
  const handleCoinbaseConnection = () => {
    if (process.env.REACT_APP_COINBASE_AUTH_URL) {
      window.location.href = process.env.REACT_APP_COINBASE_AUTH_URL;
    }
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="100vh"
    >
      <Button
        colorScheme="blue"
        variant="solid"
        onClick={handleCoinbaseConnection}
      >
        Connect Coinbase
      </Button>
    </Box>
  );
};

export default CoinbaseAuth;

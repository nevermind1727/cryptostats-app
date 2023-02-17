import { useAppSelector } from "../app/hooks";
import CoinbaseAuth from "../components/auth/CoinbaseAuth";
import TransactionsList from "../components/transactions/TransactionsList";

const HomePage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <>{user?.isCoinbaseAuthorized ? <TransactionsList /> : <CoinbaseAuth />}</>
  );
};

export default HomePage;

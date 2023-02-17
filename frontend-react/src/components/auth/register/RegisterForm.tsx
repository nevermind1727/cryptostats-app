import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../../apis/usersApi";
import { setAuthState } from "../../../app/slices/authSlice";
import { useLoginUserMutation } from "../../../apis/authApi";
import { useAppDispatch } from "../../../app/hooks";
import { UserResponse } from "../../../utils/types";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isEmailErrored, setIsEmailErrored] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [isPasswordErrored, setIsPasswordErrored] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [createUser] = useCreateUserMutation();
  const [loginUser] = useLoginUserMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setIsEmailErrored(true);
      return;
    } else {
      setIsEmailErrored(false);
    }

    if (!password) {
      setIsPasswordErrored(true);
      return;
    } else {
      setIsPasswordErrored(false);
    }
    await createUser({ email, password });

    const response = (await loginUser({ email, password })) as {
      data: UserResponse;
    };
    dispatch(setAuthState(response.data));
    navigate("/");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      h="100vh"
      gap={8}
    >
      <Text fontSize="4xl">CryptoStats</Text>
      <Stack gap={2}>
        <FormControl isRequired isInvalid={isEmailErrored}>
          <FormLabel>Email address</FormLabel>
          <Input
            variant="outline"
            type="email"
            placeholder="Enter your email"
            w={240}
            isRequired
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormErrorMessage>Email is required.</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={isPasswordErrored}>
          <FormLabel>Password</FormLabel>
          <Input
            variant="outline"
            type="password"
            placeholder="Enter your password"
            w={240}
            isRequired
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormErrorMessage>Password is required.</FormErrorMessage>
        </FormControl>
        <Text>
          Already have an account?{" "}
          <Link
            as={ReactRouterLink}
            to="/auth/login"
            color="blue.300"
            textDecoration="underlined"
          >
            Log In.
          </Link>
        </Text>
        <Button
          type="submit"
          colorScheme="blue"
          variant="solid"
          onClick={handleRegister}
        >
          Sign Up
        </Button>
      </Stack>
    </Box>
  );
};

export default RegisterForm;

import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  Card,
  CardBody,
  useToast,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { ArrowBackIcon } from "@chakra-ui/icons";

const CFaLock = chakra(FaLock);

const Login = (props) => {
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const handleTabs = props.handleTabsChange;
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordShow, setForgotPasswordShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true,
    });
  };

  const handleLogin = async function (e) {
    e.preventDefault();
  
    if (!email) {
      showToast("Error", "Email is required", "error");
      return;
    }
  
    if (!password && !otp) {
      showToast("Error", "Password or OTP is required", "error");
      return;
    }

    try {
      setIsLoggingIn(true);
      
      setTimeout(() => {
        showToast("Login successful", "You are now logged in", "success");
        
        console.log("Navigating to dashboard");
        
        setIsLoggingIn(false);
      }, 1500);
      
    } catch (error) {
      showToast("Error", "Login failed", "error");
      setIsLoggingIn(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setSending(true);

    // Simulate OTP sending
    setTimeout(() => {
      showToast("OTP sent", "OTP sent to your email", "success");
      setSending(false);
    }, 1500);
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="70vh"
      justifyContent="center"
      alignItems="center"
      borderRadius={15}
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="purple.300" />
        <Heading color="purple.400">Welcome Back</Heading>
        <Card minW={{ base: "90%", md: "468px" }} borderRadius={15} shadow={0}>
          <CardBody p={0}>
            <form>
              <Stack spacing={4}>
                {forgotPasswordShow && (
                  <Tooltip label="login" aria-label="A tooltip">
                    <Button
                      w={"fit-content"}
                      onClick={() => setForgotPasswordShow(false)}
                    >
                      <ArrowBackIcon />
                    </Button>
                  </Tooltip>
                )}
                <FormControl display={"flex"}>
                  <InputGroup
                    borderEndRadius={"10px"}
                    borderStartRadius={"10px"}
                    size={"lg"}
                  >
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Email address"
                      focusBorderColor="purple.500"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </InputGroup>
                  {forgotPasswordShow && (
                    <Button
                      m={1}
                      fontSize={"sm"}
                      onClick={(e) => handleSendOtp(e)}
                      isDisabled={sending}
                    >
                      {sending ? <Spinner size="sm" /> : "Send OTP"}
                    </Button>
                  )}
                </FormControl>

                {!forgotPasswordShow && (
                  <FormControl>
                    <InputGroup
                      borderEndRadius={"10px"}
                      borderStartRadius={"10px"}
                      size={"lg"}
                    >
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.300"
                        children={<CFaLock color="gray.300" />}
                      />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        focusBorderColor="purple.500"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      <InputRightElement mx={1}>
                        <Button
                          fontSize={"x-small"}
                          size={"xs"}
                          onClick={handleShowClick}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText textAlign="right">
                      <Link onClick={() => setForgotPasswordShow(true)}>
                        Forgot password?
                      </Link>
                    </FormHelperText>
                  </FormControl>
                )}
                {forgotPasswordShow && (
                  <FormControl>
                    <InputGroup
                      borderEndRadius={"10px"}
                      borderStartRadius={"10px"}
                      size={"lg"}
                    >
                      <Input
                        id={"otp"}
                        type="number"
                        placeholder="Enter OTP"
                        focusBorderColor="purple.500"
                        onChange={(e) => setOtp(e.target.value)}
                        value={otp}
                      />
                    </InputGroup>
                  </FormControl>
                )}
                <Button
                  borderRadius={10}
                  type="submit"
                  variant="solid"
                  colorScheme="purple"
                  width="full"
                  onClick={handleLogin}
                  isLoading={isLoggingIn}
                  loadingText="Logging in"
                >
                  {forgotPasswordShow ? "Login using OTP" : "Login"}
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
      </Stack>
      <Box>
        New to us?{" "}
        <Link color="purple.500" onClick={() => handleTabs(1)}>
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};

export default Login;
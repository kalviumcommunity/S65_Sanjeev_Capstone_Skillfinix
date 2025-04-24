import { useState, useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import chatContext from "../../context/chatContext";

const CFaLock = chakra(FaLock);

const Login = ({ handleTabsChange }) => {
  const context = useContext(chatContext);
  const { hostName, socket, setUser, setIsAuthenticated, fetchData } = context;

  const toast = useToast();
  const navigator = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordShow, setForgotPasswordShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast("Error", "Email is required", "error");
      return;
    }

    if (!password && !otp) {
      showToast("Error", "Password or OTP is required", "error");
      return;
    }

    const data = { email };
    if (otp?.length > 0 && forgotPasswordShow) {
      data.otp = otp;
    } else {
      data.password = password;
    }

    try {
      setIsLoggingIn(true);

      const response = await fetch(`${hostName}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const resdata = await response.json();

      localStorage.setItem("token", resdata.authtoken);
      localStorage.setItem("user", JSON.stringify(resdata.user));

      setUser(resdata.user);
      socket.emit("setup", resdata.user._id);
      setIsAuthenticated(true);

      await fetchData();

      showToast("Login successful", "You are now logged in", "success");

      setTimeout(() => {
        navigator("/dashboard");
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      showToast("Error", error.message || "Login failed", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setSending(true);

    const data = { email };

    try {
      const response = await fetch(`${hostName}/auth/getotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resdata = await response.json();

      if (response.status !== 200) {
        showToast("An error occurred.", resdata.error, "error");
      } else {
        showToast("OTP sent", "OTP sent to your email", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Error", "Failed to send OTP", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <Flex flexDirection="column" width="100wh" height="70vh" justifyContent="center" alignItems="center" borderRadius={15}>
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar bg="purple.300" />
        <Heading color="purple.400">Welcome Back</Heading>
        <Card minW={{ base: "90%", md: "468px" }} borderRadius={15} shadow={0}>
          <CardBody p={0}>
            <form>
              <Stack spacing={4}>
                {forgotPasswordShow && (
                  <Tooltip label="Login" aria-label="A tooltip">
                    <Button w={"fit-content"} onClick={() => setForgotPasswordShow(false)}>
                      <ArrowBackIcon />
                    </Button>
                  </Tooltip>
                )}
                <FormControl display={"flex"}>
                  <InputGroup size={"lg"}>
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
                    <Button m={1} fontSize={"sm"} onClick={handleSendOtp} isDisabled={sending}>
                      {sending ? <Spinner size="sm" /> : "Send OTP"}
                    </Button>
                  )}
                </FormControl>

                {!forgotPasswordShow && (
                  <FormControl>
                    <InputGroup size={"lg"}>
                      <InputLeftElement pointerEvents="none" children={<CFaLock color="gray.300" />} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        focusBorderColor="purple.500"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      <InputRightElement mx={1}>
                        <Button fontSize={"x-small"} size={"xs"} onClick={handleShowClick}>
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText textAlign="right">
                      <Link onClick={() => setForgotPasswordShow(true)}>Forgot password?</Link>
                    </FormHelperText>
                  </FormControl>
                )}

                {forgotPasswordShow && (
                  <FormControl>
                    <InputGroup size={"lg"}>
                      <Input
                        id="otp"
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
        <Link color="purple.500" onClick={() => handleTabsChange(1)}>
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};

export default Login;
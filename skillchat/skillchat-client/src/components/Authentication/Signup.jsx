import { useState, useContext } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Box,
  Link,
  Avatar,
  FormControl,
  InputRightElement,
  Card,
  CardBody,
  useToast,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import chatContext from "../../context/chatContext";

const Signup = (props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const context = useContext(chatContext);
  const { setUser, setIsAuthenticated } = context;

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabs = props.handleTabsChange;

  function showToast(title, description, status = "error") {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true,
    });
  }

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (email === "" || name === "" || password === "") {
      showToast("Error", "All fields are required");
      return;
    } else if (name.length > 20 || name.length < 3) {
      showToast("Error", "Name should be at least 3 and at most 20 characters long");
      return;
    } else if (!email.includes("@") || !email.includes(".")) {
      showToast("Error", "Invalid email");
      return;
    } else if (email.length > 50) {
      showToast("Error", "Email should be at most 50 characters long");
      return;
    } else if (password.length < 8 || password.length > 20) {
      showToast("Error", "Password should be between 8 and 20 characters");
      return;
    } else if (password !== confirmPassword) {
      showToast("Error", "Passwords do not match");
      return;
    } 
    
    setIsSubmitting(true);
    
    try {
      // Make actual API call to your backend
      const hostName = process.env.REACT_APP_API_URL || "http://localhost:5001";
      const response = await fetch(`${hostName}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token in localStorage (use "token" to match ChatState.js)
        localStorage.setItem('token', data.authtoken);
        
        showToast("Success", "Account created successfully", "success");
        
        // Switch to login tab
        handleTabs(0);
        
      } else {
        showToast("Error", data.error || "Registration failed");
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      showToast("Error", "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100%"
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
        <Heading color="purple.400">Welcome</Heading>
        <Card minW={{ base: "90%", md: "468px" }} borderRadius={15} shadow={0}>
          <CardBody p={0}>
            <form onSubmit={handleSignup}>
              <Stack spacing={4}>
                <FormControl>
                  <InputGroup
                    borderEndRadius={"10px"}
                    borderStartRadius={"10px"}
                    size={"lg"}
                  >
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      focusBorderColor="purple.500"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <InputGroup
                    borderEndRadius={"10px"}
                    borderStartRadius={"10px"}
                    size={"lg"}
                  >
                    <Input
                      type="email"
                      placeholder="Email address"
                      focusBorderColor="purple.500"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <InputGroup
                    borderEndRadius={"10px"}
                    borderStartRadius={"10px"}
                    size={"lg"}
                  >
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<LockIcon color="gray.300" />}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      focusBorderColor="purple.500"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                    <InputRightElement mx={1}>
                      <Button
                        fontSize={"x-small"}
                        size={"xs"}
                        onClick={handleShowClick}
                        type="button"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  <InputGroup
                    borderEndRadius={"10px"}
                    borderStartRadius={"10px"}
                    size={"lg"}
                    my={4}
                  >
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<LockIcon color="gray.300" />}
                    />
                    <Input
                      textOverflow={"ellipsis"}
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      focusBorderColor="purple.500"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      required
                    />
                    <InputRightElement mx={1}>
                      <Button
                        fontSize={"x-small"}
                        size={"xs"}
                        onClick={handleShowClick}
                        type="button"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button
                  borderRadius={10}
                  type="submit"
                  variant="solid"
                  colorScheme="purple"
                  width="full"
                  isLoading={isSubmitting}
                  loadingText="Creating account"
                >
                  Signup
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
      </Stack>
      <Box>
        Already have account?{" "}
        <Link color="purple.500" onClick={() => handleTabs(0)}>
          Login
        </Link>
      </Box>
    </Flex>
  );
};

export default Signup;
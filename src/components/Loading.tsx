import React from "react";
import { Spinner, Box } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Box
      height="100vh"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      top="0"
      left="0"
      bgColor={"white"}
      zIndex={999}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  );
};

export default Loading;

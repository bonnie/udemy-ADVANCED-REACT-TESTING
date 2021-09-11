import { Box, Heading } from "@chakra-ui/react";

import { BackgroundImage } from "./BackgroundImage";

export function Home(): React.ReactElement {
  return (
    <Box>
      <BackgroundImage />
      <Box
        maxWidth="450px"
        backgroundColor="rgba(20, 20, 20, 0.9)"
        borderRadius="10px"
        p={10}
        m={10}
        alignSelf="center"
      >
        <Heading align="center" textColor="gray.100">
          Welcome to
          <br />
          Popular Music Venue
        </Heading>
      </Box>
    </Box>
  );
}

/* eslint-disable max-lines-per-function */
import { Flex, Heading, Stack } from "@chakra-ui/react";
import { ReactElement } from "react";
import { Redirect } from "react-router-dom";

import { useUser } from "../hooks/useUser";

export function UserProfile(): ReactElement {
  const { user } = useUser();

  if (!user) {
    return <Redirect to="/signin" />;
  }

  return (
    <Flex minH="84vh" align="center" justify="center">
      <Stack spacing={8} mx="auto" w="xl" py={12} px={6}>
        <Stack align="center">
          <Heading>Hi, {user.email}</Heading>
        </Stack>
      </Stack>
    </Flex>
  );
}

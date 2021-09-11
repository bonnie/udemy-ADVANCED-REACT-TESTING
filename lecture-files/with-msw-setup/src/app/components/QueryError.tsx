import { Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";

export function QueryError({
  message,
}: {
  message: string;
}): React.ReactElement {
  return (
    <VStack align="center" bgColor="red.700" p={10} rounded="lg">
      <Heading size="md">{message}</Heading>
      <Text>please try again later</Text>
    </VStack>
  );
}

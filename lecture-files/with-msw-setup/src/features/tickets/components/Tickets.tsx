/* eslint-disable @typescript-eslint/no-shadow */
import {
  Box,
  Button,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useHistory, useParams } from "react-router";

import { LoadingSpinner } from "../../../app/components/LoadingSpinner";
import { QueryError } from "../../../app/components/QueryError";
import { formatDate, generateRandomId } from "../../../app/utils";
import { useGetShowByIdQuery } from "../redux/showApi";

export function Tickets(): React.ReactElement {
  const { showId } = useParams<{ showId: string }>();
  const {
    data: show,
    error,
    isLoading,
  } = useGetShowByIdQuery(showId, {
    refetchOnMountOrArgChange: true,
  });
  const [reservedSeatCount, setReservedSeatCount] = React.useState("2");
  const history = useHistory();

  const onSubmit = () => {
    history.push(
      `/confirm/${showId}?holdId=${generateRandomId()}&seatCount=${reservedSeatCount}`
    );
  };

  if (error) return <QueryError message="Could not retrieve show info" />;

  return (
    <Stack align="center" spacing={10}>
      <LoadingSpinner display={isLoading} />

      {show === undefined ? null : (
        <VStack spacing={2}>
          <Heading mt={10} size="md">
            Reserve your seats for
          </Heading>
          <Heading>{show.band.name}</Heading>
          <Text size="lg">{formatDate(show.scheduledAt)}</Text>
          {show.availableSeatCount === 0 ? (
            <Heading color="red.500">Show is sold out!</Heading>
          ) : (
            <>
              <Heading
                size="md"
                color={show.availableSeatCount < 10 ? "red.500" : "inherit"}
              >
                {show.availableSeatCount} seats left
              </Heading>
              <HStack pt={10} pb={3}>
                <NumberInput
                  // size="xl"
                  value={reservedSeatCount}
                  onChange={(value) => setReservedSeatCount(value)}
                  min={1}
                  max={Math.min(8, show.availableSeatCount)}
                  precision={0}
                  color="gray.100"
                  maxWidth="80px"
                  name="availableSeatCount"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Heading size="md">Tickets</Heading>
              </HStack>
              <Box align="center">
                <Button onClick={onSubmit}>purchase</Button>
              </Box>
            </>
          )}
        </VStack>
      )}
    </Stack>
  );
}

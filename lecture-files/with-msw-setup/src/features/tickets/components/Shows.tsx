import {
  Box,
  Button,
  Heading,
  Link,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router";

import { LoadingSpinner } from "../../../app/components/LoadingSpinner";
import { QueryError } from "../../../app/components/QueryError";
import { formatDate } from "../../../app/utils";
import { useGetAllShowsQuery } from "../redux/showApi";

const oneMinute = 60000;

export function Shows(): React.ReactElement {
  const {
    data: shows,
    error,
    isLoading,
  } = useGetAllShowsQuery(null, {
    refetchOnMountOrArgChange: true,
    pollingInterval: oneMinute,
  });

  const history = useHistory();

  if (!!error && !shows)
    return <QueryError message="Could not retrieve shows" />;

  return (
    <Stack align="center" spacing={10}>
      <LoadingSpinner display={isLoading} />
      <Heading mt={10}>Upcoming Shows</Heading>
      <List width="100%" alignContent="center" pb={10}>
        {shows?.map((show) => (
          <ListItem
            key={show.id}
            width="100%"
            display="flex"
            mb={10}
            alignItems="center"
          >
            <Box mr={5} width="30%" textAlign="right">
              {formatDate(show.scheduledAt)}
            </Box>
            <Box width="10%" textAlign="center">
              {show.availableSeatCount <= 0 ? (
                <Heading size="md" color="red.500">
                  sold out
                </Heading>
              ) : (
                <Button onClick={() => history.push(`/tickets/${show.id}`)}>
                  tickets
                </Button>
              )}
            </Box>
            <Box ml={5} width="60%" textAlign="left">
              <Link href={`/bands/${show.band.id}`}>
                <Heading size="md">
                  {show.band.name.toLocaleLowerCase()}
                </Heading>
              </Link>
              <Text fontStyle="italic" color="gray.400" fontFamily="Lato">
                {show.band.description}
              </Text>
            </Box>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

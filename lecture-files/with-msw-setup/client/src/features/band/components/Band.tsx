import { Box, Heading, Image, Link, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router";

import { imageUrl } from "../../../app/axios/constants";
import { LoadingSpinner } from "../../../app/components/LoadingSpinner";
import { QueryError } from "../../../app/components/QueryError";
import { useGetBandByIdQuery } from "../redux/bandApi";

export function Band(): React.ReactElement {
  const { bandId } = useParams<{ bandId: string }>();
  const { data: band, error, isLoading } = useGetBandByIdQuery(bandId);

  if (!!error && !band)
    return <QueryError message="Could not retrieve band data" />;

  return (
    <Box m={5} pt={5} align="center">
      <LoadingSpinner display={isLoading} />
      <VStack display={band ? "inherit" : "none"}>
        <Heading>{band?.name}</Heading>
        <Text fontSize="xl" pb={5}>
          {band?.description}
        </Text>
        <Image
          maxWidth="70%"
          maxHeight="28em"
          src={`${imageUrl}/${band?.image.fileName}`}
          alt="band photo"
        />

        <Text
          fontStyle="italic"
          color="gray.300"
          fontFamily="Lato"
          fontSize="sm"
        >
          photo by{" "}
          <Link href={band?.image.authorLink} isExternal>
            {band?.image.authorName}
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}

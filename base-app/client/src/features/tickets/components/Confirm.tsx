import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import React from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { useHistory, useParams } from "react-router";
import { useLocation } from "react-router-dom";

import { HoldReservation } from "../../../../../shared/types";
import { useWillUnmount } from "../../../app/hooks/useWillUnmount";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { generateRandomId } from "../../../app/utils";
import { useUser } from "../../auth/hooks/useUser";
import { showToast } from "../../toast/redux/toastSlice";
import {
  holdTickets,
  resetTransaction,
  startTicketAbort,
  startTicketPurchase,
  startTicketRelease,
} from "../redux/ticketSlice";
import { TicketAction, TransactionStatus } from "../types";

const fiveMinutes = 300000;
// const fiveSeconds = 5000;

export function Confirm(): React.ReactElement {
  const { showId: showIdString } = useParams<{ showId: string }>();
  const showId = Number(showIdString);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const userId = user.id;
  const transactionStatus = useAppSelector(
    (state) => state.tickets.transactionStatus
  );

  const query = new URLSearchParams(useLocation().search);
  const seatCount = query.get("seatCount");
  const holdId = query.get("holdId");

  const holdReservation: HoldReservation = {
    id: Number(holdId),
    showId,
    seatCount: Number(seatCount),
    userId,
    type: TicketAction.hold,
  };

  // start the reservation on mount if required data is present
  React.useEffect(() => {
    if (!seatCount || !holdId) {
      dispatch(showToast({ title: "error holding seats", status: "error" }));
      history.push(`/tickets/${showId}`);
    } else {
      dispatch(holdTickets(holdReservation));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // redirect to shows once transaction is complete
  React.useEffect(() => {
    if (transactionStatus === TransactionStatus.completed) {
      dispatch(resetTransaction());
      history.push("/shows");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatus]);

  // cancel transaction if user navigates away
  useWillUnmount(() => {
    dispatch(
      startTicketAbort({
        reservation: holdReservation,
        reason: "ticket hold canceled",
      })
    );
  });

  const cancelPurchase = () => {
    dispatch(
      startTicketRelease({
        reservation: holdReservation,
        reason: "ticket hold canceled",
      })
    );
    history.push("/shows");
  };

  const confirmPurchase = () => {
    dispatch(
      startTicketPurchase({
        purchaseReservation: {
          id: generateRandomId(),
          showId,
          seatCount: Number(seatCount),
          userId,
          type: TicketAction.purchase,
        },
        holdReservation,
      })
    );
  };

  const countdownRenderer: CountdownRendererFn = ({
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      dispatch(
        startTicketRelease({
          reservation: holdReservation,
          reason: "ticket hold expired",
        })
      );
      return null;
    }
    const paddedSeconds = seconds >= 10 ? seconds : `0${seconds}`;
    return (
      <Text fontSize="xl">
        {minutes}:{paddedSeconds}
      </Text>
    );
  };

  return (
    <Stack align="center">
      <Heading mt={10}>Confirm Your Purchase</Heading>
      <Text>Tickets will be held for</Text>
      <Countdown date={Date.now() + fiveMinutes} renderer={countdownRenderer} />
      <HStack>
        <Button variant="outline" onClick={cancelPurchase}>
          Cancel
        </Button>
        <Button onClick={confirmPurchase}>Confirm</Button>
      </HStack>
    </Stack>
  );
}

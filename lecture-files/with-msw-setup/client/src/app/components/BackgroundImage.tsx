import { Image } from "@chakra-ui/react";
import { ReactElement } from "react";

import splashImg from "../images/heart-hands.jpg";

export function BackgroundImage(): ReactElement {
  return (
    <Image
      minHeight="100%"
      minWidth="1024px"
      width="100%"
      height="auto"
      position="fixed"
      top="0"
      left="0"
      zIndex="-1"
      src={splashImg}
      alt="concert fan with hands in the shape of a heart"
    />
  );
}

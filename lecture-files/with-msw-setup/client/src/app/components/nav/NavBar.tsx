import { Box, Button, Flex, HStack, Icon, Link } from "@chakra-ui/react";
import { GiGuitarBassHead } from "react-icons/gi";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { useUser } from "../../../features/auth/hooks/useUser";
import { signOut } from "../../../features/auth/redux/authSlice";
import { useAppDispatch } from "../../store/hooks";

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    as={RouterLink}
    px={2}
    py={1}
    rounded="md"
    color="slate.200"
    _hover={{
      textDecoration: "none",
      color: "gray.500",
    }}
    to={to}
  >
    {children}
  </Link>
);

export function NavBar(): React.ReactElement {
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const Links = [
    { display: "Shows", route: "shows" },
    { display: "My Account", route: user ? "profile" : "signIn" },
  ];

  return (
    <Box bg="rgba(60, 60, 60, 0.6)" px={4} style={{ fontFamily: "Unica One" }}>
      <Flex h={16} alignItems="center" justify="space-between">
        <HStack spacing={8} alignItems="center">
          <NavLink to="/">
            <Icon w={8} h={8} as={GiGuitarBassHead} />
          </NavLink>
          <HStack as="nav" spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.display} to={`/${link.route}`}>
                {link.display}
              </NavLink>
            ))}
          </HStack>
        </HStack>
        <HStack>
          {user ? (
            <>
              <p>{user.email}</p>
              <Button bgColor="gray.800" onClick={() => dispatch(signOut())}>
                Sign out
              </Button>
            </>
          ) : (
            <Button bgColor="gray.800" onClick={() => history.push("/signin")}>
              Sign in
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

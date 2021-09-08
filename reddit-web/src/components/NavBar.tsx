import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

type NavBarProps = {

};

const NavBar: React.FC<NavBarProps> = () => {
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    });
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    let body = null;

    // If fetching
    if (fetching) {
        body = null;
    } else if (!data?.me) { // not logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link color="white" mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white">Register</Link>
                </NextLink>
            </>
        )
    } else { // logged in
        body = (
            <Flex>
                <Box color="white" mr={4}>{data.me.userName}</Box>
                <Button variant="link" onClick={() => logout()} isLoading={logoutFetching}>logout</Button>
            </Flex>
        )
    }

    return (
        <Flex p={4} bg="tan" position="sticky" zIndex={1} top={0}>
            <Box ml="auto">
                {body}
            </Box>
        </Flex>
    );
};

export default NavBar;
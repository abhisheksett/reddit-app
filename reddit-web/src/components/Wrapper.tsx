import { Box } from "@chakra-ui/react"

type WrapperProps = {
    variant?: 'small' | 'regular';
};

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
    return (
        <Box mx="auto" mt={8} w="100%" maxW={variant === 'regular' ? "800px" : "400px"}>
            {children}
        </Box>
    )
}

export default Wrapper;
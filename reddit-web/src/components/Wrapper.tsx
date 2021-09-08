import { Box } from "@chakra-ui/react"

export type WrapperVariant = 'small' | 'regular';

type WrapperProps = {
    variant?: WrapperVariant;
};

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
    return (
        <Box mx="auto" mt={8} w="100%" maxW={variant === 'regular' ? "800px" : "400px"}>
            {children}
        </Box>
    )
}

export default Wrapper;
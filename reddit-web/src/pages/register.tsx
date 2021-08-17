
import { Formik, Form } from 'formik';
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';

interface registerProps {

}

const Register: React.FC<registerProps> = () => {
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ userName: '', password: '' }} onSubmit={() => { }}>
                {({ isSubmitting }) => {
                    <Form>
                        <InputField name="username" placeholder="Username" label="username" />
                        <Box mt={4}>
                            <InputField name="password" placeholder="password" label="password" type="password" />
                        </Box>
                        <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
                            Register
                        </Button>
                    </Form>
                }}
            </Formik>
        </Wrapper>
    );
};

export default Register;
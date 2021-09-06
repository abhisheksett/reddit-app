
import { Formik, Form } from 'formik';
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Login: React.FC<{}> = () => {
    const [, login] = useLoginMutation();
    const router = useRouter();

    const submit = async (values: any, { setErrors }: any) => {
        console.log(values)
        const response = await login(values);
        if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
        } else if (response.data?.login.user) {
            router.push("/");
        }
    };
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ usernameOrEmail: '', password: '' }} onSubmit={submit}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="usernameOrEmail" placeholder="Username or email" label="Username or email" />
                        <Box mt={4}>
                            <InputField name="password" placeholder="password" label="password" type="password" />
                        </Box>
                        <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(Login);
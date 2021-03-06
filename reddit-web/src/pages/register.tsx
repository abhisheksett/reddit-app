
import { Formik, Form } from 'formik';
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps { }

const Register: React.FC<registerProps> = () => {
    const [, register] = useRegisterMutation();
    const router = useRouter();

    const submit = async (values: any, { setErrors }: any) => {
        console.log(values)
        const response = await register({ loginOptions: values });
        if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data?.register.errors));
        } else if (response.data?.register.user) {
            router.push("/");
        }
    };
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ email: '', username: '', password: '' }} onSubmit={submit}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="username" placeholder="Username" label="username" />
                        <InputField name="email" placeholder="Email" label="email" type="email" />
                        <Box mt={4}>
                            <InputField name="password" placeholder="password" label="password" type="password" />
                        </Box>
                        <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(Register);
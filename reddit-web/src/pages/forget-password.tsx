import { Formik, Form } from 'formik';
import { Button, Box } from "@chakra-ui/react";
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { useState } from 'react';

const ForgetPassword: React.FC = ({ }) => {

    const [, forgotPassword] = useForgotPasswordMutation();
    const [complete, setComplete] = useState(false);

    const submit = async (values: any, { setErrors }: any) => {
        console.log(values)
        await forgotPassword(values);
        setComplete(true);
    };

    return (
        <Wrapper variant="small">
            <Formik initialValues={{ email: '' }} onSubmit={submit}>
                {({ isSubmitting, values }) =>
                    complete ?
                        <Box>If an account with the email <b>{values.email}</b> exists, we have sent you an email</Box> :
                        <Form>
                            <InputField name="email" placeholder="Email" label="Email" />

                            <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
                                Forgot password
                            </Button>
                        </Form>
                }
            </Formik>
        </Wrapper >
    )
};

export default withUrqlClient(createUrqlClient)(ForgetPassword);
import { NextPage } from "next";
import { Formik, Form } from 'formik';
import { Box, Button, Link, Flex } from "@chakra-ui/react";
import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { toErrorMap } from "../../utils/toErrorMap";
import { useState } from "react";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from 'next/link';


const ChangePassword: NextPage<{ token: string }> = ({ }) => {

    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    const router = useRouter();

    const submit = async (values: any, { setErrors }: any) => {
        console.log(values)
        const token = typeof router.query.token === 'string' ? router.query.token : '';
        const response = await changePassword({ token, newPassword: values.newPassword });
        if (response.data?.changePassword.errors) {
            const error = toErrorMap(response.data?.changePassword.errors);
            if ('token' in error) {
                setTokenError(error.token);
            }
            setErrors(error)
        } else if (response.data?.changePassword.user) {
            router.push('/');
        }
    };

    return (
        <Wrapper variant="small">
            <Formik initialValues={{ newPassword: '' }} onSubmit={submit}>
                {({ isSubmitting }) => (
                    <Form>
                        <Box mt={4}>
                            <InputField name="newPassword" placeholder="New password" label="New password" type="password" />
                        </Box>
                        {tokenError && (
                            <Flex>
                                <Box color="red" mr={2}>
                                    {tokenError}
                                </Box>
                                <NextLink href="/forget-password">
                                    <Link>Click here to get a new one</Link>
                                </NextLink>

                            </Flex>
                        )}
                        <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
                            Reset
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
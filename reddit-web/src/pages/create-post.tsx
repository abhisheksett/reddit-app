import { Formik, Form } from 'formik';
import { Box, Button, Link, Flex, Textarea } from "@chakra-ui/react";
import InputField from '../components/InputField';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIsAuth } from '../hooks/useIsAuth';

const CreatePost: React.FC = ({ }) => {

    const [, createPost] = useCreatePostMutation();
    const router = useRouter();

    useIsAuth();

    const submit = async (values: any, { setErrors }: any) => {
        console.log(values)
        const { error } = await createPost({ createPostInput: values });
        console.log(error);
        if (!error) {
            router.push('/');
        }
    };

    return (
        <Layout variant="small">
            <Formik initialValues={{ title: '', text: '' }} onSubmit={submit}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="title" placeholder="Title" label="Title" />
                        <Box mt={4}>
                            <InputField name="text" placeholder="text..." label="Body" />
                        </Box>
                        <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
                            Create post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
};

export default withUrqlClient(createUrqlClient)(CreatePost);
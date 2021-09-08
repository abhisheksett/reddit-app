import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";

const Index = () => {
    return (

        <Layout>
            <div>Hello world</div>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)

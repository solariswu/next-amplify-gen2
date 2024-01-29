/* eslint-disable */
const awsmobile = {
    aws_project_region: "us-east-1",
    aws_user_pools_web_client_id: "7ltkg382c1d959k3ll69mfp3n",
    aws_user_pools_id: "us-west-1_v1Jh1X41T",
    // aws_hosted_ui_url: "https://reachuppoc01.auth.us-east-1.amazoncognito.com",
    // app_callback_uri: "https://reachup.aws-amplify.dev",
    oauth: {
        domain: 'reachuppoc01.auth.us-east-1.amazoncognito.com',
        scope: ['profile', 'openid', 'email'],
        redirectSignIn: 'https://reachup.aws-amplify.dev',
        redirectSignOut: 'https://reachup.aws-amplify.dev',
        responseType: 'code' //
    }
};

export default awsmobile;

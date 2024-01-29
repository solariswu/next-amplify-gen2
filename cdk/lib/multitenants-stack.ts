import { CfnOutput, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { WebApplication } from './webapp';
import { TenantUserPool } from './userpool';

export class MultiTenantsStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // frontend
    // use the domain created above to create the frontend web app.
    const webapp = new WebApplication(this);

    // userpool hostedui customauth-oidc customauth-lambda triggers.
    const tenantUserPool = new TenantUserPool(this);

    // output

    new CfnOutput(this, 'userPoolId', { value: tenantUserPool.userpool.userPoolId, });

    new CfnOutput(this, 'app url', { value: `https://${webapp.distribution.domainName}` });
  }
}

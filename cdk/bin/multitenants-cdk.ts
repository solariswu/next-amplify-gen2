#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { MultiTenantsStack } from '../lib/multitenants-stack';

const app = new App();

new MultiTenantsStack(app, 'MyMultiTenantStack');

app.synth();

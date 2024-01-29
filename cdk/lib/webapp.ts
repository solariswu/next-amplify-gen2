
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

import { RemovalPolicy, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";

import * as path from 'path';

export class WebApplication {
    scope: Construct
    name: string;
    domainName: string;
    s3bucket: Bucket;
    distribution: Distribution;

    constructor(scope: Construct, ) {
        this.scope = scope;

        this.distribution = this.createDistribution();
    }

    private createS3Bucket() {
        return new Bucket(this.scope, 'reachupWebAppDeployBucket', {
            bucketName: `reachup-poc001001001`,
            accessControl: BucketAccessControl.PRIVATE,
            removalPolicy: RemovalPolicy.DESTROY,
        });

    }

    private createDistribution(bucket: Bucket = this.createS3Bucket()) {

        // config Cloudfront read to S3
        const originAccessIdentity = new OriginAccessIdentity(
            this.scope,
            'OriginAccessIdentity'
        );
        bucket.grantRead(originAccessIdentity);

        // set up cloudfront
        const distribution = new Distribution(this.scope, 'Distribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new S3Origin(bucket, { originAccessIdentity }),
            },
            errorResponses: [{
                httpStatus: 403,
                responseHttpStatus: 403,
                responsePagePath: '/index.html',
                ttl: Duration.minutes(30),
            }, {
                httpStatus: 404,
                responseHttpStatus: 404,
                responsePagePath: '/index.html',
                ttl: Duration.minutes(30),
            }],
        });

        // assign web release path to s3 deployment
        new BucketDeployment(this.scope, 'BucketDeployment', {
            destinationBucket: bucket,
            sources: [Source.asset(path.resolve(__dirname, '../../build'))],
            distribution,
            distributionPaths: ['/*'],
        });

        return distribution;
    }

}

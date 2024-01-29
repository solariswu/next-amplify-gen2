import { Construct } from 'constructs';
import {
  UserPool,
  UserPoolClient,
  OAuthScope,
  AccountRecovery,
  UserPoolIdentityProviderOidc,
  ProviderAttribute,
  OidcAttributeRequestMethod,
  Mfa,
  UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Duration } from 'aws-cdk-lib';


export class TenantUserPool {
  scope: Construct;
  userpool: UserPool;
  hostedUIClient: UserPoolClient;
  customAuthClient: UserPoolClient;
  secretClient: UserPoolClient;
  oidcProvider: UserPoolIdentityProviderOidc;
  api: RestApi;

  constructor(scope: Construct) {
    this.scope = scope;

    this.userpool = this.createUserPool();
    this.oidcProvider = this.createOIDCProvider();
    this.hostedUIClient = this.addHostedUIAppClient();
    this.hostedUIClient.node.addDependency(this.oidcProvider);
    this.addHostedUIDomain();
  }

  private createUserPool = () => {
    return new UserPool(this.scope, `reachuppoc-userpool}`, {
      userPoolName: `reachuppocUserPool`,
      // use self sign-in is disable by default
      selfSignUpEnabled: true,
      signInAliases: {
        // username sign-in
        username: false,
        // email as username
        email: true,
        phone: false,
      },
      signInCaseSensitive: false,
      // user attributes
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      // temporary password lives for 30 days
      passwordPolicy: {
        tempPasswordValidity: Duration.days(30),
        requireSymbols: true,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
      },
      // no customer attribute
      // MFA optional
      mfa: Mfa.OPTIONAL,
      // forgotPassword recovery method, phone by default
      accountRecovery: AccountRecovery.EMAIL_ONLY,
    });
  }


  private addHostedUIAppClient() {
    return new UserPoolClient(this.scope, 'hostedUIClient', {
      userPool: this.userpool,
      generateSecret: false,
      authFlows: {
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.EMAIL, OAuthScope.PHONE],
        callbackUrls: ['https://reachup.aws-amplify.dev', 'http://localhost:3000'],
        logoutUrls: ['https://reachup.aws-amplify.dev', 'http://localhost:3000'],
      },
      userPoolClientName: 'hostedUIClient',
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO, UserPoolClientIdentityProvider.custom('tenantaidp')]
    });
  };

  private createOIDCProvider() {
    const issuerUrl = 'https://login.microsoftonline.com/daf8bbd3-5e1f-4ebf-9ec3-9010ae227604/v2.0';

    return new UserPoolIdentityProviderOidc(
      this.scope,
      'TenantA-OIDCProvider',
      {
        clientId: '57e3ebdc-216d-4444-b214-e4a3961ece69',
        clientSecret: 'MASKEDVALUE_REPLACE_REQUIRED',
        issuerUrl,
        userPool: this.userpool,
        // the properties below are optional
        attributeMapping: {
          email: ProviderAttribute.other('email'),
          phoneNumber: ProviderAttribute.other('phone_number'),
          familyName: ProviderAttribute.other('family_name'),
          givenName: ProviderAttribute.other('given_name'),
          nickname: ProviderAttribute.other('nickname'),
          custom: {
            email_verified: ProviderAttribute.other('email_verified'),
            phone_number_verified: ProviderAttribute.other('phone_number_verified'),
          },
        },
        attributeRequestMethod: OidcAttributeRequestMethod.GET,
        name: 'tenantaidp',
        scopes: ['openid email phone profile'],
      }
    );
  };

  private addHostedUIDomain(
  ) {
    return this.userpool.addDomain('HostedUI-domain', {
      cognitoDomain: {
        domainPrefix: 'reachuppoc01',
      },
    });
  };

}

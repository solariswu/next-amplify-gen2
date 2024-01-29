import { useState, useEffect } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';

import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import awsConfig from '../aws-exports';


const LOGIN = () => {

  const [isLoading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const [user, setUser] = useState(null);


  const getUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      console.error(error);
      console.log("Not signed in");
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        default:
          console.log('auth event', event)
          break;
      }
    });

    setLoading(true);

    getUser();

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <div>Loading...</div>
  }

  const handleClick = (event) => {
    const appclientsList = ["7ltkg382c1d959k3ll69mfp3n", "396m4elqhkpfba9au1pat4431a"];

    console.log('parseInt', parseInt((parseInt(event.target.value) - 1) / 2))

    console.log('appclientsList', appclientsList[parseInt((parseInt(event.target.value) - 1) / 2)])
    const updatedAwsConfig = {
      ...awsConfig,
      aws_user_pools_web_client_id: appclientsList[parseInt((parseInt(event.target.value) - 1) / 2)],
    };

    console.log('awsConfig', updatedAwsConfig)

    Amplify.configure(updatedAwsConfig);

    switch (event.target.value) {
      case '1':
        Auth.federatedSignIn({ provider: 'tenantaidp' })
        break;
      case '3':
        Auth.federatedSignIn({ provider: 'tenantbidp' })
        break;
      case '2':
      case '4':
        Auth.federatedSignIn();
        break;
      default:
        break;
    }
  }

  if (user) {
    console.log('user', user)
    return (
      <div>
        Welcome {
          user.signInUserSession.idToken.payload.given_name
        } {
          user.signInUserSession.idToken.payload.family_name
        }<br /> from {
          user.signInUserSession.idToken.payload['cognito:groups'][0]
        } with email {
          user.signInUserSession.idToken.payload.email
        }
      </div>
    );
  }

  return (
    <div>
      <UncontrolledDropdown isOpen={dropdownOpen} toggle={toggle} direction='down'>
        <DropdownToggle caret outline color="info">
          Select your organisation name
        </DropdownToggle>
        <DropdownMenu name="tenant" >
          <DropdownItem name="tenant001" value="1" onClick={handleClick} >Tenant A IDP Direct</DropdownItem>
          <DropdownItem name="tenant002" value="2" onClick={handleClick} >Tenant A Hosted UI</DropdownItem>
          <DropdownItem name="tenant003" value="3" onClick={handleClick} >Tenant B IDP Direct</DropdownItem>
          <DropdownItem name="tenant004" value="4" onClick={handleClick} >Tenant B Hosted UI</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}

const Home = () => {

  return (
    <LOGIN />
  );
}
export default Home;
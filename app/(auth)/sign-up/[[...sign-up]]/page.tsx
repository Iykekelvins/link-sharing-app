import SignUp from '@/_pages/auth/sign-up';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign Up',
};

const SignUpPage = () => {
	return <SignUp />;
};

export default SignUpPage;

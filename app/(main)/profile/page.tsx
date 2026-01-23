import Profile from '@/_pages/main/profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Profile',
};

const Profilepage = () => {
	return <Profile />;
};

export default Profilepage;

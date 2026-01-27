import Preview from '@/_pages/preview';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Preview',
};

const Previewpage = () => {
	return <Preview />;
};

export default Previewpage;

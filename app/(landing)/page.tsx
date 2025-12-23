import { redirect } from 'next/navigation';

export default function RootPage() {
	// Mở web lên cái là tự nhảy vào trang Login luôn
	redirect('/control');
}
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the landing page in the (landing) route group
  redirect('/home');
}

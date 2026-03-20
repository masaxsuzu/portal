import { Suspense } from 'react';
import Controls from '../../components/Controls';
import LoginContent from './LoginContent';

export default function LoginPage() {
  const bypassMode = !!process.env.AUTH_BYPASS_USER;
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Controls />
      <Suspense>
        <LoginContent bypassMode={bypassMode} />
      </Suspense>
    </div>
  );
}

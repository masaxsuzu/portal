import { Suspense } from 'react';
import LoginContent from './LoginContent';

export default function LoginPage() {
  const bypassMode = !!process.env.AUTH_BYPASS_USER;
  return (
    <div className="flex-1 flex justify-center items-center">
      <Suspense>
        <LoginContent bypassMode={bypassMode} />
      </Suspense>
    </div>
  );
}

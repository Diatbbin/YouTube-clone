import { Suspense } from 'react';
import Watch from './watch';

export default function WatchPage() {
  return (
    <Suspense fallback={<div>Loading video...</div>}>
      <Watch />
    </Suspense>
  );
}

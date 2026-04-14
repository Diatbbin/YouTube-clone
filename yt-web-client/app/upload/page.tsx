import { Suspense } from 'react';
import UploadPage from './upload-page';

export default function WatchPage() {
  return (
    <Suspense fallback={<div>Loading video...</div>}>
      < UploadPage />
    </Suspense>
  );
}

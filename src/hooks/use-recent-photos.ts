import { AssetField, MediaType, Query, addListener, usePermissions } from 'expo-media-library';
import { useEffect, useState } from 'react';

import type { TRecentPhoto } from '../types';

const NO_PHOTOS: TRecentPhoto[] = [];

export function useRecentPhotos(limit: number) {
  const [permission] = usePermissions({ request: true, granularPermissions: ['photo'] });
  const [photos, setPhotos] = useState(NO_PHOTOS);
  const isGranted = permission?.granted ?? false;

  useEffect(() => {
    if (!isGranted) return;

    let isActive = true;
    const load = async () => {
      try {
        const assets = await new Query()
          .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
          .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
          .limit(limit)
          .exe();
        if (isActive) setPhotos(assets.map((asset) => ({ id: asset.id, uri: asset.id })));
      } catch {
        if (isActive) setPhotos(NO_PHOTOS);
      }
    };

    load();
    const subscription = addListener(() => load());

    return () => {
      isActive = false;
      subscription.remove();
    };
  }, [isGranted, limit]);

  return isGranted ? photos : NO_PHOTOS;
}

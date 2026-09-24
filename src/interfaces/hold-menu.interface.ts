import type { SharedValue } from 'react-native-reanimated';

interface IRecentPhoto {
  id: string;
  uri: string;
}

interface ITrayMetrics {
  size: number;
  startX: number;
  centerY: number;
}

interface IComposerDock {
  pendingCard: SharedValue<number>;
  dockProgress: SharedValue<number>;
}

interface IAttachHoldButtonProps {
  photos: readonly IRecentPhoto[];
  dock: IComposerDock;
  attachmentCount: number;
  onPress?: () => void;
  onPhotoSelect?: (photo: IRecentPhoto) => void;
}

interface IHoldMenuState {
  anchorX: SharedValue<number>;
  anchorY: SharedValue<number>;
  open: SharedValue<number>;
  isOpen: SharedValue<boolean>;
  hovered: SharedValue<number>;
  dockingIndex: SharedValue<number>;
}

interface IPhotoHoldMenuProps extends IHoldMenuState {
  visible: boolean;
  bandAnchorY: number;
  dock: IComposerDock;
  photos: readonly IRecentPhoto[];
  isTouching: SharedValue<boolean>;
  onSelect: (index: number) => void;
  onDismiss: () => void;
}

interface IHoldMenuBackdropProps {
  fadeHeight: number;
  holdHeight: number;
}

interface IPhotoTileProps extends IHoldMenuState {
  dock: IComposerDock;
  photo: IRecentPhoto;
  index: number;
  count: number;
  windowWidth: number;
}

export type {
  IAttachHoldButtonProps,
  IComposerDock,
  IHoldMenuBackdropProps,
  IHoldMenuState,
  IPhotoHoldMenuProps,
  IPhotoTileProps,
  IRecentPhoto,
  ITrayMetrics,
};

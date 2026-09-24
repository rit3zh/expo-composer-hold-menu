import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';

import type { IComposerDock, IRecentPhoto } from './hold-menu.interface';

interface IComposerProps extends Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder'> {
  recentPhotos?: readonly IRecentPhoto[];
  onAttachPress?: () => void;
  onPhotoSelect?: (photo: IRecentPhoto) => void;
  onDictatePress?: () => void;
  onVoicePress?: () => void;
  style?: StyleProp<ViewStyle>;
}

interface IAttachmentCardProps {
  photo: IRecentPhoto;
  index: number;
  dock: IComposerDock;
  isLeaving: boolean;
  onRemove: (id: string) => void;
  onExited: (id: string) => void;
}

export type { IAttachmentCardProps, IComposerProps };

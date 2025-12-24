export type LabelDto = {
  id: string;
  name: string;
  type?: string; // "system" | "user"
  messagesTotal?: number;
  messagesUnread?: number;
  threadsTotal?: number;
  threadsUnread?: number;
  labelListVisibility?: string;
  messageListVisibility?: string;
};

export type UpsertLabelRequest = {
  name: string;
  labelListVisibility?: string;
  messageListVisibility?: string;
};
export type WSMessage = {
    type: 'join' | 'change';
    slug?: string;
    content?: string;
    cursor?: number;
}
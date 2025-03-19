export interface User {
  id: string;
  username: string;
  avatar: string;
  verified: boolean;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: number;
  likes: number;
}

export interface Post {
  id: string;
  user: User;
  images: string[];
  caption: string;
  hashtags: string[];
  likes: number;
  comments: Comment[];
  saved: boolean;
  timestamp: number;
}
import { Timestamp } from "firebase/firestore/lite";

export type ImageFile = {
  url: string;
  path: string;
};

export interface CategoryWithId {
  id: string;
  color: string;
  image: {
    path: string;
    url: string;
  };
  name: string;
  posts: string[];
}

export interface Category {
  color: string;
  image: {
    path: string;
    url: string;
  };
  name: string;
  posts: string[];
}

export interface BlogPost {
  additionalImages: ImageFile[];
  category: string;
  content: string;
  coverImage: ImageFile;
  date: Date;
  draft: boolean;
  slug: string;
  tags: string[];
  title: string;
  views: number;
}

export interface BlogPostWithId {
  id: string;
  data: {
    additionalImages: ImageFile[];
    category: string;
    content: string;
    coverImage: ImageFile;
    date: Date;
    draft: boolean;
    slug: string;
    tags: string[];
    title: string;
    views: number;
  };
}




export type ImagePath = {
  url: string;
  path: string;
};

export type ImageFile = {
  url: string;
  file: File;
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
  additionalImages?: ImagePath[];
  category: string;
  categoryName?: string;
  content: string;
  coverImage?: ImagePath;
  date?: string | null | Date;
  draft: boolean;
  slug: string;
  tags: string[];
  title: string;
  editedAt?: string | null | Date;
  views: number;
}

export interface BlogPostWithId {
  id: string;
  data: {
    additionalImages?: ImagePath[];
    category: string;
    categoryName?: string | undefined;
    content: string;
    coverImage?: ImagePath;
    date?: string| null | Date;
    draft: boolean;
    slug: string;
    tags: string[];
    title: string;
    editedAt?: string | null | Date;
    views: number;
  };
}


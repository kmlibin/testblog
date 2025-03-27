

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
  posts?: string[];
  drafts?: string[]
}

export interface Category {
  color: string;
  image: {
    path: string;
    url: string;
  };
  name: string;
  posts?: string[];
  drafts?: string[]
}

export interface BlogPost {
  featured: boolean;
  categoryColor: any;
  myPick: boolean;
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
    featured: boolean;
    categoryColor: string;
    myPick: boolean;
    additionalImages?: ImagePath[];
    category: string;
    categoryName?: string | undefined;
    content: string;
    coverImage?: ImagePath;
    date: any;
    draft: boolean;
    slug: string;
    tags: string[];
    title: string;
    editedAt: any;
    views: number;
  };
}

export interface NewCategory  {
  color: string;
  image: {
    path: string;
    url: string;
  };
  name: string;


}
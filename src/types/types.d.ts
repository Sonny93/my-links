import { User } from '@prisma/client';

// TODO: extend @prisma/client type with Link[] instead of
// recreate interface (same for Link)
export interface Category {
  id: number;
  name: string;

  links: Link[];
  authorId: User['id'];
  author: User;

  createdAt: Date;
  updatedAt: Date;
}

export interface Link {
  id: number;

  name: string;
  url: string;

  category: {
    id: number;
    name: string;
  };

  authorId: User['id'];
  author: User;
  favorite: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface SearchItem {
  id: number;
  name: string;
  url: string;
  type: 'category' | 'link';
  category?: undefined | Link['category'];
}

export interface Favicon {
  buffer: Buffer;
  url: string;
  type: string;
  size: number;
}

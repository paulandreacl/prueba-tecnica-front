interface PostFields {
  title: string;
  body: string;
}

export interface Post extends PostFields {
  id: number;
  imageUrl?: string;
}

export interface PostFormValues extends PostFields {
  imageUrl: string | null;
}

export interface PostFormData extends PostFields {
  imageUrl: string;
}

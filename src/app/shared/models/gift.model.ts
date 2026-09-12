export interface Gift {
  id: number;
  name: string;
  brand: string;
  price: number;
  url: string;
  photo: string | null;
  userId: number;
  reserved: boolean;
}

export interface CreateGift {
  name: string;
  brand: string | null;
  price: number | null;
  url: string | null;
  photo: string | null;
}

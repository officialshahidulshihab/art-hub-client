export const getBanners = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/banners`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

export const getFeaturedArtworks = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/featured`,
    { cache: "no-store" },
  );
  const data = await res.json();
  return data;
};

export const getTopArtists = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/artists/top`,
    { cache: "no-store" },
  );
  const data = await res.json();
  return data;
};

export const getArtistById = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/artists/${id}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data;
};

export const getArtistArtworks = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/artists/${id}/artworks`,
    { cache: "no-store" },
  );
  const data = await res.json();
  return data;
};


export const getAllArtworks = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks`,
    { cache: "no-store" },
  );
  const data = await res.json();
  return data;
};


export const getAllArtists = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/artists`,
    { cache: "no-store" },
  );
  const data = await res.json();
  return data;
};
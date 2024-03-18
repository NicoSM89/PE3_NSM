const photos = [];

export const getAllPhotos = () => {
    return photos;
}

export const createPhotos = (photos) => {
    photos.push(photos);
    return photos;
}
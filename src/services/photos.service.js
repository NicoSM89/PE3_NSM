import { createPhotos, getAllPhotos } from "../persistence/photos.persistence.js"

export const getAllPhotosService = () => {
    return getAllPhotos();
}

export const createPhotosService = (photos) => {
    const result = createPhotos(photos);
    if(!result){
        return false;
    }
    return true;
}
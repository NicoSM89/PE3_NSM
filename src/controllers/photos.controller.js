import { getAllPhotosService, createPhotosService } from "../services/photos.service.js"

export const getPhotos = (_req, res) => {
    const photos = getAllPhotosService();
    res.send(photos);
}

export const postPhotos = (req, res) => {
    const photos = req.body;
    const result = createPhotosService(photos);
    if(result){
        return res.send(result);
    }
    else{
        return res.status(400).send({message: 'Error'});
    }
}
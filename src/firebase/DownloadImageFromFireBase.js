import {useEffect, useState} from "react";
import {getDownloadURL, ref, storage} from "./firebase";

const DownloadImageFromFireBase = ({ imagePath }) => {
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        if (imagePath) {
            const imageRef = ref(storage, imagePath);
            getDownloadURL(imageRef)
                .then((url) => {
                    setImageURL(url);
                })
                .catch((error) => {
                    console.error("Error fetching image URL: ", error);
                });
        }
    }, [imagePath]
    )
    return (
        <td>
            {imageURL ? (
                <img src={imageURL} alt="Uploaded" style={{ width: '50px', height: '50px' }} />
            ) : (
                <p>Loading...</p>
            )}
        </td>
    );
}
export default DownloadImageFromFireBase
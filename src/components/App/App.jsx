
import { useEffect, useState } from "react"
import SearchBar from "../SearchBar/SearchBar"
import ImageGallery from "../ImageGallery/ImageGallery";
import {getImages} from "../../images-api"
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";


export default function App() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalPage] = useState(12);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            return;
        }
        async function fetchImages() {
            try {
                setIsLoading(true);
                setIsError(false);
                const fetchImages = await getImages(searchQuery, page, totalPage);
                setImages((prevState) => [...prevState, ...fetchImages]);
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetchImages()
    }, [page, searchQuery, totalPage]);

    const handlerSearch = async (topic) => {
        setSearchQuery(topic);
        setPage(1);
        setImages([]);
    }

    const handleLoadMore = async () => {
        setPage(totalPage => totalPage + 1);
    };

    return (
        <div>
            <SearchBar onSubmit={handlerSearch} />
            {images.length > 0 && <ImageGallery items={images} />}
            {isError && <ErrorMessage />}
            {images.length > 0 && !isLoading && (<LoadMoreBtn onClick={handleLoadMore} />)}
            {isLoading && <Loader />}
        </div>
    )
}
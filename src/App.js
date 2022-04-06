import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  useMediaQuery,
  Button,
  Modal,
  CircularProgress,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import SearchBar from "material-ui-search-bar";
import ImageGrid from "./components/image-grid";
import { getListOfImagesFromApi } from "./api/giphyApi";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [displayImages, setDisplayImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listInnerRef = useRef();
  const PER_PAGE = 5;

  const searchApiUrl = "https://api.giphy.com/v1/gifs/search";
  const trendingApiUrl = "https://api.giphy.com/v1/gifs/trending";

  const count = Math.ceil(displayImages?.length / PER_PAGE);
  const apiKey = "tVaJe9QRTL6VZp9xhBkogbNWFTI9hYnJ";

  const handleOpen = (indexVal) => {
    setModalImages(displayImages[indexVal].images);
    setOpen(true);
  };
  const handleClose = () => {
    setModalImages([]);
    setOpen(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "rgba(255, 255, 255)",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    maxHeight: "500px",
    
  };
  useEffect(() => {
    setIsLoading(true);

    getListOfImages();
  }, []);

  const getListOfImages = () => {
    axios.get(`${trendingApiUrl}?api_key=${apiKey}&limit=20`).then((resp) => {
      console.log("resp.data", Object.values(resp.data.data));
      setImages(resp.data.data);
      setDisplayImages(resp.data.data);
      setIsLoading(false);
    });
  };

  const getSearchResults = (keyword) => {
    setIsLoading(true);
    axios.get(`${searchApiUrl}?api_key=${apiKey}&q=${keyword}`).then((resp) => {
      console.log("search.data", Object.values(resp.data.data));
      setDisplayImages(resp.data.data);
      setPage(1);
      setIsLoading(false);
    });
  };

  const handleChange = (e, p) => {
    e.preventDefault();
    setPage(p);
  };


  const smallScreen = useMediaQuery("(max-width:600px)");


  return (
    <div className="App">
      <Typography variant="h4">Giphy Images</Typography>
      <Box
        style={{
          maxWidth: "500px",
          margin: "1rem auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <SearchBar
          value={searchValue}
          onChange={(newValue) => setSearchValue(newValue)}
          onRequestSearch={() => {
            if (searchValue?.length > 0) {
              setIsLoading(true);
              getSearchResults(searchValue);
            } else {
              setDisplayImages(images);
              setPage(1);
              setIsLoading(false);
            }
          }}
          onCancelSearch={() => {
            setDisplayImages(images);
            setPage(1);
          }}
          placeholder="Search by title"
          style={{}}
        />
        <Pagination
          count={count}
          size="large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
          style={{ margin: "0 auto" }}
        />
      </Box>
      <div
        className={ smallScreen? "rowGrid" : "columnGrid"}
        ref={listInnerRef}
      >
        {displayImages?.length > 0 && (
          <>
            {displayImages.slice(page * 5 - 5, 5 * page).map((i, index) => (
              <div key={`${i.title}-image-${index}`}>
                <Button onClick={() => handleOpen(index + 5 * (page - 1))}
                style={{border: "2px solid orange" }}>
                  <Card sx={{ maxWidth: 345}}>
                    <CardMedia
                      component="img"
                      image={i.images.fixed_height.url}
                      alt={i.title}
                      style={{
                        width: "15rem",
                        minHeight: "10rem",
                        maxHeight: "10rem",
                      }}
                    />
                    <CardContent style={{
                          color: "orange",
                          textTransform: "none",
                          fontSize: "1rem",
                          maxHeight: "6rem",
                          minHeight: "6rem"
                        }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        style={{ fontWeight: "bold"}}
                        
                      >
                        {i.username}
                      </Typography>
                      <Typography variant="body2">{i.title}</Typography>
                    </CardContent>
                    <CardActions></CardActions>
                  </Card>
                </Button>
              </div>
            ))}
          </>
        )}
        </div>

        {displayImages?.length === 0 && (
          <>
            {isLoading && <CircularProgress style={{color: "orange"}}/>}
            {!isLoading && (
              <Typography
                variant="subtitle1"
                style={{ margin: "0 auto", fontWeight: "bold" }}
              >
                No results found
              </Typography>
            )}
            
          </>
        )}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} >
            <Typography id="modal-modal-title" variant="h6" component="h2"
            style={{margin: "0 auto"}}>
              Gifs
            </Typography>
            <Box id="modal-modal-description" sx={{ mt: 2, overflow: "auto" }}>
              <ImageGrid images={modalImages} />
            </Box>
          </Box>
        </Modal>
      
    </div>
  );
}

export default App;

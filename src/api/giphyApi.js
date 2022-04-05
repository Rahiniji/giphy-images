import axios from 'axios';

const apiKey = process.env.REACT_APP_GIPHY_API_KEY;

const trendingApiUrl = "https://api.giphy.com/v1/gifs/trending";

export const getListOfImagesFromApi = async(s,p) => {
    console.log('tap1', trendingApiUrl, s, p)
    axios
      .get(
        `${trendingApiUrl}?api_key=${apiKey}&limit=20`
      )
      .then((resp) => {
        console.log("resp.data from api1", resp.data.data);
        return resp.data.data;
      });
  };
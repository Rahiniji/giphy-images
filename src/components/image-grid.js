import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  useMediaQuery,
} from "@material-ui/core";

function ImageGrid(props) {
  const { images } = props;

  const smallScreen = useMediaQuery("(max-width:600px)");

  return (
    <div className={smallScreen ? "modalRowGrid" : "modalColumnGrid"}>
      {Object.values(images).map((item, itemIndex) => (
        <>
          {item.url && (
            <Box key={`${item.url}-${itemIndex}`} sx={{}}>
              <Card>
                <CardMedia
                  component="img"
                  height="50"
                  width="50"
                  image={item.url}
                  alt={item.url}
                />
                <CardContent>
                  <Typography gutterBottom variant="body2" component="div">
                    Size: {item.size || item.webp_size}
                  </Typography>
                </CardContent>
                <CardActions></CardActions>
              </Card>
            </Box>
          )}
        </>
      ))}
    </div>
  );
}

export default ImageGrid;

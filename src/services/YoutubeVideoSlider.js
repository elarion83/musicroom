import { Box } from "@mui/system";

import { useSpringCarousel } from 'react-spring-carousel';
import { getCarouselItemsArray } from "./utils";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
const YoutubeVideoSlider = ({itemsArray,addingObject=null,addItemToPlaylist}) => {
    
    const [activeItem, setActiveItem] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        if(getCurrentActiveItem().index < itemsArray.length-2) {
            slideToItem(getCurrentActiveItem().index+2);
        } else {
            slideToItem(0);
        }
      }, 12000);
      return () => {
        window.clearInterval(timer);
      };
    });

    const { carouselFragment,useListenToCustomEvent,slideToItem,slideToPrevItem,getCurrentActiveItem, slideToNextItem } = useSpringCarousel({
        gutter: 0,
        itemsPerSlide: 6, 
        withLoop: true,
        items: getCarouselItemsArray(itemsArray,addingObject,addItemToPlaylist),
    })

    return(
        <Box className='contentSlider youtubeSlider' sx={{ml:0,mr:0,pl:0,pr:0}}>
            {carouselFragment}
            <Grid className="carouselControls">
                <Button variant="contained" size="small" onClick={slideToPrevItem}><ArrowBackIosIcon fontSize="small"/></Button>
                <Button variant="contained" size="small" onClick={slideToNextItem}><ArrowForwardIosIcon fontSize="small" /></Button>
            </Grid>
        </Box>
    )
};

export default YoutubeVideoSlider;
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

import { Icon } from '@iconify/react';

import { useSpringCarousel } from 'react-spring-carousel';
import { mockYoutubeTrendResult } from "./utilsArray";

const NewContentslider = (items) => {
    
    const { carouselFragment,useListenToCustomEvent,slideToItem,getCurrentActiveItem, slideToNextItem } = useSpringCarousel({
        gutter: 0,
        itemsPerSlide: 5, 
        items: mockYoutubeTrendResult,
    })

    

    return(
        <Box className='homeSlider' sx={{ml:0,mr:0,pl:0,pr:0}}>
            {carouselFragment}
        </Box>
    )
};

export default NewContentslider;
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import i18n from "i18next";

import { useSpringCarousel } from 'react-spring-carousel';

const Contentslider = () => {
    
    const [activeItem, setActiveItem] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        if(getCurrentActiveItem().index < 3) {
            slideToNextItem();
        } else {
            slideToItem(0);
        }
      }, 8000);
      return () => {
        window.clearInterval(timer);
      };
    });

    const { carouselFragment,useListenToCustomEvent,slideToItem,getCurrentActiveItem, slideToNextItem } = useSpringCarousel({
        gutter: -40,
        items: [
            {
                id: '0',
                renderItem: 
                <Box className={(activeItem === '0' || activeItem === 0) ? 'slideBox activeSlideBox' : 'slideBox'} onClick={(e) => slideToItem(0)} > 
                    <img alt="" src="../../../../img/icons_animated/disco.gif" className="mainIcon"/>
                    <img alt="" src="../../../../img/icons_animated/womenheandbanging.gif" className="mainIcon altIcon top small"/>
                    <img alt="" src="../../../../img/icons_animated/menheandbanging.gif" className="mainIcon altIcon middle left small"/>
                    <img alt="" src="../../../../img/icons_animated/playlistadd.gif" className="mainIcon altIcon middle right small"/>
                    <Typography sx={{pl:2,pr:2,mb:3}} variant="h5" gutterBottom className='varelaFontTitle'>
                        {i18n.t('HomePageSlide1Title')}
                    </Typography>
                    <Typography sx={{pl:2,pr:2,mb:2,mt:3, color:'var(--white)'}} className='fontFamilyNunito'>
                        {i18n.t('HomePageSlide1Text1')}
                    </Typography >
                    <Typography sx={{pl:2,pr:2,mt:2, color:'var(--white)'}} className='fontFamilyNunito'>
                        {i18n.t('HomePageSlide1Text2')}
                    </Typography>
                </Box>,
            },
            {
                id: '1',
                renderItem: 
                <Box className={activeItem === '1' ? 'slideBox activeSlideBox' : 'slideBox'} onClick={(e) => slideToItem(1)}> 
                    <img alt="" src="../../../../img/icons_animated/confetti.gif" className="mainIcon"/>
                    <img alt="" src="../../../../img/icons_animated/glasses.gif" className="mainIcon altIcon left small"/>
                    <img alt="" src="../../../../img/icons_animated/hat.gif" className="mainIcon altIcon top left small"/>
                    <img alt="" src="../../../../img/icons_animated/bluetooth.gif" className="mainIcon altIcon middle right small"/>

                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        {i18n.t('HomePageSlide2Title')}
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyNunito'>
                        {i18n.t('HomePageSlide2Text')}
                    </Typography>
                </Box>,
            },
            {
                id: '2',
                renderItem: 
                <Box className={activeItem === '2' ? 'slideBox activeSlideBox' : 'slideBox'} onClick={(e) => slideToItem(2)}> 
                    <img alt="" src="../../../../img/icons_animated/globe.gif" className="mainIcon"/>
                    <img alt="" src="../../../../img/icons_animated/pin1.gif" className="mainIcon altIcon top left small"/>
                    <img alt="" src="../../../../img/icons_animated/amazonspeaker.gif" className="mainIcon altIcon top right small"/>
                    <img alt="" src="../../../../img/icons_animated/pin2.gif" className="mainIcon altIcon left small"/>
                    <img alt="" src="../../../../img/icons_animated/pin3.gif" className="mainIcon altIcon right small"/>
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        {i18n.t('HomePageSlide3Title')}
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyNunito'>
                        {i18n.t('HomePageSlide3Text1')}
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyNunito'>
                        {i18n.t('HomePageSlide3Text2')}
                    </Typography>
                </Box>,
            },
            {
                id: '3',
                renderItem: 
                <Box className={activeItem === '3' ? 'slideBox activeSlideBox' : 'slideBox'} onClick={(e) => slideToItem(3)}> 
                    <img alt="" src="../../../../img/icons_animated/chat.gif" className="mainIcon"/>
                    <img alt="" src="../../../../img/icons_animated/music_note.gif" className="mainIcon altIcon left small"/>
                    <img alt="" src="../../../../img/icons_animated/speakers.gif" className="mainIcon altIcon right small"/>
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        {i18n.t('HomePageSlide4Title')}
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyNunito'>
                        {i18n.t('HomePageSlide4Text1')}
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyNunito'>
                        {i18n.t('HomePageSlide4Text2')}
                    </Typography>
                </Box>,
            },
        ],
    })

    
    useListenToCustomEvent((event) => {
      if (event.eventName === "onSlideStartChange") {
        setActiveItem(event.nextItem.id)
      } 
    });

    return(
        <Box className='contentSlider'>
            {carouselFragment}
        </Box>
    )
};

export default Contentslider;
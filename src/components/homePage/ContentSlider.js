import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

import { Icon } from '@iconify/react';

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
                        Une playlist en temps réel a plusieurs !
                    </Typography>
                    <Typography sx={{pl:2,pr:2,mb:2,mt:3, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Ajoutez des médias depuis <b>Spotify et Youtube</b> à une playlist collective lue en temps réel.
                    </Typography>
                    <Typography sx={{pl:2,pr:2,mt:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Votez, tchatez, réagissez et vibrez ensemble au rythme de votre playlist. <b>Entre potes, en soirée, en voiture, en voyage, ou au sport, Play-it est l'outil indispensable !</b>
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
                        En étant tous au même endroit ..
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        <b>Idéal pour les soirées</b>, Play-it permet a chaque convive d'ajouter sa musique ou sa vidéo à la suite de la playlist, <b>plus besoin d'utiliser le téléphone de l'hôte de la soirée !</b>
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
                        .. ou en étant chacun chez soi
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Vibre au même rythme que tes potes <b>à des endroits différents</b> de la planète ! 
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        <b>En voyage, chacun dans sa voiture, chacun chez soi</b> en révisant ou en mattant les dernières vidéos youtube sous la couette !
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
                        Une playlist.. et bien plus !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Grâce au <b>chat, aux émoticones et aux votes</b>, les membres de la playlist font partie intégrante de l'ambiance !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Retrouvez et relisez les playlist qui vous on plu grâce à la <b>lecture désynchronisée</b> !
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
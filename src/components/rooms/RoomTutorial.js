import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { Box, Typography } from '@mui/material';
import { withTranslation } from "react-i18next";
import SwipeUpIcon from '@mui/icons-material/SwipeUp';
import { useEffect } from 'react';
import { delay } from '../../services/utils';
import { returnAnimateReplace } from '../../services/animateReplace';
const RoomTutorial = ({t, layout, customClass}) => {

    const animatedElementsTutoRef = [];

    useEffect(() => {
        setTimeout(() => {
            returnAnimateReplace(animatedElementsTutoRef, {In:"Out", Up:"Down"}, /In|Up|animate__delay/gi);
        }, 6000);
    });

    return(
        <Box className="roomTutorialContainer" >
            <Box  
                ref={el => animatedElementsTutoRef.push(el)}  
                className={""+layout+" phoneAndTablet animate__animated animate__fadeInUp animate__slow"}
            >
                <Typography className="fontFamilyNunito" 
                >{t('RoomTutorialSwipe')} </Typography>
                <SwipeUpIcon className="SlideUp"/>
            </Box>
            <Box  
                ref={el => animatedElementsTutoRef.push(el)}  
                className={""+layout+" desktop animate__animated animate__fadeInUp animate__slow"}
            >
                <Typography className="fontFamilyNunito" sx={{mt:2}}>{t('RoomTutorialClic')} </Typography>
                <KeyboardDoubleArrowDownIcon className="ClickUp"/>
            </Box>
        </Box>
    )
};

export default withTranslation()(RoomTutorial);
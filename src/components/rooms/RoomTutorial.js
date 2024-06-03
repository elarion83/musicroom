import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { Box, Typography } from '@mui/material';
import { withTranslation } from "react-i18next";
import SwipeUpIcon from '@mui/icons-material/SwipeUp';
const RoomTutorial = ({layout,slideOutProp}) => {
    const animatedElementsRef = [];
    return(
        <>
        <Box    
        sx={{bottom:slideOutProp}}
            ref={el => animatedElementsRef.push(el)} 
            className={"roomTutorialContainer "+layout+" phoneAndTablet animate__animated animate__fadeInUp animate__slow"}>
            <Typography className="fontFamilyNunito" sx={{color:'white', textShadow: '2px 8px 6px rgba(0,0,0,0.2), 0px -5px 35px rgba(255,255,255,0.3)'}}>Swipe pour rechercher ! </Typography>
            <SwipeUpIcon className="SlideUp"/>
        </Box>
        <Box 
        sx={{bottom:slideOutProp}}
            ref={el => animatedElementsRef.push(el)} 
            className="roomTutorialContainer desktop animate__animated animate__fadeInUp animate__slow">
            <Typography className="fontFamilyNunito" sx={{color:'white'}}>Clique pour rechercher ! </Typography>
            <KeyboardDoubleArrowDownIcon className="ClickUp"/>
        </Box>
        </>
    )
};

export default withTranslation()(RoomTutorial);
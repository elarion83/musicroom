import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';

import { Alert, AlertTitle, Typography } from '@mui/material';
import { formatNumberToMinAndSec, isEmpty, isVarExist, isVarNull } from '../../../services/utils';
import { withTranslation } from "react-i18next";
import { LoadingButton } from "@mui/lab";
import { checkCurrentUserSpotifyTokenExpiration } from "../../../services/utilsRoom";

const SpotifyConnectButton = ({t, text, clickFunc, expiration = null, user}) => {


    const [secondsLeft, setSecondsLeft] = useState(isVarNull(expiration) ? '' : '');
    useEffect(() => {
            if(!isVarNull(expiration)) {

                // TIMER FOR EXPIRATION
                const targetTime = new Date(expiration).getTime();

                const calculateTimeLeft = () => {
                    const currentTime = new Date().getTime();
                    const difference = targetTime - currentTime;
                    return Math.max(Math.floor(difference / 1000), 0); // Return the number of seconds remaining
                };

                const interval = setInterval(() => {
                    if(secondsLeft == 0) {
                        checkCurrentUserSpotifyTokenExpiration(user.customDatas.spotifyConnect, user.uid);
                    }
                    setSecondsLeft(calculateTimeLeft());
                }, 1000);

                // Clear interval on component unmount
                return () => clearInterval(interval);
            }

    }, [expiration]);


    return(
        <>
            <LoadingButton
            loading={false}
                sx={{ width:'100%', zIndex:2}}
                                className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton colorWhite' 
                startIcon={<Icon icon="mdi:spotify" width="20"  />}
                variant="contained"
                onClick={e => clickFunc()}>
                    <Typography fontSize="small">{text}</Typography>
            </LoadingButton>

            {isVarExist(expiration) && !isEmpty(secondsLeft) &&
                <Alert  severity="info" sx={{zIndex:1}} className="animate__animated animate__slideInDown">
                    <AlertTitle fontSize='small' >Expire dans <Typography component='span'>{formatNumberToMinAndSec(secondsLeft)}</Typography></AlertTitle>
                </Alert>
            }
        </>
    )
};

export default withTranslation()(SpotifyConnectButton);
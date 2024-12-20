import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from "axios";
import dateFormat from "dateformat";
import React, { useEffect, useState } from "react";
import Typed from "react-typed";
import { v4 as uuid } from 'uuid';

import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from "@mui/lab";
import Snackbar from '@mui/material/Snackbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import validator from 'validator';
import { cleanMediaTitle, delay, getDisplayTitle, getYTVidId, isEmpty, isProdEnv, isVarExist } from '../../../services/utils';
import { withTranslation } from 'react-i18next';
import {  Button, SwipeableDrawer, Typography } from '@mui/material';
import SoundWave from "../../../services/SoundWave";
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import { searchTextArray, spotifyApiPlaylistTracksObject, spotifyApiSearchObject, spotifyApiTopTracksObject, youtubeApiSearchObject, youtubeApiVideoInfoParams } from '../../../services/utilsArray';
import { KeyboardArrowDown } from '@mui/icons-material';
import SearchResultItem from '../SearchResultItem';
import { mockYoutubeSearchResultForVald } from '../../../services/mockedArray';
import YoutubeVideoSlider from '../../../services/YoutubeVideoSlider';
import { returnAnimateReplace } from '../../../services/animateReplace';
import { checkCurrentUserSpotifyTokenExpiration, checkRoomSpotifyTokenExpiration } from '../../../services/utilsRoom';
import SpotifyTab from './addMediaTabs/SpotifyTab';
const RoomModalAddMedia = ({ t, open,playlistId,enablerSpotify,playlistEmpty, room, changeOpen, roomIsPlaying,playerIdPlayed, currentUser, validatedObjectToAdd }) => {
    const [mediaSearchResultYoutube, setMediaSearchResultYoutube] = useState([]);
    const [mediaSearchResultSpotify, setMediaSearchResultSpotify] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showYoutubeTrends, setShowYoutubeTrends] = useState(true);
    const [spotifyTrendsTracks, setSpotifyTrendsTracks] = useState([]);
    const [spotifyTopTracks, setSpotifyTopTracks] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const animatedElementsRef = [];
    const animatedDownElementsRef = [];

    const [needAnimationReplace, setNeedAnimationReplace] = useState(false);

    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    const addingObject = { title: '', deleted: false, source: '', url: '', addedBy: currentUser.displayName };

    async function changeOpenInComp(openOrNot) {
        returnAnimateReplace(animatedElementsRef, {In:"Out", Up:"Down"}, /In|Up/gi);
        returnAnimateReplace(animatedDownElementsRef, {Out:"In", Down:"Up"}, /Out|Down/gi);
        await delay(200);
        setNeedAnimationReplace(true);
        changeOpen(openOrNot);
    }


	useEffect(() => {
        if(open && needAnimationReplace) {
            returnAnimateReplace(animatedDownElementsRef, {Out:"In", Up:"Down"}, /Out|Up/gi);
            returnAnimateReplace(animatedElementsRef, {Out:"In", Down:"Up"}, /Out|Down/gi);
        }

        if(open) {
            checkCurrentUserSpotifyTokenExpiration();
            checkRoomSpotifyTokenExpiration(room);
        }
        if(open && currentUser.customDatas.spotifyConnect.connected && isEmpty(spotifyTopTracks)) {
            axios.get(process.env.REACT_APP_ROOM_SPOTIFY_ME_ENDPOINT+'/top/tracks', {
                headers: { Authorization: `Bearer ${currentUser.customDatas.spotifyConnect.token}` },
                params: spotifyApiTopTracksObject()
                
            }).then(function (response) {
                setSpotifyTopTracks(response.data.items);
            });
        }

        if(open && isEmpty(spotifyTrendsTracks) && enablerSpotify.isLinked) {
            axios.get("https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks", {
                headers: { Authorization: `Bearer ${enablerSpotify.token}` },
                params: spotifyApiPlaylistTracksObject('37i9dQZF1DXcBWIGoYBM5M')
                
            }).then(function (response) {
                setSpotifyTrendsTracks(response.data.items);
            });
        }
	}, [open]); 

    async function handleCheckAndAddObjectToPlaylistFromObject(objectFormatted) {
        validatedObjectToAdd(objectFormatted);

        addingObject.title = '';
        addingObject.source = '';
        addingObject.url = '';
        addingObject.platformId = '';
    }

    async function getYoutubeVideoInfosFromId(videoId, addingObject) {
        await axios.get(process.env.REACT_APP_YOUTUBE_VIDEOS_URL, { params: youtubeApiVideoInfoParams(videoId) })
            .then(function (response) {
                addingObject.title = cleanMediaTitle(response.data.items[0].snippet.title);
            });
    }

    async function addMediaFromUrl(url) {
        addingObject.url = url;
        addingObject.title = addingObject.url;
        addingObject.source = "url";
        if (addingObject.url.includes('youtube') || addingObject.url.includes('youtu.be')) {
            addingObject.source = "youtube";
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = addingObject.url.match(regExp);

            await getYoutubeVideoInfosFromId(match[7], addingObject);
        }
        if (addingObject.url.includes('dailymotion')) {
            addingObject.source = "dailymotion";
        }
        if (addingObject.url.includes('soundcloud')) {
            addingObject.source = "soundcloud";
        }
        if (addingObject.url.includes('vimeo')) {
            addingObject.source = "vimeo";
        }

        addingObject.vote = { 'up': 0, 'down': 0 };
        addingObject.hashId = uuid().slice(0, 10).toLowerCase()
        handleCheckAndAddObjectToPlaylistFromObject(addingObject);
        setIsSearching(false);
        setSearchTerm('');
    }

    async function handleSearchForMedia() {

        let spotifyEnabler = enablerSpotify;
        setIsSearching(true);
        if (!isEmpty(searchTerm)) {
            if (validator.isURL(searchTerm.trim())) {
                addMediaFromUrl(searchTerm);
            } else {

                if(isProdEnv()) {
                    axios.get(process.env.REACT_APP_YOUTUBE_SEARCH_URL, {
                        params: youtubeApiSearchObject(searchTerm,16, 'relevance')
                    })
                    .then(async function (response) {
                        if (spotifyEnabler.isLinked) {
                            checkRoomSpotifyTokenExpiration(room);
                            axios.get(process.env.REACT_APP_ROOM_SPOTIFY_SEARCH_ENDPOINT, {
                                headers: { Authorization: `Bearer ${spotifyEnabler.token}` },
                                params: spotifyApiSearchObject(searchTerm)
                            }).then(function (response) {
                                setMediaSearchResultSpotify(response.data.tracks.items);
                            });
                        }
                        setMediaSearchResultYoutube(response.data.items);
                    }).finally(function () {
                        setIsSearching(false);
                        setShowResult(true);
                    });

                } else {
                    
                    if (spotifyEnabler.isLinked) {
                        checkRoomSpotifyTokenExpiration(room);
                        await axios.get(process.env.REACT_APP_ROOM_SPOTIFY_SEARCH_ENDPOINT, {
                            headers: { Authorization: `Bearer ${spotifyEnabler.token}` },
                            params: spotifyApiSearchObject(searchTerm)
                        }).then(function (response) {
                            setMediaSearchResultSpotify(response.data.tracks.items);
                        });
                    }
                    setMediaSearchResultYoutube(mockYoutubeSearchResultForVald);
                    setIsSearching(false);
                    setShowResult(true);
                }
            }
        } else {
            setIsSearching(false);
        }
    }

    return (
            <SwipeableDrawer
                id="modal-add-media"
                className='black_style_dialog'
                sx={{zIndex:1300}}
                anchor='bottom'
                hysteresis={0.2}
                TransitionComponent={SlideUp}
                swipeAreaWidth={playlistEmpty ? 350 : 100}
                onClose={(e) => changeOpen(false)}
                onOpen={(e) => changeOpen(true)}
                open={open}
            >
            <Container maxWidth={false} className="full_width_modal_content_container">

                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', position:'relative', mt:1 }} className="autowriter_container">
                    <Typed
                        strings={searchTextArray}
                        typeSpeed={5}
                        showCursor
                        backSpeed={15}
                        bindInputFocusEvents={true}
                        attr="placeholder"
                        loop
                         >
                        <input
                            id="addMediaSearchInput"
                            className="input_big typed"
                            type='text'
                            variant="standard"
                            autoFocus={true}
                            onKeyPress={(ev) => { if (ev.key === 'Enter') { handleSearchForMedia() } }}
                            onChange={e => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                    </Typed>
                    {isEmpty(searchTerm) && <div id="typed-cursor"></div>}
                    <LoadingButton
                        loading={isSearching}
                        sx={{
                            padding: "27.5px 14px",
                            backgroundColor: "#131416",
                            color: 'var(--white)',
                            cursor: 'pointer',
                        }} position="end" onClick={handleSearchForMedia}
                    >
                        <SearchIcon />
                    </LoadingButton>
                </Grid>
                
                <Grid item xs={12}>
                    <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" className="addMediaTabs" sx={{ bgcolor: '#202124' }}>
                        <Tab className='colorWhite varelaFontTitle' label={showResult ? "Youtube ("+mediaSearchResultYoutube.length+")" : "Youtube"} />
                        <Tab className='colorWhite varelaFontTitle' label={showResult ? "Spotify ("+mediaSearchResultSpotify.length+")" : "Spotify"} />
                    </Tabs>

                    <Box sx={{ lineHeight: "15px", p: 1, pt: 0, mb: 0, paddingBottom:'90px !important' }}>
                        {tabIndex === 0 && (
                            <Box>
                                {isEmpty(mediaSearchResultYoutube) && (room.localeYoutubeGamingTrends.length > 0 && room.localeYoutubeMusicTrends.length > 0 && showYoutubeTrends) &&
                                    <Container sx={{padding:'0 !important', paddingBottom:'90px !important' }} maxWidth={false}>
                                        
                                        <Typography variant="h6" sx={{mt:1, ml:1}} className='colorWhite 'gutterBottom>
                                            {t('GeneralMusics')}
                                        </Typography>
                                        <YoutubeVideoSlider itemsArray={room.localeYoutubeMusicTrends} addingObject={addingObject} addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject} />

                                        <Typography variant="h6" sx={{mt:4, ml:1}} className='colorWhite 'gutterBottom>
                                            {'Gaming'}
                                        </Typography>
                                        <YoutubeVideoSlider itemsArray={room.localeYoutubeGamingTrends} addingObject={addingObject} addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject} />

                                        <Typography variant="h6" sx={{mt:4, ml:1}} className='colorWhite 'gutterBottom>
                                            {'Entertainment'}
                                        </Typography>
                                        <YoutubeVideoSlider itemsArray={room.localeYoutubeEntertainmentTrends} addingObject={addingObject} addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject} />

                                    </Container>
                                }

                                {!isEmpty(mediaSearchResultYoutube) &&
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                        {mediaSearchResultYoutube.map(function (media, idyt) {
                                            return (
                                                <SearchResultItem
                                                    key={idyt}
                                                    image={media.snippet.thumbnails.high.url}
                                                    title={cleanMediaTitle(media.snippet.title)}
                                                    source='youtube'
                                                    uid={uuid().slice(0, 10).toLowerCase()}
                                                    platformId={getYTVidId(media)}
                                                    addedBy={addingObject.addedBy}
                                                    description={media.snippet.description}
                                                    url={'https://www.youtube.com/watch?v=' + getYTVidId(media)}
                                                    date={dateFormat(media.snippet.publishedAt, 'd mmm yyyy')}
                                                    channelOrArtist={media.snippet.channelTitle}
                                                    addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject}
                                                />)
                                        })}
                                    </Grid>}
                            </Box>
                        )}
                        {tabIndex === 1 && (
                            <Box>
                                <SpotifyTab 
                                
                                    showResult={showResult}
                                    mediaSearchResultSpotify={mediaSearchResultSpotify}
                                    spotifyLinked={enablerSpotify.isLinked}
                                    spotifyUserDatas={currentUser.customDatas.spotifyConnect}
                                    currentUser={currentUser}
                                    spotifyTrendsTracks={spotifyTrendsTracks}
                                    spotifyTopTracks={spotifyTopTracks}
                                    addingObject={addingObject}
                                    handleCheckAndAddObjectToPlaylistFromObject={handleCheckAndAddObjectToPlaylistFromObject}
                                />
                            </Box>
                        )}
                    </Box> 
                </Grid>
            </Container>

                <Grid container onClick={(e) => changeOpenInComp(false)} ref={el => animatedElementsRef.push(el)} className='closeAddMediaModal animate__animated animate__fadeInUpBig animate__fast' >
                    <Button
                        className='modal_full_screen_close_left'
                        aria-label="close"
                        xs={12}
                    >
                        <KeyboardArrowDown className='colorWhite' sx={{ fontSize: '3.5em' }} />
                    </Button >
                    {playlistEmpty &&
                        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '1em' }} >
                            <Typography  sx={{color: 'var(--main-color-lighter)'}}  ref={el => animatedDownElementsRef.push(el)} className='animate__animated animate__fadeInDownBig animate__delay-1s animate__slow textCapitalize'> Playlist <b>{playlistId}</b></Typography>
                            <Typography sx={{ display: 'block', width: '100%', ml: 0, fontSize: '12px' }}  ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInUpBig animate__delay-1s animate__slow colorWhite'> Playlist {t('GeneralEmpty')} </Typography>
                        </Box>
                    }
                    {isVarExist(room.playlistUrls) && !playlistEmpty &&
                        <Box sx={{ display: 'flex', flexDirection: 'column', p: '8px', pl:0 }}>
                           <Typography sx={{ display: 'block', width: '100%', ml: 0, pl: 0, fontSize: '12px' }}  ref={el => animatedDownElementsRef.push(el)} className='animate__animated animate__fadeInDownBig animate__delay-0s animate__slow colorWhite textCapitalize'> Playlist <b>{playlistId}</b></Typography>

                            <Box 
                             ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInUpBig animate__delay-0s animate__slow colorWhite'
                                sx={{display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center', width: '100%', ml: 1, mt: 1, fontSize: '10px' }} >
                                    <SoundWave waveNumber={7} isPlayingOrNo={roomIsPlaying} />
                                    <Typography fontSize="small" component={'span'} className='varelaFontTitle max-lined max-line-2' >
                                        {getDisplayTitle(room.playlistUrls[playerIdPlayed])}
                                    </Typography>
                            </Box>
                        </Box>
                    }
                </Grid>
        </SwipeableDrawer>
    )
};

export default withTranslation()(RoomModalAddMedia);
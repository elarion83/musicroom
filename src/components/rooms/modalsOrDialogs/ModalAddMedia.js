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
import { YTV3APIDurationToReadable, cleanMediaTitle, delay, enablersDurationToReadable, getArtistsSpotify, getDisplayTitle, getLocale, getYTVidId, isEmpty, isProdEnv, isVarExist, isVarExistNotEmpty } from '../../../services/utils';
import { withTranslation } from 'react-i18next';
import { Button, Dialog, SwipeableDrawer, Typography } from '@mui/material';
import SoundWave from "../../../services/SoundWave";
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { searchTextArray, spotifyApiSearchObject, youtubeApiSearchObject, youtubeApiVideoInfoParams } from '../../../services/utilsArray';
import { KeyboardArrowDown } from '@mui/icons-material';
import  NewContentslider  from '../../../services/YoutubeVideoSlider';
import SearchResultItem from '../SearchResultItem';
import { mockYoutubeSearchResoltForVald, mockYoutubeSearchResultForVald, mockYoutubeTrendResult } from '../../../services/mockedArray';
import YoutubeVideoSlider from '../../../services/YoutubeVideoSlider';
import { returnAnimateReplace } from '../../../services/animateReplace';
const RoomModalAddMedia = ({ t, open,youtubeLocaleTrends, room, changeOpen, roomIsPlaying, currentUser, validatedObjectToAdd, DeezerTokenProps }) => {
    const [mediaSearchResultYoutube, setMediaSearchResultYoutube] = useState([]);
    const [mediaSearchResultSpotify, setMediaSearchResultSpotify] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedTerm, setSearchedTerm] = useState('');
    const [recentlyAdded, setRecentlyAdded] = useState(false);
    const [recentlyAddedTitle, setRecentlyAddedTitle] = useState('');
    const [showYoutubeTrends, setShowYoutubeTrends] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const animatedElementsRef = [];
    const animatedDownElementsRef = [];

    const [needAnimationReplace, setNeedAnimationReplace] = useState(false);

    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    const addingObject = { title: '', deleted: false, source: '', url: '', addedBy: currentUser.displayName };

    async function changeOpenInComp(openOrNot) {
        returnAnimateReplace(animatedElementsRef, {In:"Out", Up:"Down", animate__delay:'animate__delay-1s'}, /In|Up|animate__delay/gi);
        returnAnimateReplace(animatedDownElementsRef, {Out:"In", Down:"Up", animate__delay:'animate__delay-1s'}, /Out|Down|animate__delay/gi);
        await delay(200);
        setNeedAnimationReplace(true);
        changeOpen(openOrNot);
    }


	useEffect(() => {
        if(open && needAnimationReplace) {
            returnAnimateReplace(animatedDownElementsRef, {Out:"In", Up:"Down", animate__delay:'animate__delay-1s'}, /Out|Up|animate__delay/gi);
            returnAnimateReplace(animatedElementsRef, {Out:"In", Down:"Up", animate__delay:'animate__delay-1s'}, /Out|Down|animate__delay/gi);
        }
	}, [open]); 

    async function handleCheckAndAddObjectToPlaylistFromObject(objectFormatted) {
        validatedObjectToAdd(objectFormatted);

        setRecentlyAdded(false);
        await delay(100);
        setRecentlyAddedTitle(objectFormatted.title);
        addingObject.title = '';
        addingObject.source = '';
        addingObject.url = '';
        addingObject.platformId = '';
        setRecentlyAdded(true);
        await delay(6000);
        setRecentlyAdded(false);
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

    async function mockEndYoutubeResults() {
        
    }

    async function handleSearchForMedia() {

        let spotifyEnabler = room.enablerSpotify;
        setIsSearching(true);
        if (searchTerm !== '') {
            if (validator.isURL(searchTerm.trim())) {
                addMediaFromUrl(searchTerm);
            } else {

                if(isProdEnv()) {
                    axios.get(process.env.REACT_APP_YOUTUBE_SEARCH_URL, {
                        params: youtubeApiSearchObject(searchTerm,24, 'relevance')
                    })
                    .then(function (response) {
                        setMediaSearchResultYoutube(response.data.items);
                        setShowYoutubeTrends(false);
                        setIsSearching(false);
                    });

                } else {
                    
                    if (spotifyEnabler.isLinked) {
                        await axios.get("https://api.spotify.com/v1/search", {
                            headers: { Authorization: `Bearer ${spotifyEnabler.token}` },
                            params: spotifyApiSearchObject(searchTerm)
                        }).then(function (response) {
                            console.log(response);
                            setMediaSearchResultSpotify(response.data.tracks.items);
                        });
                    }
                    setMediaSearchResultYoutube(mockYoutubeSearchResultForVald);
                    setShowYoutubeTrends(false);
                    setIsSearching(false);
                }
            }
            setSearchedTerm(searchTerm);
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
                swipeAreaWidth={room.playlistEmpty ? 350 : 100}
                onClose={(e) => changeOpen(false)}
                onOpen={(e) => changeOpen(true)}
                open={open}
            >
            <Container maxWidth={false} className="full_width_modal_content_container">

                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', position:'relative', mt:1 }} className="autowriter_container">
                    <Typed
                        strings={searchTextArray()}
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

                {room.localeYoutubeTrends.length > 0 && room.localeYoutubeMusicTrends.length > 0 && showYoutubeTrends &&
                <Container sx={{padding:'0 !important', paddingBottom:'90px !important' }} maxWidth={false}>
                    
                    <Typography variant="h6" sx={{mt:1, ml:1}} className='colorWhite 'gutterBottom>
                        {t('GeneralSmthTrendings', {what:'Videos'})}
                    </Typography>
                    <YoutubeVideoSlider itemsArray={room.localeYoutubeTrends} addingObject={addingObject} addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject} />

                    <Typography variant="h6" sx={{mt:4, ml:1}} className='colorWhite 'gutterBottom>
                        {t('GeneralSmthTrendings', {what:t('GeneralMusics')})}
                    </Typography>
                    <YoutubeVideoSlider itemsArray={room.localeYoutubeMusicTrends} addingObject={addingObject} addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject} />

                </Container>}

                {!(showYoutubeTrends) && <Grid item xs={12}>
                    <Tabs value={tabIndex} onChange={handleTabChange} sx={{ bgcolor: '#202124' }}>
                        <Tab sx={{ color: 'var(--white)' }} label="Youtube" disabled={mediaSearchResultYoutube.length > 1 ? false : true} />
                        <Tab sx={{ color: 'var(--white)' }} label="Spotify" disabled={mediaSearchResultSpotify && mediaSearchResultSpotify.length > 1 ? false : true} />
                    </Tabs>
                    <Box sx={{ lineHeight: "15px", p: 0, pt: 0, mb: 0, paddingBottom:'90px !important' }}>
                        {tabIndex === 0 && (
                            <Box>
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
                                {!isEmpty(mediaSearchResultSpotify) && <Grid item xs={12}>
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                        {mediaSearchResultSpotify.map(function (media, idsp) {
                                            return (
                                                <SearchResultItem
                                                    key={idsp}
                                                    image={media.album.images[0].url}
                                                    title={media.name+ ' - '+media.artists[0].name}
                                                    source='spotify'
                                                    uid={uuid().slice(0, 10).toLowerCase()}
                                                    platformId={media.uri}
                                                    addedBy={addingObject.addedBy}
                                                    url={media.uri}
                                                    duration={enablersDurationToReadable(media.duration_ms, 'spotify')}
                                                    date={dateFormat(media.album.release_date, 'd mmm yyyy')}
                                                    channelOrArtist={getArtistsSpotify(media.artists)}
                                                    addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject}
                                                />)
                                        })}
                                    </Grid>
                                </Grid>}
                            </Box>
                        )}
                   {/*     {tabIndex === 2 && (
                            <Box>
                                {mediaSearchResultDeezer.length > 1 &&
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                        {mediaSearchResultDeezer.map(function (media, idde) {
                                            return (
                                                <SearchResultItem
                                                    key={idde}
                                                    image={'https://e-cdn-images.dzcdn.net/images/cover/' + media.md5_image + '/345x345-000000-80-0-0.jpg'}
                                                    title={media.artist.name + ' - ' + media.title}
                                                    source='deezer'
                                                    uid={uuid().slice(0, 10).toLowerCase()}
                                                    platformId={media.id}
                                                    addedBy={addingObject.addedBy}
                                                    url={media.preview}
                                                    channelOrArtist={media.artist.name}
                                                    album={media.album.title}
                                                    addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject}
                                                />)
                                        })}
                                    </Grid>}
                            </Box>
                        )}
                        {tabIndex === 3 && (
                            <Box>
                                {mediaSearchResultDailyMotion.length > 1 && <Grid item xs={12}>
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                        {mediaSearchResultDailyMotion.map(function (media, iddm) {
                                            return (
                                                <SearchResultItem
                                                    key={iddm}
                                                    image={media.thumbnail_url}
                                                    title={media.title}
                                                    duration={media.duration}
                                                    source='dailymotion'
                                                    uid={uuid().slice(0, 10).toLowerCase()}
                                                    platformId={media.id}
                                                    channelOrArtist={media['owner.screenname']}
                                                    addedBy={addingObject.addedBy}
                                                    url={'https://www.dailymotion.com/video/' + media.id}
                                                    addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject}
                                                />)
                                        })}
                                    </Grid>
                                </Grid>}
                            </Box>
                        )}  */}
                    </Box> 
                </Grid>}
                <Snackbar
                    open={recentlyAdded}
                    autoHideDuration={4000}
                    sx={{ borderRadius: '2px', zIndex:2501, mb:4, bottom:'45px' }}
                    message={recentlyAddedTitle +" "+ t('GeneralAdded')+" !"}
                />
            </Container>

                <Grid container onClick={(e) => changeOpenInComp(false)} ref={el => animatedElementsRef.push(el)} className='closeAddMediaModal animate__animated animate__fadeInUpBig animate__delay-1s animate__fast' >
                    <Button
                        className='modal_full_screen_close_left'
                        aria-label="close"
                        xs={12}
                    >
                        <KeyboardArrowDown className='colorWhite' sx={{ fontSize: '3.5em' }} />
                    </Button >
                    {room.playlistEmpty &&
                        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '1em' }} >
                            <Typography  sx={{color: 'var(--main-color-lighter)'}}  ref={el => animatedDownElementsRef.push(el)} className='animate__animated animate__fadeInDownBig animate__delay-1s animate__slow textCapitalize'> Playlist <b>{room.id}</b></Typography>
                            <Typography sx={{ display: 'block', width: '100%', ml: 0, fontSize: '12px' }}  ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInUpBig animate__delay-1s animate__slow colorWhite'> Playlist {t('GeneralEmpty')} </Typography>
                        </Box>
                    }
                    {isVarExist(room.playlistUrls) && !room.playlistEmpty &&
                        <Box sx={{ display: 'flex', flexDirection: 'column', p: '8px', pl:0 }}>
                           <Typography sx={{ display: 'block', width: '100%', ml: 0, pl: 0, fontSize: '12px' }}  ref={el => animatedDownElementsRef.push(el)} className='animate__animated animate__fadeInDownBig animate__delay-1s animate__slow colorWhite textCapitalize'> Playlist <b>{room.id}</b></Typography>

                            <Box 
                             ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInUpBig animate__delay-1s animate__slow colorWhite'
                                sx={{display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center', width: '100%', ml: 1, mt: 1, fontSize: '10px' }} >
                                    <SoundWave waveNumber={7} isPlayingOrNo={roomIsPlaying} />
                                    <Typography fontSize="small" component={'span'} className='varelaFontTitle max-lined max-line-2 firstLetterCapitalize' >
                                        {getDisplayTitle(room.playlistUrls[room.playing])}
                                    </Typography>
                            </Box>
                        </Box>
                    }
                </Grid>
        </SwipeableDrawer>
    )
};

export default withTranslation()(RoomModalAddMedia);
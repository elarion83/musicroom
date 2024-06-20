import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from "axios";
import dateFormat from "dateformat";
import React, { useState } from "react";
import Typed from "react-typed";
import { v4 as uuid } from 'uuid';

import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from "@mui/lab";
import Snackbar from '@mui/material/Snackbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import validator from 'validator';
import SearchResultItem from '../searchResultItem';
import { YTV3APIDurationToReadable, cleanMediaTitle, getDisplayTitle, getLocale, getYTVidId, isProdEnv } from '../../../services/utils';
import { withTranslation } from 'react-i18next';
import { Button, Dialog, SwipeableDrawer, Typography } from '@mui/material';
import SoundWave from "../../../services/SoundWave";
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { searchTextArray, spotifyApiSearchObject, youtubeApiSearchObject, youtubeApiVideoInfoParams } from '../../../services/utilsArray';
import { KeyboardArrowDown } from '@mui/icons-material';
import  NewContentslider  from '../../../services/YoutubeVideoSlider';
import SearchResultItemNew from '../searchResultItemNew';
import { mockYoutubeSearchResoltForVald, mockYoutubeSearchResultForVald, mockYoutubeTrendResult } from '../../../services/mockedArray';
import YoutubeVideoSlider from '../../../services/YoutubeVideoSlider';
const RoomModalAddMedia = ({ t, open,youtubeLocaleTrends, room, changeOpen, roomIsPlaying, currentUser, validatedObjectToAdd, spotifyTokenProps, DeezerTokenProps }) => {
    const [mediaSearchResultYoutube, setMediaSearchResultYoutube] = useState([]);
    const [mediaSearchResultSpotify, setMediaSearchResultSpotify] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedTerm, setSearchedTerm] = useState('');
    const [recentlyAdded, setRecentlyAdded] = useState(false);
    const [recentlyAddedTitle, setRecentlyAddedTitle] = useState('');
    const [showYoutubeTrends, setShowYoutubeTrends] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const addingObject = { title: '', deleted: false, source: '', url: '', addedBy: currentUser.displayName };


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
        await axios.get('https://www.googleapis.com/youtube/v3/videos', { params: youtubeApiVideoInfoParams(videoId) })
            .then(function (response) {
                addingObject.title = cleanMediaTitle(response.data.items[0].snippet.title);
            });
    }

    async function handleSearchForMedia() {
        setIsSearching(true);
        if (searchTerm !== '') {
            if (validator.isURL(searchTerm.trim())) {
                addingObject.url = searchTerm.trim();
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
            } else {

                if(isProdEnv()) {
                    axios.get(process.env.REACT_APP_YOUTUBE_SEARCH_URL, {
                        params: youtubeApiSearchObject(searchTerm,12)
                    })
                    .then(function (response) {
                        setMediaSearchResultYoutube(response.data.items);
                        setShowYoutubeTrends(false);
                        setIsSearching(false);
                    });

                    if (spotifyTokenProps.length !== 0) {
                        await axios.get("https://api.spotify.com/v1/search", {
                            headers: { Authorization: `Bearer ${spotifyTokenProps}` },
                            params: spotifyApiSearchObject(searchTerm)
                        }).then(function (response) {
                            setMediaSearchResultSpotify(response.data.tracks.items);
                        });
                    }
                } else {
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
            <Container sx={{ padding: '3em', pt: 0, height: '100vh', zIndex: 3 }} maxWidth={false} className="full_width_modal_content_container">

                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row' }} className="autowriter_container">
                    <Typed
                        strings={searchTextArray()}
                        typeSpeed={5}
                        showCursor={true}
                        backSpeed={15}
                        attr="placeholder"
                        loop
                         >
                        <input
                            id="addMediaSearchInput"
                            className="input_big typed"
                            type='text'
                            variant="standard"
                            onKeyPress={(ev) => { if (ev.key === 'Enter') { handleSearchForMedia() } }}
                            onChange={e => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            style={{ width: '100%', height: '100%', flexGrow: 1, paddingRight: '0', bgcolor: 'rgba(255, 255, 255, 0.1)', pl: 2 }}
                        />
                    </Typed>
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
                <Container sx={{padding:'0 !important'}} maxWidth={false}>
                    
                    <Typography variant="h6" sx={{mt:1, ml:1}} gutterBottom>
                        {t('GeneralSmthTrendings', {what:'Videos'})}
                    </Typography>
                    <YoutubeVideoSlider itemsArray={room.localeYoutubeTrends} addingObject={addingObject} addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject} />

                    <Typography variant="h6" sx={{mt:4, ml:1}} gutterBottom>
                        {t('GeneralSmthTrendings', {what:t('GeneralMusics')})}
                    </Typography>
                    <YoutubeVideoSlider itemsArray={room.localeYoutubeMusicTrends} addingObject={addingObject} addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject} />

                </Container>}

                {mediaSearchResultYoutube.length > 0 && <Grid item xs={12}>
                    <Typography variant="h6" sx={{mt:2}} gutterBottom>
                        {t('ModalAddMediaSearchResultTitle', {searchTerm:searchedTerm})}
                    </Typography>
                   {/* <Tabs value={tabIndex} onChange={handleTabChange} sx={{ bgcolor: '#202124' }}>
                        <Tab sx={{ color: 'var(--white)' }} label="Youtube" disabled={mediaSearchResultYoutube.length > 1 ? false : true} />
                        <Tab sx={{ color: 'var(--white)' }} label="Spotify" disabled={mediaSearchResultSpotify && mediaSearchResultSpotify.length > 1 ? false : true} />
                       {/* <Tab sx={{ color: 'var(--white)' }} label="Deezer" disabled={mediaSearchResultDeezer && mediaSearchResultDeezer.length > 1 ? false : true} />
                        <Tab sx={{ color: 'var(--white)' }} label="Dailymotion" disabled={mediaSearchResultDailyMotion.length > 1 ? false : true} /> 
                    </Tabs> */}
                    <Box sx={{ lineHeight: "15px", p: 0, pt: 0, mb: 0 }}>
                        {tabIndex === 0 && (
                            <Box>
                                {mediaSearchResultYoutube.length > 0 &&
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                        {mediaSearchResultYoutube.map(function (media, idyt) {
                                            return (
                                                <SearchResultItemNew
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
                                {mediaSearchResultSpotify.length > 1 && <Grid item xs={12}>
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                        {mediaSearchResultSpotify.map(function (media, idsp) {
                                            return (
                                                <SearchResultItemNew
                                                    key={idsp}
                                                    image={media.album.images[0].url}
                                                    title={media.artists[0].name + ' - ' + media.name}
                                                    source='spotify'
                                                    uid={uuid().slice(0, 10).toLowerCase()}
                                                    platformId={media.uri}
                                                    addedBy={addingObject.addedBy}
                                                    url={media.uri}
                                                    date={dateFormat(media.album.release_date, 'd mmm yyyy')}
                                                    channelOrArtist={media.artists[0].name}
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
                    autoHideDuration={6000}
                    sx={{ borderRadius: '2px', zIndex:2501, mb:4, bottom:'40px' }}
                    message={recentlyAddedTitle + " ajouté !"}
                />
            </Container>

            <Grid className="" sx={{ bgcolor: '#202124', pb: 0, cursor:'pointer', flexFlow: 'nowrap', position:'fixed', bottom:0, zIndex:100 }} container 
                    onClick={(e) => changeOpen(false)} >
                <Button
                    className='modal_full_screen_close_left'
                    aria-label="close"
                    sx={{ bgcolor: '#131416', mr: 1, borderRadius: 0 }}
                    xs={12}
                >
                    <KeyboardArrowDown sx={{ fontSize: '3.5em', color: 'var(--main-color)', fill: 'var(--main-color)' }} className='animate__animated animate__fadeInLeft animate__fast' />
                </Button >
                {room.playlistEmpty &&
                    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '1em' }}>
                        <Typography component="span"> Playlist {t('GeneralEmpty')} </Typography>
                        <Typography sx={{ color: 'var(--white)', display: 'block', width: '100%', ml: 0, fontSize: '12px', textTransform: 'uppercase' }} > Playlist <b>{room.id}</b></Typography>
                    </Box>}
                {typeof (room.playlistUrls) !== 'undefined' && !room.playlistEmpty &&
                    <Box sx={{ display: 'flex', flexDirection: 'column', p: '8px' }}>
                        <Typography sx={{ color: 'var(--white)', display: 'block', width: '100%', ml: 0, pl: 0, fontSize: '12px', textTransform: 'uppercase' }} > Playlist <b>{room.id}</b></Typography>

                        <Box sx={{ color: 'var(--white)', display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center', width: '100%', ml: 1, mt: 1, fontSize: '10px', textTransform: 'uppercase' }} >
                            <SoundWave waveNumber={7} isPlayingOrNo={roomIsPlaying} />
                            <Typography fontSize="small" component={'span'} className='varelaFontTitle' >
                                {getDisplayTitle(room.playlistUrls[room.playing])}
                            </Typography>
                        </Box>
                    </Box>}
            </Grid>
        </SwipeableDrawer>
    )
};

export default withTranslation()(RoomModalAddMedia);
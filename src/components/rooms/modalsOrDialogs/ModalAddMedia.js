import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from "axios";
import dateFormat from "dateformat";
import React, { useState, useEffect } from "react";
import Typed from "react-typed";
import { v4 as uuid } from 'uuid';

import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from "@mui/lab";
import Snackbar from '@mui/material/Snackbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import validator from 'validator';
import SearchResultItem from '../searchResultItem';
import { cleanMediaTitle, getDisplayTitle } from '../../../services/utils';
import { withTranslation } from 'react-i18next';
import { Button, Dialog, Typography } from '@mui/material';
import SoundWave from "../../../services/SoundWave";
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const RoomModalAddMedia = ({ t, open, room, changeOpen, roomIsPlaying, currentUser, validatedObjectToAdd, spotifyTokenProps, DeezerTokenProps }) => {

    const [mediaSearchResultYoutube, setMediaSearchResultYoutube] = useState([]);
    const [mediaSearchResultDailyMotion, setMediaSearchResultDailyMotion] = useState([]);
    const [mediaSearchResultDeezer, setMediaSearchResultDeezer] = useState([]);
    const [mediaSearchResultSpotify, setMediaSearchResultSpotify] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [recentlyAdded, setRecentlyAdded] = useState(false);
    const [recentlyAddedTitle, setRecentlyAddedTitle] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const [addingObject, setAddingObject] = useState({ title: '', deleted: false, source: '', url: '', addedBy: currentUser.displayName })


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
        var params = {
            part: 'snippet',
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
            id: videoId,
        };

        await axios.get('https://www.googleapis.com/youtube/v3/videos', { params: params })
            .then(function (response) {
                addingObject.title = cleanMediaTitle(response.data.items[0].snippet.title);
            })
            .catch(function (error) {
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
                setSearchTerm('');
                setIsSearching(false);
            } else {

                axios.get(process.env.REACT_APP_YOUTUBE_SEARCH_URL, {
                    params: {
                        part: 'snippet',
                        key: process.env.REACT_APP_YOUTUBE_API_KEY,
                        q: searchTerm,
                        relevanceLanguage:'fr',
                        regionCode:'fr',
                        maxResults: 12,
                        type: 'video'
                    }
                })
                    .then(function (response) {
                        setMediaSearchResultYoutube(response.data.items);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });

                fetch('https://api.dailymotion.com/videos?fields=id,thumbnail_url%2Ctitle&country=fr&search=' + searchTerm + '&limit=10')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setMediaSearchResultDailyMotion(responseJson.list);
                        setIsSearching(false);
                    });

                if (DeezerTokenProps.length !== 0) {
                    await axios.get(process.env.REACT_APP_BACK_FOLDER_URL + '/deezer/search?search=' + searchTerm + '&token=' + DeezerTokenProps)
                    .then(function (response) {
                        setMediaSearchResultDeezer(response.data.data);
                    });
                }

                if (spotifyTokenProps.length !== 0) {
                    await axios.get("https://api.spotify.com/v1/search", {
                        headers: { Authorization: `Bearer ${spotifyTokenProps}` },
                        params: {
                            q: searchTerm,
                            type: "track"
                        }
                    }).then(function (response) {
                        setMediaSearchResultSpotify(response.data.tracks.items);
                    });
                }
            }
        } else {
            setIsSearching(false);
        }
    }

    return (
        <Dialog
            fullScreen
            open={open}
            keepMounted
            TransitionComponent={SlideUp}
            onClose={(e) => changeOpen(false)}
            className='black_style_dialog'
        >

            <Grid sx={{ bgcolor: '#202124', pb: 0, flexFlow: 'nowrap' }} container  >
                <Button
                    className='modal_full_screen_close_left'
                    onClick={(e) => changeOpen(false)}
                    aria-label="close"
                    sx={{ bgcolor: '#131416', mr: 1, borderRadius: 0 }}
                    xs={12}
                >
                    <ArrowBackIosNewIcon sx={{ fontSize: '2em', color: 'var(--main-color)', fill: 'var(--main-color)' }} className='animate__animated animate__fadeInLeft animate__fast' />
                </Button >
                {room.playlistEmpty &&
                    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '1em' }}>
                        <Typography component="span"> Playlist {t('GeneralEmpty')} </Typography>
                        <Typography sx={{ color: 'var(--white)', display: 'block', width: '100%', ml: 0, fontSize: '12px', textTransform: 'uppercase' }} > #{room.id}</Typography>
                    </Box>}
                {typeof (room.playlistUrls) !== 'undefined' && !room.playlistEmpty &&
                    <Box sx={{ display: 'flex', flexDirection: 'column', p: '8px' }}>
                        <Typography sx={{ color: 'var(--white)', display: 'block', width: '100%', ml: 0, pl: 0, fontSize: '12px', textTransform: 'uppercase' }} > #{room.id}</Typography>

                        <Box sx={{ color: 'var(--white)', display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center', width: '100%', ml: 1, mt: 1, fontSize: '10px', textTransform: 'uppercase' }} >
                            <SoundWave waveNumber={7} isPlayingOrNo={roomIsPlaying} />
                            <Typography fontSize="small" component={'span'} className='varelaFontTitle' >
                                {getDisplayTitle(room.playlistUrls[room.playing])}
                            </Typography>
                        </Box>
                    </Box>}
            </Grid>
            <Container sx={{ padding: '3em', pt: 0, height: '100vh', zIndex: 3 }} className="full_width_modal_content_container">

                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row' }} className="autowriter_container">
                    <Typed
                        strings={[
                            t('GeneralSearchOn') + ' YOUTUBE, SPOTIFY',
                            'CHERCHE UNE MUSIQUE, UN CLIP, UN TUTO',
                            'UNE VIDEO DE DOMINGO, SQUEEZIE, AMINEMATUE',
                            'UN LIEN SOUNCLOUND OU YOUTUBE',
                            'HTTPS://WWW.YOUTUBE.COM/WATCH?V=MAVIDEO',
                            'HTTPS://SOUNDCLOUD.COM/THOMS-12/EBRIUS']}
                        typeSpeed={5}
                        showCursor={true}
                        backSpeed={15}
                        attr="placeholder"
                        loop >
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
                {mediaSearchResultYoutube.length > 1 && <Grid item xs={12}>
                    <Tabs value={tabIndex} onChange={handleTabChange} sx={{ bgcolor: '#202124' }}>
                        <Tab sx={{ color: 'var(--white)' }} label="Youtube" disabled={mediaSearchResultYoutube.length > 1 ? false : true} />
                        <Tab sx={{ color: 'var(--white)' }} label="Spotify" disabled={mediaSearchResultSpotify && mediaSearchResultSpotify.length > 1 ? false : true} />
                        <Tab sx={{ color: 'var(--white)' }} label="Deezer" disabled={mediaSearchResultDeezer && mediaSearchResultDeezer.length > 1 ? false : true} />
                        <Tab sx={{ color: 'var(--white)' }} label="Dailymotion" disabled={mediaSearchResultDailyMotion.length > 1 ? false : true} />
                    </Tabs>
                    <Box sx={{ lineHeight: "15px", p: 0, pt: 0, mb: 0 }}>
                        {tabIndex === 0 && (
                            <Box>
                                {mediaSearchResultYoutube.length > 1 &&
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                        {mediaSearchResultYoutube.map(function (media, idyt) {
                                            return (
                                                <SearchResultItem
                                                    key={idyt}
                                                    image={media.snippet.thumbnails.high.url}
                                                    title={cleanMediaTitle(media.snippet.title)}
                                                    source='youtube'
                                                    uid={uuid().slice(0, 10).toLowerCase()}
                                                    platformId={media.id.videoId}
                                                    addedBy={addingObject.addedBy}
                                                    url={'https://www.youtube.com/watch?v=' + media.id.videoId}
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
                                                <SearchResultItem
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
                        {tabIndex === 2 && (
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
                                                    source='dailymotion'
                                                    uid={uuid().slice(0, 10).toLowerCase()}
                                                    platformId={media.id}
                                                    addedBy={addingObject.addedBy}
                                                    url={'https://www.dailymotion.com/video/' + media.id}
                                                    addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject}
                                                />)
                                        })}
                                    </Grid>
                                </Grid>}
                            </Box>
                        )}
                    </Box>
                </Grid>}
                <Snackbar
                    open={recentlyAdded}
                    autoHideDuration={6000}
                    sx={{ borderRadius: '2px' }}
                    message={recentlyAddedTitle + " ajouté !"}
                />
            </Container>
        </Dialog>
    )
};

export default withTranslation()(RoomModalAddMedia);